import React, { useEffect, useState } from 'react';
import {
  Map,
  Terminal,
  Network,
  BookMarked,
  HelpCircle,
  Trophy,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';
import { ALL_LESSONS } from './data/curriculum';
import { getSchemaInfo, initMainDatabase } from './db/sqlEngine';
import { Lesson, TableSchemaInfo } from './types/sql';
import { RoadmapView } from './components/RoadmapView';
import { LessonWorkspace } from './components/LessonWorkspace';
import { PlaygroundView } from './components/PlaygroundView';
import { ErDiagramView } from './components/ErDiagramView';
import { CheatSheetView } from './components/CheatSheetView';
import { QuizView } from './components/QuizView';
import { CaseStudiesView } from './components/CaseStudiesView';
import { MeowMascot } from './components/MeowMascot';

type ActiveTab = 'roadmap' | 'lesson' | 'cases' | 'playground' | 'er' | 'cheatsheet' | 'quiz';

const STORAGE_KEY = 'meowsql_progress_v1';

interface StoredProgress {
  completedIds: string[];
  solvedCaseIds: string[];
  xp: number;
}

function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedIds: [], solvedCaseIds: [], xp: 0 };
    const parsed = JSON.parse(raw);
    return {
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      solvedCaseIds: Array.isArray(parsed.solvedCaseIds) ? parsed.solvedCaseIds : [],
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
    };
  } catch {
    return { completedIds: [], solvedCaseIds: [], xp: 0 };
  }
}

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('roadmap');
  const [activeLesson, setActiveLesson] = useState<Lesson>(ALL_LESSONS[0]);
  const [playgroundInitSql, setPlaygroundInitSql] = useState<string | undefined>(undefined);
  const [schemas, setSchemas] = useState<TableSchemaInfo[]>([]);
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);

  const refreshSchemas = async () => {
    const info = await getSchemaInfo();
    setSchemas(info);
  };

  useEffect(() => {
    initMainDatabase()
      .then(() => refreshSchemas())
      .then(() => setDbReady(true))
      .catch((err) => {
        setDbError(err instanceof Error ? err.message : String(err));
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const handleCompleteLesson = (lessonId: string, xpReward: number) => {
    setProgress((prev) => {
      if (prev.completedIds.includes(lessonId)) return prev;
      return {
        ...prev,
        completedIds: [...prev.completedIds, lessonId],
        xp: prev.xp + xpReward,
      };
    });
  };

  const handleSolveCase = (caseId: string, xpReward: number) => {
    setProgress((prev) => {
      if (prev.solvedCaseIds.includes(caseId)) return prev;
      return {
        ...prev,
        solvedCaseIds: [...prev.solvedCaseIds, caseId],
        xp: prev.xp + xpReward,
      };
    });
  };

  const handleEarnXp = (amount: number) => {
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveTab('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLessonByOffset = (offset: -1 | 1) => {
    const idx = ALL_LESSONS.findIndex((l) => l.id === activeLesson.id);
    const nextIdx = idx + offset;
    if (nextIdx >= 0 && nextIdx < ALL_LESSONS.length) {
      handleSelectLesson(ALL_LESSONS[nextIdx]);
    }
  };

  const handleTryInPlayground = (sql: string) => {
    setPlaygroundInitSql(sql);
    setActiveTab('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeLessonIndex = ALL_LESSONS.findIndex((l) => l.id === activeLesson.id);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'roadmap', label: 'Lộ trình học', icon: <Map className="w-4 h-4" /> },
    { id: 'cases', label: 'Case thực chiến', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'playground', label: 'DataLab SQL', icon: <Terminal className="w-4 h-4" /> },
    { id: 'er', label: 'Sơ đồ bảng', icon: <Network className="w-4 h-4" /> },
    { id: 'cheatsheet', label: 'Tra cứu nhanh', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'quiz', label: 'Trắc nghiệm', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('roadmap')}
            className="flex items-center gap-2.5 text-left shrink-0"
          >
            <MeowMascot mood="happy" size={38} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg tracking-tight text-slate-900">
                  Meow<span className="text-brand-500">SQL</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-edu-50 text-edu-700 border border-edu-100">
                  DataLab
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 font-medium -mt-0.5">
                Lý thuyết trực quan · Thực hành SQLite
              </p>
            </div>
          </button>

          {/* Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            {navItems.map((item) => {
              const isActive =
                activeTab === item.id || (activeTab === 'lesson' && item.id === 'roadmap');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right User Progress */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold">
              <Trophy className="w-3.5 h-3.5 text-brand-500" />
              {progress.xp} XP
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {progress.completedIds.length}/{ALL_LESSONS.length}
            </div>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden border-t border-slate-100 px-3 py-1.5 flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive =
              activeTab === item.id || (activeTab === 'lesson' && item.id === 'roadmap');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 bg-slate-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6">
        {dbError ? (
          <div className="max-w-lg mx-auto bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-2">
            <p className="font-bold text-rose-900">Không thể khởi tạo SQLite Engine</p>
            <p className="text-xs text-rose-700 font-mono">{dbError}</p>
          </div>
        ) : !dbReady ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <MeowMascot mood="thinking" size={64} />
            <p className="text-sm font-semibold">
              Đang khởi động SQLite WebAssembly & nạp dữ liệu MeowMart...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'roadmap' && (
              <RoadmapView
                completedIds={progress.completedIds}
                xp={progress.xp}
                onSelectLesson={handleSelectLesson}
                onOpenPlayground={() => setActiveTab('playground')}
              />
            )}

            {activeTab === 'lesson' && (
              <LessonWorkspace
                lesson={activeLesson}
                lessonIndex={activeLessonIndex}
                totalLessons={ALL_LESSONS.length}
                isCompleted={progress.completedIds.includes(activeLesson.id)}
                schemas={schemas}
                onRefreshSchemas={refreshSchemas}
                onCompleteLesson={handleCompleteLesson}
                onBackToRoadmap={() => setActiveTab('roadmap')}
                onSelectLessonByOffset={handleSelectLessonByOffset}
              />
            )}

            {activeTab === 'cases' && (
              <CaseStudiesView
                solvedCaseIds={progress.solvedCaseIds}
                schemas={schemas}
                onRefreshSchemas={refreshSchemas}
                onSolveCase={handleSolveCase}
              />
            )}

            {activeTab === 'playground' && (
              <PlaygroundView
                key={playgroundInitSql || 'default'}
                schemas={schemas}
                onRefreshSchemas={refreshSchemas}
                initialSql={playgroundInitSql}
              />
            )}

            {activeTab === 'er' && (
              <ErDiagramView
                schemas={schemas}
                onRunTablePreview={(tableName) =>
                  handleTryInPlayground(`SELECT * FROM ${tableName};`)
                }
              />
            )}

            {activeTab === 'cheatsheet' && (
              <CheatSheetView onTryInPlayground={handleTryInPlayground} />
            )}

            {activeTab === 'quiz' && <QuizView onEarnXp={handleEarnXp} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
