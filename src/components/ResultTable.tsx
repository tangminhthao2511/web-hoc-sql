import React from 'react';
import { Download, Clock, Rows3, CheckCircle2 } from 'lucide-react';
import { QueryResult } from '../types/sql';

interface ResultTableProps {
  result: QueryResult;
  title?: string;
  compact?: boolean;
}

function formatCellValue(val: string | number | null | Uint8Array): React.ReactNode {
  if (val === null || val === undefined) {
    return (
      <span className="inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 text-slate-500 border border-slate-200">
        NULL
      </span>
    );
  }
  if (typeof val === 'number') {
    // Format large integers (likely VND prices or counts) cleanly while keeping IDs raw? Better keep raw numeric or format nicely?
    // Keep exact SQL value so users can verify exact grading!
    return <span className="font-mono text-slate-900">{val}</span>;
  }
  return <span className="text-slate-800">{String(val)}</span>;
}

export const ResultTable: React.FC<ResultTableProps> = ({
  result,
  title = 'Kết quả truy vấn',
  compact = false,
}) => {
  const handleExportCsv = () => {
    if (!result.columns.length) return;
    const escapeCsv = (v: unknown) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      result.columns.map(escapeCsv).join(','),
      ...result.rows.map((r) => r.map(escapeCsv).join(',')),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meowsql-result.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (result.columns.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center gap-3 text-sm text-emerald-900">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <p className="font-semibold">
            Thực thi lệnh {result.statementType} thành công!
          </p>
          <p className="text-xs text-emerald-700 mt-0.5">
            Số dòng bị ảnh hưởng: <strong>{result.changes ?? 0}</strong> · Thời gian:{' '}
            <strong>{result.executionTimeMs} ms</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-card">
      <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-slate-700">{title}</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-edu-50 text-edu-700 font-semibold">
            <Rows3 className="w-3.5 h-3.5" />
            {result.rowCount} dòng
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {result.executionTimeMs} ms
          </span>
        </div>
        {!compact && (
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-200/60 transition-colors"
            title="Xuất kết quả ra CSV"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        )}
      </div>

      <div className="overflow-auto max-h-72">
        <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
          <thead className="sticky top-0 bg-slate-100 z-10 shadow-[0_1px_0_0_#e2e8f0]">
            <tr>
              <th className="px-2.5 py-2 text-[11px] font-mono text-slate-400 w-9 text-center border-r border-slate-200">
                #
              </th>
              {result.columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2 font-mono font-semibold text-slate-700 whitespace-nowrap border-r last:border-r-0 border-slate-200"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={result.columns.length + 1}
                  className="px-4 py-6 text-center text-slate-500 italic"
                >
                  Truy vấn chạy thành công nhưng trả về 0 dòng dữ liệu.
                </td>
              </tr>
            ) : (
              result.rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="border-t border-slate-100 hover:bg-amber-50/40 transition-colors"
                >
                  <td className="px-2.5 py-1.5 text-[11px] font-mono text-slate-400 text-center border-r border-slate-100 bg-slate-50/40">
                    {rIdx + 1}
                  </td>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-3 py-1.5 whitespace-nowrap border-r last:border-r-0 border-slate-100 ${
                        typeof cell === 'number' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatCellValue(cell)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
