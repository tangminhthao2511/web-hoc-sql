import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import { SEED_SQL } from './seedData';
import {
  GradeResult,
  PracticeChallenge,
  QueryResult,
  TableColumnInfo,
  TableSchemaInfo,
} from '../types/sql';

let sqlJsPromise: Promise<SqlJsStatic> | null = null;
let mainDb: Database | null = null;

async function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    sqlJsPromise = initSqlJs({
      locateFile: () => '/sql-wasm.wasm',
    });
  }
  return sqlJsPromise;
}

export async function initMainDatabase(): Promise<Database> {
  if (mainDb) return mainDb;
  const SQL = await getSqlJs();
  const db = new SQL.Database();
  db.run(SEED_SQL);
  mainDb = db;
  return mainDb;
}

export async function resetMainDatabase(): Promise<Database> {
  if (mainDb) {
    mainDb.close();
    mainDb = null;
  }
  return initMainDatabase();
}

export function translateSqlError(rawError: string): string {
  const msg = rawError.trim();
  if (/no such table:\s*(\S+)/i.test(msg)) {
    const match = msg.match(/no such table:\s*(\S+)/i);
    return `Không tìm thấy bảng "${match?.[1]}". Hãy kiểm tra lại tên bảng trong tab Sơ đồ dữ liệu (Schema)!`;
  }
  if (/no such column:\s*(\S+)/i.test(msg)) {
    const match = msg.match(/no such column:\s*(\S+)/i);
    return `Không tìm thấy cột "${match?.[1]}". Lưu ý: chuỗi văn bản trong SQL phải đặt trong dấu nháy đơn '...', còn tên cột dùng đúng chính tả trong bảng.`;
  }
  if (/ambiguous column name:\s*(\S+)/i.test(msg)) {
    const match = msg.match(/ambiguous column name:\s*(\S+)/i);
    return `Cột "${match?.[1]}" xuất hiện ở nhiều bảng đang JOIN! Hãy chỉ rõ tên bảng hoặc bí danh (ví dụ: c.${match?.[1]} hoặc o.${match?.[1]}).`;
  }
  if (/syntax error/i.test(msg)) {
    return `Lỗi cú pháp SQL (${msg}). Hãy kiểm tra dấu phẩy giữa các cột, dấu nháy đơn cho chuỗi, hoặc thứ tự các mệnh đề SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY.`;
  }
  if (/misuse of aggregate/i.test(msg)) {
    return `Không thể dùng hàm tổng hợp (COUNT, SUM, AVG...) trực tiếp trong WHERE! Hãy dùng HAVING hoặc Subquery/CTE.`;
  }
  if (/subquery returns more than 1 row/i.test(msg)) {
    return `Subquery trả về nhiều hơn 1 dòng trong khi toán tử (=, >, <) chỉ nhận 1 giá trị. Hãy dùng IN hoặc thêm LIMIT 1 nếu phù hợp.`;
  }
  return msg;
}

function detectStatementType(sql: string): QueryResult['statementType'] {
  const cleaned = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
    .toUpperCase();
  if (cleaned.startsWith('SELECT') || cleaned.startsWith('WITH') || cleaned.startsWith('PRAGMA') || cleaned.startsWith('EXPLAIN')) {
    return 'SELECT';
  }
  if (cleaned.startsWith('INSERT') || cleaned.startsWith('UPDATE') || cleaned.startsWith('DELETE')) {
    return 'DML';
  }
  if (cleaned.startsWith('CREATE') || cleaned.startsWith('ALTER') || cleaned.startsWith('DROP')) {
    return 'DDL';
  }
  return 'OTHER';
}

export function runQueryOnDb(db: Database, sql: string): QueryResult {
  const trimmed = sql.trim();
  if (!trimmed) {
    throw new Error('Vui lòng nhập câu lệnh SQL trước khi chạy!');
  }

  const start = performance.now();
  const execResults = db.exec(trimmed);
  const elapsed = Math.max(0.1, Number((performance.now() - start).toFixed(2)));
  const changes = db.getRowsModified();
  const stmtType = detectStatementType(trimmed);

  if (execResults.length === 0) {
    return {
      columns: [],
      rows: [],
      executionTimeMs: elapsed,
      rowCount: 0,
      statementType: stmtType,
      changes,
    };
  }

  const last = execResults[execResults.length - 1];
  return {
    columns: last.columns,
    rows: last.values,
    executionTimeMs: elapsed,
    rowCount: last.values.length,
    statementType: stmtType,
    changes,
  };
}

export async function executeUserQuery(sql: string): Promise<QueryResult> {
  const db = await initMainDatabase();
  return runQueryOnDb(db, sql);
}

export async function getSchemaInfo(): Promise<TableSchemaInfo[]> {
  const db = await initMainDatabase();
  const tablesRes = db.exec(
    `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid;`
  );
  if (!tablesRes.length) return [];

  const tableNames = tablesRes[0].values.map((v) => String(v[0]));
  const schemas: TableSchemaInfo[] = [];

  for (const tableName of tableNames) {
    const colRes = db.exec(`PRAGMA table_info("${tableName}");`);
    const fkRes = db.exec(`PRAGMA foreign_key_list("${tableName}");`);
    const countRes = db.exec(`SELECT COUNT(*) FROM "${tableName}";`);
    const sampleRes = db.exec(`SELECT * FROM "${tableName}" LIMIT 5;`);

    const fkMap = new Map<string, { table: string; to: string }>();
    if (fkRes.length) {
      for (const row of fkRes[0].values) {
        const refTable = String(row[2]);
        const fromCol = String(row[3]);
        const toCol = String(row[4]);
        fkMap.set(fromCol, { table: refTable, to: toCol });
      }
    }

    const columns: TableColumnInfo[] = colRes.length
      ? colRes[0].values.map((row) => {
          const name = String(row[1]);
          return {
            cid: Number(row[0]),
            name,
            type: String(row[2] || 'TEXT'),
            notnull: Boolean(row[3]),
            pk: Number(row[5]) > 0,
            fk: fkMap.get(name),
          };
        })
      : [];

    schemas.push({
      name: tableName,
      columns,
      rowCount: countRes.length ? Number(countRes[0].values[0][0]) : 0,
      sampleRows: sampleRes.length ? sampleRes[0].values : [],
    });
  }

  return schemas;
}

