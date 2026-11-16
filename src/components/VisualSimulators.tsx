import React, { useState } from 'react';
import { VisualizerType } from '../types/sql';

interface VisualSimulatorProps {
  kind: VisualizerType;
}

const EXECUTION_STEPS = [
  {
    clause: '1. FROM',
    role: 'Lấy toàn bộ bảng nguồn',
    desc: 'SQL mở bảng `orders` đầu tiên — dù bạn viết SELECT ở đầu câu.',
    rows: [
      { id: 101, customer_id: 1, status: 'completed', total: 1630000 },
      { id: 104, customer_id: 1, status: 'completed', total: 870000 },
      { id: 107, customer_id: 6, status: 'cancelled', total: 290000 },
      { id: 111, customer_id: 8, status: 'pending', total: 320000 },
      { id: 102, customer_id: 2, status: 'completed', total: 525000 },
    ],
    badge: '5 dòng mẫu',
  },
  {
    clause: '2. WHERE',
    role: 'Lọc từng dòng thỏa điều kiện',
    desc: "Giữ lại các dòng có status = 'completed'. Đơn #107 (cancelled) và #111 (pending) bị loại bỏ.",
    rows: [
      { id: 101, customer_id: 1, status: 'completed', total: 1630000 },
      { id: 104, customer_id: 1, status: 'completed', total: 870000 },
      { id: 102, customer_id: 2, status: 'completed', total: 525000 },
    ],
    badge: 'Còn 3 dòng',
  },
  {
    clause: '3. GROUP BY',
    role: 'Gom nhóm theo customer_id',
    desc: 'Gom các đơn của cùng customer_id vào một xô để tính tổng số đơn và tổng chi tiêu.',
    rows: [
      { customer_id: 1, so_don: 2, tong_chi: 2500000 },
      { customer_id: 2, so_don: 1, tong_chi: 525000 },
    ],
    badge: '2 nhóm',
  },
  {
    clause: '4. HAVING',
    role: 'Lọc các nhóm sau khi gom',
    desc: 'Giữ lại nhóm có COUNT(*) >= 2. Nhóm customer_id = 2 (chỉ có 1 đơn) bị loại!',
    rows: [{ customer_id: 1, so_don: 2, tong_chi: 2500000 }],
    badge: 'Còn 1 nhóm',
  },
  {
    clause: '5. SELECT',
    role: 'Chọn cột & đặt Alias',
    desc: 'Chỉ giữ các cột được liệt kê trong SELECT và gán tên hiển thị cuối cùng.',
    rows: [{ customer_id: 1, tong_chi_tieu: 2500000 }],
    badge: 'Định hình cột',
  },
  {
    clause: '6. ORDER BY & LIMIT',
    role: 'Sắp xếp & cắt Top N',
    desc: 'Sắp xếp kết quả và chỉ trả về tối đa N dòng theo LIMIT.',
    rows: [{ customer_id: 1, tong_chi_tieu: 2500000 }],
    badge: 'Kết quả cuối',
  },
];

