import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Database,
  Eye,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
  Search,
  Terminal,
} from 'lucide-react';
import { CASE_STUDIES } from '../data/caseStudies';
import {
  CaseStudy,
  GradeResult,
  QueryResult,
  TableSchemaInfo,
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
import { MascotMood, MeowMascot } from './MeowMascot';

interface CaseStudiesViewProps {
  solvedCaseIds: string[];
  schemas: TableSchemaInfo[];
  onRefreshSchemas: () => Promise<void>;
  onSolveCase: (caseId: string, xp: number) => void;
}

const DIFF_STYLE: Record<CaseStudy['difficulty'], string> = {
  Easy: 'bg-emerald-100 text-emerald-800',
  Medium: 'bg-blue-100 text-blue-800',
  Hard: 'bg-amber-100 text-amber-800',
  Interview: 'bg-rose-100 text-rose-800',
};

export const CaseStudiesView: React.FC<CaseStudiesViewProps> = ({
  solvedCaseIds,
  schemas,
  onRefreshSchemas,
  onSolveCase,
}) => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('Tất cả');
  const [domainFilter, setDomainFilter] = useState<string>('Tất cả');
  const [search, setSearch] = useState('');

  // Solver state
  const [sqlCode, setSqlCode] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'schema' | 'expected'>('editor');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [expectedPreview, setExpectedPreview] = useState<QueryResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const filteredCases = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CASE_STUDIES.filter((c) => {
      const matchDiff =
        difficultyFilter === 'Tất cả' || c.difficulty === difficultyFilter;
      const matchDomain = domainFilter === 'Tất cả' || c.domain === domainFilter;
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.scenario.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q));
      return matchDiff && matchDomain && matchSearch;
    });
  }, [difficultyFilter, domainFilter, search]);

  useEffect(() => {
    if (!selectedCase) return;
    setSqlCode(selectedCase.challenge.starterSql);
    setActiveTab('editor');
    setQueryResult(null);
    setErrorMsg(null);
    setGradeResult(null);
    setHintsShown(0);
    setShowSolution(false);
    setExpectedPreview(null);

    previewExpectedResult(selectedCase.challenge)
      .then(setExpectedPreview)
      .catch(() => setExpectedPreview(null));
  }, [selectedCase]);

  const handleRunSql = async () => {
    setIsRunning(true);
    setErrorMsg(null);
    setGradeResult(null);
    try {
      const res = await executeUserQuery(sqlCode);
      setQueryResult(res);
      setActiveTab('editor');
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err);
      setErrorMsg(translateSqlError(raw));
      setQueryResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCheckAnswer = async () => {
    if (!selectedCase) return;
    setIsRunning(true);
    setErrorMsg(null);
    try {
      const res = await gradeChallenge(sqlCode, selectedCase.challenge);
      setGradeResult(res);
      if (res.userResult) setQueryResult(res.userResult);
      if (res.error) setErrorMsg(res.error);
      if (res.passed) {
        onSolveCase(selectedCase.id, selectedCase.challenge.xp);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = async () => {
    if (!selectedCase) return;
    setSqlCode(selectedCase.challenge.starterSql);
    setQueryResult(null);
    setErrorMsg(null);
    setGradeResult(null);
    await resetMainDatabase();
    await onRefreshSchemas();
  };

  if (selectedCase) {
    const idx = CASE_STUDIES.findIndex((c) => c.id === selectedCase.id);
    const isSolved = solvedCaseIds.includes(selectedCase.id);

    const mood: MascotMood = gradeResult?.passed
      ? 'celebrating'
      : errorMsg || (gradeResult && !gradeResult.passed)
        ? 'error'
        : 'coding';

    const message = gradeResult?.passed
      ? gradeResult.message
      : errorMsg
        ? errorMsg
        : gradeResult && !gradeResult.passed
          ? gradeResult.details || gradeResult.message
          : 'Đọc kỹ bối cảnh doanh nghiệp bên trái và viết SQL giải quyết bài toán!';

    return (
      <div className="space-y-4">
        {/* Top bar */}
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-card flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSelectedCase(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Danh sách Case
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold text-slate-400">
                  CASE #{String(selectedCase.order).padStart(2, '0')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${DIFF_STYLE[selectedCase.difficulty]}`}
                >
                  {selectedCase.difficulty}
                </span>
                <span className="text-slate-500 font-medium">{selectedCase.company}</span>
                {isSolved && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã giải
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-display font-extrabold text-slate-900 truncate mt-0.5">
                {selectedCase.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => idx > 0 && setSelectedCase(CASE_STUDIES[idx - 1])}
              disabled={idx <= 0}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Case trước
            </button>
            <button
              onClick={() =>
                idx < CASE_STUDIES.length - 1 && setSelectedCase(CASE_STUDIES[idx + 1])
              }
              disabled={idx >= CASE_STUDIES.length - 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40"
            >
              Case tiếp
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left: Business Brief */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-edu-600">
                <Briefcase className="w-3.5 h-3.5" />
                Bối cảnh nghiệp vụ ({selectedCase.domain})
              </div>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                {selectedCase.scenario}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-display font-bold text-slate-900">
                  Yêu cầu chi tiết
                </h2>
                <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                  +{selectedCase.challenge.xp} XP
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedCase.challenge.prompt}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Tiêu chí chấm điểm:
              </p>
              <ul className="space-y-1.5">
                {selectedCase.challenge.requirements.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-700 bg-edu-50/40 px-3 py-2 rounded-xl border border-edu-100"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-edu-600 mt-1.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedCase.skills.map((sk) => (
                <span
                  key={sk}
                  className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Right: SQL Workbench */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="px-3 pt-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold border-b-2 ${
                    activeTab === 'editor'
                      ? 'border-edu-600 text-edu-700 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  SQL Editor
                </button>
                <button
                  onClick={() => setActiveTab('schema')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold border-b-2 ${
                    activeTab === 'schema'
                      ? 'border-edu-600 text-edu-700 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  Bảng dữ liệu ({schemas.length})
                </button>
                <button
                  onClick={() => setActiveTab('expected')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold border-b-2 ${
                    activeTab === 'expected'
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
                    setHintsShown((h) =>
                      Math.min(h + 1, selectedCase.challenge.hints.length)
                    )
                  }
                  disabled={hintsShown >= selectedCase.challenge.hints.length}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 disabled:opacity-50"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Gợi ý ({hintsShown}/{selectedCase.challenge.hints.length})
                </button>
                <button
                  onClick={() => setShowSolution((s) => !s)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                >
                  {showSolution ? 'Ẩn lời giải' : 'Xem lời giải'}
                </button>
              </div>
            </div>

            <div className="p-3.5 space-y-3">
              {activeTab === 'editor' && (
                <>
                  <SqlEditor
                    value={sqlCode}
                    onChange={setSqlCode}
                    onRun={handleRunSql}
                    schemas={schemas}
                    height="220px"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunSql}
                        disabled={isRunning}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-sm"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Chạy thử
                      </button>
                      <button
                        onClick={handleCheckAnswer}
                        disabled={isRunning}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Nộp bài & Chấm điểm
                      </button>
                    </div>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'schema' && (
                <div className="max-h-[340px] overflow-y-auto pr-1">
                  <SchemaExplorer
                    schemas={schemas}
                    onInsertSnippet={(text) => {
                      setSqlCode((prev) =>
                        prev.endsWith(' ') || prev.endsWith('\n')
                          ? prev + text
                          : `${prev} ${text}`
                      );
                      setActiveTab('editor');
                    }}
                  />
                </div>
              )}

              {activeTab === 'expected' && (
                <div>
                  {expectedPreview ? (
                    <ResultTable
                      result={expectedPreview}
                      title="Đầu ra kỳ vọng"
                      compact
                    />
                  ) : (
                    <p className="text-xs text-slate-400">Đang tải...</p>
                  )}
                </div>
              )}

              {hintsShown > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 space-y-1">
                  <p className="text-xs font-bold text-amber-900">Gợi ý:</p>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-amber-900">
                    {selectedCase.challenge.hints
                      .slice(0, hintsShown)
                      .map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                  </ul>
                </div>
              )}

              {showSolution && (
                <div className="rounded-xl border border-slate-200 bg-slate-900 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      Lời giải chuẩn Senior:
                    </span>
                    <button
                      onClick={() => {
                        setSqlCode(selectedCase.challenge.solutionSql);
                        setActiveTab('editor');
                      }}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Chép vào Editor
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-100 overflow-x-auto leading-relaxed">
                    {selectedCase.challenge.solutionSql}
                  </pre>
                </div>
              )}

              <MeowMascot mood={mood} size={44} message={message} className="w-full" />

              {queryResult && (
                <ResultTable result={queryResult} title="Kết quả thực thi" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-600">
              <Flame className="w-4 h-4" />
              Đấu trường Case Study Doanh nghiệp · {solvedCaseIds.length}/
              {CASE_STUDIES.length} đã giải
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
              Thực chiến 15 Case Dữ Liệu Thực Tế & Phỏng Vấn SQL
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Rèn tư duy giải quyết bài toán thật của Data Analyst & Product Analyst: Phễu chuyển đổi (Funnel), SaaS MRR & Churn, Pareto 80/20, Market Basket (mua kèm), Kiểm toán lệch tiền...
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm case: Pareto, Funnel, Churn..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-edu-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1">Cấp độ:</span>
            {['Tất cả', 'Easy', 'Medium', 'Hard', 'Interview'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  difficultyFilter === d
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1">Lĩnh vực:</span>
            {['Tất cả', 'E-commerce', 'Product Analytics', 'HR & Ops', 'Data Audit'].map(
              (dom) => (
                <button
                  key={dom}
                  onClick={() => setDomainFilter(dom)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    domainFilter === dom
                      ? 'bg-edu-600 text-white'
                      : 'bg-edu-50/70 text-edu-800 hover:bg-edu-100'
                  }`}
                >
                  {dom}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((c) => {
          const solved = solvedCaseIds.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className={`group text-left rounded-2xl border p-4 shadow-card transition-all flex flex-col justify-between gap-3 ${
                solved
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                  : 'bg-white border-slate-200 hover:border-edu-400 hover:shadow-md'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    CASE #{String(c.order).padStart(2, '0')} · {c.domain}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${DIFF_STYLE[c.difficulty]}`}
                  >
                    {c.difficulty}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-edu-600 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {c.scenario}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {c.skills.slice(0, 2).map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {solved ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã xong
                  </span>
                ) : (
                  <span className="text-xs font-extrabold text-brand-600">
                    +{c.challenge.xp} XP →
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