function normalizeCell(val: unknown): string {
  if (val === null || val === undefined) return '__NULL__';
  if (typeof val === 'number') {
    // Handle tiny floating point precision differences gracefully
    return Number.isInteger(val) ? String(val) : String(Number(val.toFixed(4)));
  }
  return String(val);
}

function compareResults(
  userRes: QueryResult,
  expectedRes: QueryResult,
  requireOrder: boolean
): { match: boolean; reason?: string } {
  if (userRes.columns.length !== expectedRes.columns.length) {
    return {
      match: false,
      reason: `Số lượng cột chưa khớp: bạn đang chọn ${userRes.columns.length} cột (${userRes.columns.join(', ')}), đáp án cần ${expectedRes.columns.length} cột (${expectedRes.columns.join(', ')}).`,
    };
  }

  const userCols = userRes.columns.map((c) => c.toLowerCase());
  const expCols = expectedRes.columns.map((c) => c.toLowerCase());
  for (let i = 0; i < expCols.length; i++) {
    if (userCols[i] !== expCols[i]) {
      return {
        match: false,
        reason: `Tên hoặc thứ tự cột chưa khớp tại vị trí ${i + 1}: nhận được "${userRes.columns[i]}", kỳ vọng "${expectedRes.columns[i]}". (Kiểm tra lại AS alias nếu đề bài yêu cầu!)`,
      };
    }
  }

  if (userRes.rows.length !== expectedRes.rows.length) {
    return {
      match: false,
      reason: `Số lượng dòng trả về chưa khớp: truy vấn của bạn trả về ${userRes.rows.length} dòng, trong khi đáp án chuẩn có ${expectedRes.rows.length} dòng.`,
    };
  }

  const serializeRow = (row: unknown[]) => row.map(normalizeCell).join(' | ');
  const userRows = userRes.rows.map(serializeRow);
  const expRows = expectedRes.rows.map(serializeRow);

  if (requireOrder) {
    for (let i = 0; i < expRows.length; i++) {
      if (userRows[i] !== expRows[i]) {
        return {
          match: false,
          reason: `Dữ liệu hoặc thứ tự sắp xếp tại dòng ${i + 1} chưa khớp với đáp án chuẩn. Hãy kiểm tra lại điều kiện lọc hoặc ORDER BY!`,
        };
      }
    }
    return { match: true };
  }

  const userSorted = [...userRows].sort();
  const expSorted = [...expRows].sort();
  for (let i = 0; i < expSorted.length; i++) {
    if (userSorted[i] !== expSorted[i]) {
      return {
        match: false,
        reason: `Giá trị dữ liệu trả về chưa khớp hoàn toàn với kết quả kỳ vọng. Hãy bấm tab "Kết quả mẫu" để đối chiếu nhé!`,
      };
    }
  }

  return { match: true };
}

export async function gradeChallenge(
  userSql: string,
  challenge: PracticeChallenge
): Promise<GradeResult> {
  const SQL = await getSqlJs();
  const userDb = new SQL.Database();
  const expDb = new SQL.Database();

  try {
    userDb.run(SEED_SQL);
    expDb.run(SEED_SQL);

    let userResult: QueryResult;
    try {
      userResult = runQueryOnDb(userDb, userSql);
      if (challenge.verifySql) {
        userResult = runQueryOnDb(userDb, challenge.verifySql);
      }
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : String(err);
      return {
        passed: false,
        message: 'Truy vấn của bạn gặp lỗi SQL!',
        error: translateSqlError(rawMsg),
      };
    }

    let expectedResult = runQueryOnDb(expDb, challenge.solutionSql);
    if (challenge.verifySql) {
      expectedResult = runQueryOnDb(expDb, challenge.verifySql);
    }

    const comparison = compareResults(
      userResult,
      expectedResult,
      Boolean(challenge.requireOrder)
    );

    if (comparison.match) {
      return {
        passed: true,
        message: `Chính xác tuyệt đối! Meow! Bạn nhận được +${challenge.xp} XP 🎉`,
        userResult,
        expectedResult,
      };
    }

    return {
      passed: false,
      message: 'Truy vấn chạy được nhưng kết quả chưa khớp yêu cầu.',
      details: comparison.reason,
      userResult,
      expectedResult,
    };
  } finally {
    userDb.close();
    expDb.close();
  }
}

export async function previewExpectedResult(
  challenge: PracticeChallenge
): Promise<QueryResult> {
  const SQL = await getSqlJs();
  const expDb = new SQL.Database();
  try {
    expDb.run(SEED_SQL);
    let res = runQueryOnDb(expDb, challenge.solutionSql);
    if (challenge.verifySql) {
      res = runQueryOnDb(expDb, challenge.verifySql);
    }
    return res;
  } finally {
    expDb.close();
  }
}
