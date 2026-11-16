import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  History,
  Database,
  Trash2,
} from 'lucide-react';
import { QueryResult, TableSchemaInfo } from '../types/sql';
import {
  executeUserQuery,
  resetMainDatabase,
  translateSqlError,
} from '../db/sqlEngine';
import { SqlEditor } from './SqlEditor';
import { ResultTable } from './ResultTable';
import { SchemaExplorer } from './SchemaExplorer';
import { MeowMascot } from './MeowMascot';

interface PlaygroundViewProps {
  schemas: TableSchemaInfo[];
  onRefreshSchemas: () => Promise<void>;
  initialSql?: string;
}

const PRESET_QUERIES = [
  {
    label: '🏆 Top khách hàng chi tiêu nhiều nhất',
    sql: `SELECT\n  c.full_name,\n  c.city,\n  c.tier,\n  COUNT(o.id) AS so_don,\n  SUM(o.total_amount) AS tong_chi_tieu\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'completed'\nGROUP BY c.id, c.full_name, c.city, c.tier\nORDER BY tong_chi_tieu DESC;`,
  },
  {
    label: '📈 Doanh thu lũy kế & tăng trưởng từng ngày',
    sql: `SELECT\n  metric_date,\n  revenue,\n  LAG(revenue, 1) OVER (ORDER BY metric_date) AS hom_qua,\n  SUM(revenue) OVER (ORDER BY metric_date) AS luy_ke\nFROM daily_metrics\nORDER BY metric_date ASC;`,
  },
  {
    label: '🌳 Sơ đồ nhân sự & Quản lý (Self Join)',
    sql: `SELECT\n  e.name AS nhan_vien,\n  e.department,\n  e.role,\n  e.salary,\n  COALESCE(m.name, 'CEO / Cao nhất') AS quan_ly_truc_tiep\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id\nORDER BY e.salary DESC;`,
  },
  {
    label: '🛠️ Thử tạo bảng mới & Thêm dữ liệu',
    sql: `CREATE TABLE IF NOT EXISTS meow_notes (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  title TEXT NOT NULL,\n  created_at TEXT DEFAULT CURRENT_TIMESTAMP\n);\n\nINSERT INTO meow_notes (title) VALUES ('Học xong JOIN và Window Functions!');\nSELECT * FROM meow_notes;`,
  },
];

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  schemas,
  onRefreshSchemas,
  initialSql,
}) => {
  const [sql, setSql] = useState(initialSql || PRESET_QUERIES[0].sql);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async (queryOverride?: string) => {
    const targetSql = queryOverride ?? sql;
    setIsRunning(true);
    setError(null);
    try {
      const res = await executeUserQuery(targetSql);
      setResult(res);
      setHistory((prev) =>
        [targetSql, ...prev.filter((item) => item !== targetSql)].slice(0, 8)
      );
      if (res.statementType === 'DML' || res.statementType === 'DDL') {
        await onRefreshSchemas();
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err);
      setError(translateSqlError(raw));
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetDb = async () => {
    await resetMainDatabase();
    await onRefreshSchemas();
    setError(null);
    setResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      {/* Left Sidebar: Schema */}
      <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-card space-y-3 lg:max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-slate-900">
            <Database className="w-4 h-4 text-edu-600" />
            CSDL MeowMart ({schemas.length} bảng)
          </div>
          <button
            onClick={handleResetDb}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
            title="Khôi phục toàn bộ bảng về dữ liệu gốc"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset DB
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Bấm tên cột/bảng để chèn vào Editor. Bạn có thể tự do chạy SELECT, INSERT, UPDATE hoặc CREATE TABLE!
        </p>
        <SchemaExplorer
          schemas={schemas}
          onInsertSnippet={(snippet) =>
            setSql((prev) =>
              prev.endsWith(' ') || prev.endsWith('\n') ? prev + snippet : `${prev} ${snippet}`
            )
          }
        />
      </aside>

      {/* Main Sandbox Area */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-lg font-display font-extrabold text-slate-900">
                Phòng Thực Hành Tự Do (SQL DataLab)
              </h1>
              <p className="text-xs text-slate-500">
                Chạy SQLite WebAssembly trực tiếp trên trình duyệt — hỗ trợ đầy đủ CTE, Window Functions, JOIN & DDL.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSql('')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa trắng
              </button>
              <button
                onClick={() => handleRun()}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-edu-600 hover:bg-edu-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                Chạy SQL (Ctrl+Enter)
              </button>
            </div>
          </div>

          {/* Preset Quick Queries */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              Mẫu hay:
            </span>
            {PRESET_QUERIES.map((q) => (
              <button
                key={q.label}
                onClick={() => {
                  setSql(q.sql);
                  handleRun(q.sql);
                }}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          <SqlEditor
            value={sql}
            onChange={setSql}
            onRun={() => handleRun()}
            schemas={schemas}
            height="240px"
          />

          {error && (
            <MeowMascot mood="error" size={44} message={error} className="w-full" />
          )}

          {!error && result && (
            <ResultTable result={result} title="Kết quả DataLab" />
          )}

          {history.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <History className="w-3.5 h-3.5" />
                Lịch sử chạy gần đây
              </div>
              <div className="flex flex-wrap gap-1.5">
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSql(item)}
                    className="max-w-xs truncate text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600"
                    title={item}
                  >
                    {item.replace(/\s+/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
