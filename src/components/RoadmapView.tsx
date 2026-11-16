import React from 'react';
import {
  CheckCircle2,
  Clock,
  Play,
  Sparkles,
  Trophy,
  Flame,
  BookOpenCheck,
  Terminal,
} from 'lucide-react';
import { CURRICULUM, ALL_LESSONS } from '../data/curriculum';
import { Lesson } from '../types/sql';
import { MeowMascot } from './MeowMascot';

interface RoadmapViewProps {
  completedIds: string[];
  xp: number;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenPlayground: () => void;
}

const MODULE_ACCENTS: Record<
  string,
  { badge: string; border: string; ring: string; progress: string }
> = {
  amber: {
    badge: 'bg-amber-100 text-amber-800',
    border: 'border-amber-200',
    ring: 'hover:border-amber-400',
    progress: 'bg-amber-500',
  },
  blue: {
    badge: 'bg-blue-100 text-blue-800',
    border: 'border-blue-200',
    ring: 'hover:border-blue-400',
    progress: 'bg-blue-500',
  },
  emerald: {
    badge: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-200',
    ring: 'hover:border-emerald-400',
    progress: 'bg-emerald-500',
  },
  violet: {
    badge: 'bg-violet-100 text-violet-800',
    border: 'border-violet-200',
    ring: 'hover:border-violet-400',
    progress: 'bg-violet-500',
  },
  rose: {
    badge: 'bg-rose-100 text-rose-800',
    border: 'border-rose-200',
    ring: 'hover:border-rose-400',
    progress: 'bg-rose-500',
  },
  cyan: {
    badge: 'bg-cyan-100 text-cyan-800',
    border: 'border-cyan-200',
    ring: 'hover:border-cyan-400',
    progress: 'bg-cyan-500',
  },
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  completedIds,
  xp,
  onSelectLesson,
  onOpenPlayground,
}) => {
  const totalCount = ALL_LESSONS.length;
  const completedCount = completedIds.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const nextLesson =
    ALL_LESSONS.find((l) => !completedIds.includes(l.id)) || ALL_LESSONS[0];

  const rankTitle =
    xp >= 1500
      ? 'Senior Meow Analyst 👑'
      : xp >= 700
        ? 'SQL Explorer 🚀'
        : xp >= 200
          ? 'Junior Query Cat 🐾'
          : 'Mèo Tân Binh 🐱';

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-edu-700 text-white p-6 sm:p-8 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              Học SQL trực quan theo phong cách DataLab & Meow Ecosystem
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight leading-tight">
              Làm chủ SQL từ con số 0 đến{' '}
              <span className="text-amber-400">Phân tích dữ liệu thực chiến</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Không chỉ đọc lý thuyết khô khan — mỗi bài học đều có{' '}
              <strong className="text-white">mô phỏng trực quan</strong> và{' '}
              <strong className="text-white">SQLite Engine thật 100%</strong> chạy ngay trên trình duyệt kèm hệ thống chấm bài tự động.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onSelectLesson(nextLesson)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-sm shadow-tactile transition-all active:translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current" />
                {completedCount === 0
                  ? 'Bắt đầu học ngay (Bài 1)'
                  : completedCount === totalCount
                    ? 'Ôn tập lại từ đầu'
                    : `Học tiếp: ${nextLesson.title}`}
              </button>
              <button
                onClick={onOpenPlayground}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors"
              >
                <Terminal className="w-4 h-4" />
                Mở Phòng thực hành tự do
              </button>
            </div>
          </div>

          {/* Progress Card */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-3">
              <MeowMascot mood={completedCount > 0 ? 'celebrating' : 'happy'} size={58} />
              <div>
                <p className="text-xs text-slate-300 font-medium">Danh hiệu hiện tại</p>
                <p className="text-base font-display font-extrabold text-white">
                  {rankTitle}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Tiến độ toàn khóa</span>
                <span className="text-amber-300">
                  {completedCount}/{totalCount} bài ({pct}%)
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="rounded-xl bg-white/10 p-2.5 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[11px] text-slate-300">Tổng XP</p>
                  <p className="text-sm font-extrabold">{xp} XP</p>
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-2.5 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <div>
                  <p className="text-[11px] text-slate-300">Hoàn thành</p>
                  <p className="text-sm font-extrabold">{completedCount} bài</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Modules */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-display font-extrabold text-slate-900">
              Lộ trình 6 Chương · Từ Cơ bản đến Senior
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Mỗi bài gồm 50% lý thuyết trực quan + 50% viết SQL trực tiếp trên dữ liệu cửa hàng MeowMart.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {CURRICULUM.map((mod) => {
            const accent = MODULE_ACCENTS[mod.color];
            const modDone = mod.lessons.filter((l) => completedIds.includes(l.id)).length;
            const modPct = Math.round((modDone / mod.lessons.length) * 100);

            return (
              <div
                key={mod.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-card space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${accent.badge}`}
                    >
                      {mod.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-extrabold text-slate-900">
                        {mod.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs font-bold text-slate-600">
                      {modDone}/{mod.lessons.length} bài
                    </span>
                    <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${accent.progress}`}
                        style={{ width: `${modPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mod.lessons.map((lesson) => {
                    const done = completedIds.includes(lesson.id);
                    const isNext = nextLesson.id === lesson.id && !done;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        className={`group text-left p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          done
                            ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                            : isNext
                              ? 'bg-amber-50/50 border-brand-300 ring-2 ring-brand-200/60 hover:border-brand-500'
                              : `bg-slate-50/50 border-slate-200 ${accent.ring} hover:bg-white`
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono font-bold text-slate-400">
                                BÀI {String(lesson.order).padStart(2, '0')}
                              </span>
                              {isNext && (
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-500 text-white">
                                  Tiếp theo
                                </span>
                              )}
                            </div>
                            <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-edu-600 transition-colors">
                              {lesson.title}
                            </h4>
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {lesson.subtitle}
                            </p>
                          </div>

                          <div className="shrink-0 mt-0.5">
                            {done ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-edu-600 group-hover:border-edu-600 group-hover:text-white transition-colors">
                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                          <div className="flex flex-wrap gap-1">
                            {lesson.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.durationMinutes}p
                            </span>
                            <span className="text-brand-600 font-bold">
                              +{lesson.challenge.xp} XP
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom quick tip */}
      <div className="rounded-2xl bg-edu-50 border border-edu-100 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BookOpenCheck className="w-6 h-6 text-edu-600 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-700">
            <strong>Mẹo học hiệu quả:</strong> Tiến độ và điểm XP được lưu tự động trên trình duyệt của bạn. Hãy kết hợp làm thêm phần <strong>Trắc nghiệm Phỏng vấn</strong> để nhớ sâu các bẫy SQL!
          </p>
        </div>
      </div>
    </div>
  );
};