const ExecutionOrderVisualizer: React.FC = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const current = EXECUTION_STEPS[stepIdx];
  const headers = Object.keys(current.rows[0] || {});

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {EXECUTION_STEPS.map((s, idx) => (
          <button
            key={s.clause}
            onClick={() => setStepIdx(idx)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              idx === stepIdx
                ? 'bg-edu-600 text-white shadow-sm'
                : idx < stepIdx
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {s.clause}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-edu-600">
              {current.role}
            </span>
            <p className="text-xs text-slate-600 mt-0.5">{current.desc}</p>
          </div>
          <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {current.badge}
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-mono">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="px-2.5 py-1.5 border-b border-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {current.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b last:border-b-0 border-slate-100">
                  {headers.map((h) => (
                    <td key={h} className="px-2.5 py-1.5 font-mono text-slate-800">
                      {String((row as Record<string, unknown>)[h])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const JoinVisualizer: React.FC = () => {
  const [joinType, setJoinType] = useState<'INNER' | 'LEFT'>('INNER');

  const previewRows =
    joinType === 'INNER'
      ? [
          { cust: '1 · Minh Anh', order: '#101 (1.630k)', matched: true },
          { cust: '2 · Quốc Bảo', order: '#102 (525k)', matched: true },
        ]
      : [
          { cust: '1 · Minh Anh', order: '#101 (1.630k)', matched: true },
          { cust: '2 · Quốc Bảo', order: '#102 (525k)', matched: true },
          { cust: '12 · Hải Đăng', order: 'NULL (Chưa có đơn)', matched: false },
        ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setJoinType('INNER')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            joinType === 'INNER'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          INNER JOIN (Chỉ lấy phần giao)
        </button>
        <button
          onClick={() => setJoinType('LEFT')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            joinType === 'LEFT'
              ? 'bg-edu-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          LEFT JOIN (Giữ hết bảng trái)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center bg-white p-3 rounded-xl border border-slate-200">
        {/* Venn diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 140 86" className="w-32 h-20">
            <circle
              cx="50"
              cy="43"
              r="30"
              fill={joinType === 'LEFT' ? '#DBEAFE' : '#F1F5F9'}
              stroke="#3B6BFF"
              strokeWidth="2"
            />
            <circle cx="90" cy="43" r="30" fill="#F1F5F9" stroke="#10B981" strokeWidth="2" />
            {/* Intersection highlight */}
            <clipPath id="leftCircle">
              <circle cx="50" cy="43" r="30" />
            </clipPath>
            <circle
              cx="90"
              cy="43"
              r="30"
              clipPath="url(#leftCircle)"
              fill={joinType === 'INNER' ? '#10B981' : '#3B6BFF'}
              opacity="0.55"
            />
            <text x="34" y="46" fontSize="9" fontWeight="700" fill="#1E3A8A">
              Cust
            </text>
            <text x="92" y="46" fontSize="9" fontWeight="700" fill="#065F46">
              Orders
            </text>
          </svg>
          <span className="text-[11px] font-medium text-slate-500">
            {joinType === 'INNER' ? 'Khách chưa mua bị loại' : 'Khách chưa mua thành NULL'}
          </span>
        </div>

        {/* Result rows */}
        <div className="sm:col-span-2 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-mono">
              <tr>
                <th className="px-2.5 py-1.5 border-b">customers (Trái)</th>
                <th className="px-2.5 py-1.5 border-b">orders (Phải)</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((r, i) => (
                <tr
                  key={i}
                  className={`border-b last:border-b-0 ${
                    r.matched ? 'bg-white' : 'bg-amber-50/70'
                  }`}
                >
                  <td className="px-2.5 py-1.5 font-medium text-slate-800">{r.cust}</td>
                  <td className="px-2.5 py-1.5 font-mono">
                    {r.matched ? (
                      <span className="text-emerald-700">{r.order}</span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900 font-semibold text-[11px]">
                        NULL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const GroupByVisualizer: React.FC = () => {
  const [grouped, setGrouped] = useState(false);

  const rawRows = [
    { name: 'Phương Linh', dept: 'Data', salary: 42 },
    { name: 'Hải Yến', dept: 'Data', salary: 30 },
    { name: 'Quang Huy', dept: 'Eng', salary: 45 },
    { name: 'Tuấn Anh', dept: 'Eng', salary: 35 },
  ];

  const groupedRows = [
    { dept: 'Data', count: 2, avg: '36M' },
    { dept: 'Eng', count: 2, avg: '40M' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">
          {grouped ? 'Sau khi GROUP BY department:' : 'Dữ liệu thô ban đầu (4 dòng):'}
        </span>
        <button
          onClick={() => setGrouped((g) => !g)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm"
        >
          {grouped ? '↩ Xem lại bảng gốc' : '⚡ Chạy GROUP BY department'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {!grouped ? (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 font-mono text-slate-700">
              <tr>
                <th className="px-3 py-1.5">name</th>
                <th className="px-3 py-1.5">department</th>
                <th className="px-3 py-1.5">salary (M)</th>
              </tr>
            </thead>
            <tbody>
              {rawRows.map((r) => (
                <tr key={r.name} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 text-slate-800">{r.name}</td>
                  <td className="px-3 py-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        r.dept === 'Data'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {r.dept}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 font-mono">{r.salary}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 font-mono text-slate-700">
              <tr>
                <th className="px-3 py-1.5">department</th>
                <th className="px-3 py-1.5">COUNT(*)</th>
                <th className="px-3 py-1.5">AVG(salary)</th>
              </tr>
            </thead>
            <tbody>
              {groupedRows.map((r) => (
                <tr key={r.dept} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        r.dept === 'Data'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {r.dept}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono font-bold text-slate-900">{r.count}</td>
                  <td className="px-3 py-2 font-mono font-bold text-emerald-700">{r.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const WindowVsGroupVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'window' | 'group'>('window');

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('window')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mode === 'window'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          Window: AVG() OVER (PARTITION BY dept)
        </button>
        <button
          onClick={() => setMode('group')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mode === 'group'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          GROUP BY dept (Gộp dòng)
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {mode === 'window' ? (
          <table className="w-full text-xs text-left">
            <thead className="bg-rose-50 font-mono text-rose-900">
              <tr>
                <th className="px-3 py-1.5">name</th>
                <th className="px-3 py-1.5">dept</th>
                <th className="px-3 py-1.5">salary</th>
                <th className="px-3 py-1.5">avg_dept</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Phương Linh', dept: 'Data', sal: '42M', avg: '36M' },
                { name: 'Hải Yến', dept: 'Data', sal: '30M', avg: '36M' },
                { name: 'Quang Huy', dept: 'Eng', sal: '45M', avg: '40M' },
                { name: 'Tuấn Anh', dept: 'Eng', sal: '35M', avg: '40M' },
              ].map((r) => (
                <tr key={r.name} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 font-medium">{r.name}</td>
                  <td className="px-3 py-1.5">{r.dept}</td>
                  <td className="px-3 py-1.5 font-mono">{r.sal}</td>
                  <td className="px-3 py-1.5 font-mono font-bold text-rose-700">{r.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 font-mono text-slate-700">
              <tr>
                <th className="px-3 py-1.5">dept</th>
                <th className="px-3 py-1.5">avg_dept</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100">
                <td className="px-3 py-2">Data</td>
                <td className="px-3 py-2 font-mono font-bold">36M (mất chi tiết từng người)</td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className="px-3 py-2">Eng</td>
                <td className="px-3 py-2 font-mono font-bold">40M (mất chi tiết từng người)</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const VisualSimulator: React.FC<VisualSimulatorProps> = ({ kind }) => {
  switch (kind) {
    case 'execution-order':
      return <ExecutionOrderVisualizer />;
    case 'join-diagram':
      return <JoinVisualizer />;
    case 'group-by':
      return <GroupByVisualizer />;
    case 'window-vs-group':
      return <WindowVsGroupVisualizer />;
    default:
      return null;
  }
};
