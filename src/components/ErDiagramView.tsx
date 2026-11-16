import React, { useState } from 'react';
import { KeyRound, Link2, Table2, ArrowRight } from 'lucide-react';
import { TableSchemaInfo } from '../types/sql';

interface ErDiagramViewProps {
  schemas: TableSchemaInfo[];
  onRunTablePreview: (tableName: string) => void;
}

const RELATIONSHIPS = [
  {
    from: 'products.category_id',
    to: 'categories.id',
    type: 'N : 1',
    desc: 'Mỗi sản phẩm thuộc 1 danh mục; 1 danh mục có nhiều sản phẩm.',
  },
  {
    from: 'orders.customer_id',
    to: 'customers.id',
    type: 'N : 1',
    desc: 'Mỗi đơn hàng thuộc về 1 khách hàng; 1 khách có thể có 0 hoặc nhiều đơn.',
  },
  {
    from: 'order_items.order_id',
    to: 'orders.id',
    type: 'N : 1',
    desc: 'Một đơn hàng gồm nhiều dòng chi tiết sản phẩm.',
  },
  {
    from: 'order_items.product_id',
    to: 'products.id',
    type: 'N : 1',
    desc: 'Một sản phẩm có thể xuất hiện trong nhiều dòng chi tiết đơn hàng.',
  },
  {
    from: 'employees.manager_id',
    to: 'employees.id',
    type: 'Self N : 1',
    desc: 'Quan hệ tự tham chiếu (Self-Join): quản lý cũng là một nhân viên.',
  },
];

export const ErDiagramView: React.FC<ErDiagramViewProps> = ({
  schemas,
  onRunTablePreview,
}) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
        <div>
          <h1 className="text-xl font-display font-extrabold text-slate-900">
            Sơ đồ Quan hệ Thực thể (ER Diagram) — CSDL MeowMart
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Hiểu rõ cách các bảng liên kết qua <strong>Khóa chính (PK)</strong> và{' '}
            <strong>Khóa ngoại (FK)</strong> giúp bạn viết JOIN chính xác tuyệt đối.
          </p>
        </div>

        {/* Relationship Map Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {RELATIONSHIPS.map((rel) => (
            <div
              key={rel.from}
              className="rounded-xl border border-edu-100 bg-edu-50/40 p-3 space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800">
                  <span className="text-edu-700">{rel.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-amber-700">{rel.to}</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-edu-200 text-edu-700">
                  {rel.type}
                </span>
              </div>
              <p className="text-xs text-slate-600">{rel.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemas.map((tbl) => {
          const isSelected = selectedTable === tbl.name;
          return (
            <div
              key={tbl.name}
              onClick={() => setSelectedTable(isSelected ? null : tbl.name)}
              className={`rounded-2xl border bg-white overflow-hidden shadow-card transition-all cursor-pointer ${
                isSelected
                  ? 'border-edu-500 ring-2 ring-edu-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-amber-400" />
                  <span className="font-mono font-bold text-sm">{tbl.name}</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-slate-200">
                  {tbl.rowCount} dòng
                </span>
              </div>

              <div className="p-3 divide-y divide-slate-100">
                {tbl.columns.map((col) => (
                  <div
                    key={col.name}
                    className="py-1.5 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {col.pk && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          <KeyRound className="w-2.5 h-2.5" />
                          PK
                        </span>
                      )}
                      {col.fk && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-edu-100 text-edu-800 text-[10px] font-bold">
                          <Link2 className="w-2.5 h-2.5" />
                          FK→{col.fk.table}
                        </span>
                      )}
                      <span className="font-mono font-medium text-slate-800 truncate">
                        {col.name}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {col.type}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunTablePreview(tbl.name);
                  }}
                  className="text-xs font-bold text-edu-600 hover:text-edu-700"
                >
                  SELECT * FROM {tbl.name} →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
