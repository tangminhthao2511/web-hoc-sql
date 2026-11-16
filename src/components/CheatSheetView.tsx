import React, { useMemo, useState } from 'react';
import { Search, Play, BookMarked } from 'lucide-react';
import { CHEAT_SHEET_ITEMS } from '../data/cheatSheet';

interface CheatSheetViewProps {
  onTryInPlayground: (sql: string) => void;
}

export const CheatSheetView: React.FC<CheatSheetViewProps> = ({
  onTryInPlayground,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');

  const categories = useMemo(
    () => ['Tất cả', ...Array.from(new Set(CHEAT_SHEET_ITEMS.map((i) => i.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CHEAT_SHEET_ITEMS.filter((item) => {
      const matchCat = activeCategory === 'Tất cả' || item.category === activeCategory;
      const matchSearch =
        !q ||
        item.keyword.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.syntax.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-extrabold text-slate-900">
                Sổ Tay Tra Cứu Nhanh SQL (Cheat Sheet)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Tìm nhanh cú pháp và bấm chạy thử ngay trong Phòng thực hành DataLab.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm lệnh: JOIN, RANK, WITH..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-edu-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-extrabold text-edu-700">
                  {item.keyword}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {item.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700">{item.description}</p>
              <div className="rounded-xl bg-slate-900 p-2.5 font-mono text-xs text-sky-200 overflow-x-auto">
                {item.syntax}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <code className="text-[11px] font-mono text-slate-500 truncate">
                {item.example}
              </code>
              <button
                onClick={() => onTryInPlayground(item.example)}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                Chạy thử
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
