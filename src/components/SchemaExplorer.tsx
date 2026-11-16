import React, { useState } from 'react';
import { Table2, KeyRound, Link2, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { TableSchemaInfo } from '../types/sql';

interface SchemaExplorerProps {
  schemas: TableSchemaInfo[];
  onInsertSnippet?: (text: string) => void;
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({
  schemas,
  onInsertSnippet,
}) => {
  const [expandedTable, setExpandedTable] = useState<string | null>(
    schemas[1]?.name || schemas[0]?.name || null
  );
  const [previewTable, setPreviewTable] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {schemas.map((tbl) => {
        const isOpen = expandedTable === tbl.name;
        const isPreview = previewTable === tbl.name;

        return (
          <div
            key={tbl.name}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80">
              <button
                onClick={() => setExpandedTable(isOpen ? null : tbl.name)}
                className="flex items-center gap-2 text-left flex-1 min-w-0"
              >
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <Table2 className="w-4 h-4 text-edu-600 shrink-0" />
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 truncate">
                  {tbl.name}
                </span>
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600">
                  {tbl.rowCount} dòng
                </span>
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setPreviewTable(isPreview ? null : tbl.name)}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${
                    isPreview
                      ? 'bg-edu-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {isPreview ? 'Ẩn mẫu' : 'Xem mẫu'}
                </button>
                {onInsertSnippet && (
                  <button
                    onClick={() => onInsertSnippet(tbl.name)}
                    className="p-1 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                    title={`Chèn tên bảng ${tbl.name} vào Editor`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {isOpen && (
              <div className="px-3 py-2 border-t border-slate-100 divide-y divide-slate-100">
                {tbl.columns.map((col) => (
                  <div
                    key={col.name}
                    className="py-1.5 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {col.pk && (
                        <span
                          title="Khóa chính (Primary Key)"
                          className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold"
                        >
                          <KeyRound className="w-2.5 h-2.5" />
                          PK
                        </span>
                      )}
                      {col.fk && (
                        <span
                          title={`Khóa ngoại trỏ tới ${col.fk.table}.${col.fk.to}`}
                          className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-edu-50 text-edu-700 text-[10px] font-bold"
                        >
                          <Link2 className="w-2.5 h-2.5" />
                          FK→{col.fk.table}
                        </span>
                      )}
                      <button
                        onClick={() => onInsertSnippet?.(col.name)}
                        className="font-mono font-medium text-slate-800 hover:text-edu-600 truncate text-left"
                        title="Bấm để chèn tên cột"
                      >
                        {col.name}
                      </button>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0">
                      {col.type}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {isPreview && tbl.sampleRows.length > 0 && (
              <div className="border-t border-slate-200 bg-slate-50/70 p-2 overflow-x-auto">
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                  5 dòng dữ liệu mẫu ({tbl.name}):
                </p>
                <table className="w-full text-[11px] font-mono text-left border border-slate-200 bg-white">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      {tbl.columns.map((c) => (
                        <th key={c.name} className="px-2 py-1 border-b border-r last:border-r-0">
                          {c.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.sampleRows.map((row, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        {row.map((val, j) => (
                          <td
                            key={j}
                            className="px-2 py-1 whitespace-nowrap border-r last:border-r-0 text-slate-700"
                          >
                            {val === null ? (
                              <span className="text-slate-400 italic">NULL</span>
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
