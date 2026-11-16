import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  Eye,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  AlertTriangle,
  Briefcase,
  Info,
} from 'lucide-react';
import {
  GradeResult,
  Lesson,
  QueryResult,
  TableSchemaInfo,
  TheoryBlock,
} from '../types/sql';
import {
  executeUserQuery,
  gradeChallenge,
  previewExpectedResult,
  resetMainDatabase,
  translateSqlError,
} from '../db/sqlEngine';
import { SqlEditor } from './SqlEditor';
import { ResultTable } from './ResultTable';
import { SchemaExplorer } from './SchemaExplorer';
import { VisualSimulator } from './VisualSimulators';
import { MascotMood, MeowMascot } from './MeowMascot';

interface LessonWorkspaceProps {
  lesson: Lesson;
  lessonIndex: number;
  totalLessons: number;
  isCompleted: boolean;
  schemas: TableSchemaInfo[];
  onRefreshSchemas: () => Promise<void>;
  onCompleteLesson: (lessonId: string, xp: number) => void;
  onBackToRoadmap: () => void;
  onSelectLessonByOffset: (offset: -1 | 1) => void;
}

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({
  lesson,
  lessonIndex,
  totalLessons,
  isCompleted,
  schemas,
  onRefreshSchemas,
  onCompleteLesson,
  onBackToRoadmap,
  onSelectLessonByOffset,
}) => {
  const [sqlCode, setSqlCode] = useState(lesson.challenge.starterSql);
  const [rightTab, setRightTab] = useState<'workbench' | 'schema' | 'expected'>('workbench');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [expectedPreview, setExpectedPreview] = useState<QueryResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Reset local state whenever lesson changes
  useEffect(() => {
    setSqlCode(lesson.challenge.starterSql);
    setQueryResult(null);
    setErrorMsg(null);
    setGradeResult(null);
    setHintsShown(0);
    setShowSolution(false);
    setRightTab('workbench');
    setExpectedPreview(null);

    previewExpectedResult(lesson.challenge)
      .then(setExpectedPreview)
      .catch(() => setExpectedPreview(null));
  }, [lesson]);

  const handleRunSql = async (overrideSql?: string) => {
    const codeToRun = overrideSql ?? sqlCode;
    setIsRunning(true);
    setErrorMsg(null);
    setGradeResult(null);
    try {
      const res = await executeUserQuery(codeToRun);
      setQueryResult(res);
      setRightTab('workbench');
      if (res.statementType === 'DML' || res.statementType === 'DDL') {
        await onRefreshSchemas();
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err);
      setErrorMsg(translateSqlError(raw));
      setQueryResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCheckAnswer = async () => {
    setIsRunning(true);
    setErrorMsg(null);
    try {
      const result = await gradeChallenge(sqlCode, lesson.challenge);
      setGradeResult(result);
      if (result.userResult) {
        setQueryResult(result.userResult);
      }
      if (result.error) {
        setErrorMsg(result.error);
      }
      if (result.passed) {
        onCompleteLesson(lesson.id, lesson.challenge.xp);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsRunning(false);
    }
  };

  const handleLoadExample = async (exampleSql: string) => {
    setSqlCode(exampleSql);
    await handleRunSql(exampleSql);
  };

  const handleResetCode = async () => {
    setSqlCode(lesson.challenge.starterSql);
    setQueryResult(null);
    setErrorMsg(null);
    setGradeResult(null);
    await resetMainDatabase();
    await onRefreshSchemas();
  };

  const handleInsertSnippet = (snippet: string) => {
    setSqlCode((prev) => (prev.endsWith(' ') || prev.endsWith('\n') ? prev + snippet : `${prev} ${snippet}`));
  };

  const mascotMood: MascotMood = gradeResult?.passed
    ? 'celebrating'
    : errorMsg || (gradeResult && !gradeResult.passed)
      ? 'error'
      : isRunning
        ? 'thinking'
        : 'coding';

  const mascotMessage = gradeResult?.passed
    ? gradeResult.message
    : errorMsg
      ? errorMsg
      : gradeResult && !gradeResult.passed
        ? gradeResult.details || gradeResult.message
        : `Mẹo: Bấm Ctrl/Cmd + Enter để chạy nhanh câu lệnh SQL nhé!`;

  const renderTheoryBlock = (block: TheoryBlock, idx: number) => {
    switch (block.type) {
      case 'text':
        return (
          <div key={idx} className="space-y-1.5">
            {block.title && (
              <h3 className="text-base font-display font-bold text-slate-900">
                {block.title}
              </h3>
            )}
            <p className="text-sm text-slate-700 leading-relaxed">{block.content}</p>
          </div>
        );

      case 'syntax':
        return (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden shadow-sm"
          >
            {block.title && (
              <div className="px-3.5 py-2 bg-slate-800/90 border-b border-slate-700/70 flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Code2 className="w-3.5 h-3.5" />
                {block.title}
              </div>
            )}
            <pre className="p-3.5 text-xs sm:text-[13px] font-mono overflow-x-auto leading-relaxed text-sky-200">
              {block.code}
            </pre>
            {block.caption && (
              <div className="px-3.5 py-2 bg-slate-800/50 border-t border-slate-700/60 text-xs text-slate-300">
                {block.caption}
              </div>
            )}
          </div>
        );

      case 'example':
        return (
          <div
            key={idx}
            className="rounded-xl border border-edu-100 bg-edu-50/50 p-3.5 space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {block.title}
                </h4>
                {block.description && (
                  <p className="text-xs text-slate-600 mt-0.5">{block.description}</p>
                )}
              </div>
              <button
                onClick={() => handleLoadExample(block.sql)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-edu-600 hover:bg-edu-700 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <Play className="w-3 h-3 fill-current" />
                Chạy thử ví dụ
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
              {block.sql}
            </pre>
          </div>
        );

      case 'callout': {
        const styles = {
          tip: {
            bg: 'bg-amber-50 border-amber-200 text-amber-950',
            icon: <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
          },
          warning: {
            bg: 'bg-rose-50 border-rose-200 text-rose-950',
            icon: <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
          },
          interview: {
            bg: 'bg-violet-50 border-violet-200 text-violet-950',
            icon: <Briefcase className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />,
          },
          info: {
            bg: 'bg-sky-50 border-sky-200 text-sky-950',
            icon: <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />,
          },
        }[block.variant];

        return (
          <div
            key={idx}
            className={`rounded-xl border p-3.5 flex items-start gap-2.5 ${styles.bg}`}
          >
            {styles.icon}
            <div className="space-y-1 text-xs sm:text-[13px]">
              <p className="font-bold">{block.title}</p>
              <p className="leading-relaxed opacity-90">{block.content}</p>
            </div>
          </div>
        );
      }

      case 'comparison':
        return (
          <div key={idx} className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">{block.title}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5">
                <p className="text-xs font-bold text-edu-700 uppercase tracking-wide">
                  {block.leftTitle}
                </p>
                <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
                  {block.leftItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  {block.rightTitle}
                </p>
                <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
                  {block.rightItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'visualizer':
        return (
          <div
            key={idx}
            className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50/80 to-amber-50/40 p-3.5 space-y-2.5"
          >
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">
                <Sparkles className="w-3.5 h-3.5" />
                Mô phỏng trực quan
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{block.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{block.description}</p>
            </div>
            <VisualSimulator kind={block.kind} />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-header navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToRoadmap}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Lộ trình
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>
                Bài {lessonIndex + 1} / {totalLessons}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                {lesson.difficulty}
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã hoàn thành
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-display font-extrabold text-slate-900 truncate mt-0.5">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectLessonByOffset(-1)}
            disabled={lessonIndex === 0}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Bài trước
          </button>
          <button
            onClick={() => onSelectLessonByOffset(1)}
            disabled={lessonIndex === totalLessons - 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Bài tiếp
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split-pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT PANE: Visual Theory */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden flex flex-col lg:max-h-[calc(100vh-175px)]">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <BookOpen className="w-4 h-4 text-brand-500" />
              Lý thuyết & Minh họa
            </div>
            <div className="flex gap-1">
              {lesson.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-5 overflow-y-auto">
            {lesson.theory.map((block, idx) => renderTheoryBlock(block, idx))}
          </div>
        </div>

        {/* RIGHT PANE: Challenge + SQL Workbench */}
        <div className="lg:col-span-7 space-y-4">
          {/* Practice Prompt Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-brand-100 text-brand-700 text-xs font-extrabold">
                  THỰC HÀNH · +{lesson.challenge.xp} XP
                </span>
                <h2 className="text-sm sm:text-base font-display font-bold text-slate-900">
                  {lesson.challenge.title}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {lesson.challenge.prompt}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {lesson.challenge.requirements.map((req, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-edu-500" />
                  {req}
                </span>
              ))}
            </div>
          </div>

          {/* Workbench Tabs & Editor */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="px-3 pt-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRightTab('workbench')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-colors ${
                    rightTab === 'workbench'
                      ? 'border-edu-600 text-edu-700 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  SQL Editor
                </button>
                <button
                  onClick={() => setRightTab('schema')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-colors ${
                    rightTab === 'schema'
                      ? 'border-edu-600 text-edu-700 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  Bảng dữ liệu ({schemas.length})
                </button>
                <button
                  onClick={() => setRightTab('expected')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-colors ${
                    rightTab === 'expected'
                      ? 'border-edu-600 text-edu-700 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Kết quả mẫu
                </button>
              </div>

              <div className="flex items-center gap-1.5 pb-1.5">
                <button
                  onClick={() =>
                    setHintsShown((h) => Math.min(h + 1, lesson.challenge.hints.length))
                  }
                  disabled={hintsShown >= lesson.challenge.hints.length}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 disabled:opacity-50"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Gợi ý ({hintsShown}/{lesson.challenge.hints.length})
                </button>
                <button
                  onClick={() => setShowSolution((s) => !s)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                >
                  {showSolution ? 'Ẩn lời giải' : 'Xem lời giải'}
                </button>
              </div>
            </div>

            <div className="p-3.5 space-y-3">
              {rightTab === 'workbench' && (
                <>
                  <SqlEditor
                    value={sqlCode}
                    onChange={setSqlCode}
                    onRun={() => handleRunSql()}
                    schemas={schemas}
                    height="200px"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRunSql()}
                        disabled={isRunning}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:translate-y-0.5"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Chạy thử (Run)
                      </button>
                      <button
                        onClick={handleCheckAnswer}
                        disabled={isRunning}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:translate-y-0.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Kiểm tra đáp án
                      </button>
                    </div>

                    <button
                      onClick={handleResetCode}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600"
                      title="Khôi phục code ban đầu & dữ liệu gốc"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  </div>
                </>
              )}

              {rightTab === 'schema' && (
                <div className="max-h-[340px] overflow-y-auto pr-1">
                  <p className="text-xs text-slate-500 mb-2">
                    Bấm vào tên cột để chèn nhanh vào SQL Editor, hoặc bấm &quot;Xem mẫu&quot; để xem trước dữ liệu bảng.
                  </p>
                  <SchemaExplorer
                    schemas={schemas}
                    onInsertSnippet={(text) => {
                      handleInsertSnippet(text);
                      setRightTab('workbench');
                    }}
                  />
                </div>
              )}

              {rightTab === 'expected' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600">
                    Truy vấn của bạn cần trả về đúng các cột và dữ liệu giống bảng dưới đây:
                  </p>
                  {expectedPreview ? (
                    <ResultTable
                      result={expectedPreview}
                      title="Đầu ra kỳ vọng (Expected Output)"
                      compact
                    />
                  ) : (
                    <p className="text-xs text-slate-400">Đang tải xem trước...</p>
                  )}
                </div>
              )}

              {/* Hints & Solution */}
              {hintsShown > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 space-y-1.5">
                  <p className="text-xs font-bold text-amber-900">Gợi ý từ Mèo Query:</p>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-amber-900">
                    {lesson.challenge.hints.slice(0, hintsShown).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {showSolution && (
                <div className="rounded-xl border border-slate-200 bg-slate-900 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      Lời giải tham khảo:
                    </span>
                    <button
                      onClick={() => {
                        setSqlCode(lesson.challenge.solutionSql);
                        setRightTab('workbench');
                      }}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Chép vào Editor
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-100 overflow-x-auto leading-relaxed">
                    {lesson.challenge.solutionSql}
                  </pre>
                </div>
              )}

              {/* Mascot feedback */}
              <MeowMascot
                mood={mascotMood}
                size={46}
                message={mascotMessage}
                className="w-full"
              />

              {/* Next lesson quick CTA when passed */}
              {gradeResult?.passed && lessonIndex < totalLessons - 1 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => onSelectLessonByOffset(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
                  >
                    Qua bài tiếp theo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Live Query Result */}
              {queryResult && (
                <ResultTable result={queryResult} title="Kết quả thực thi từ SQLite" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
