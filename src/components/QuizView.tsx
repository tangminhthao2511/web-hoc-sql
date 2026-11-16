import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { MeowMascot } from './MeowMascot';

interface QuizViewProps {
  onEarnXp: (amount: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onEarnXp }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUIZ_QUESTIONS[currentIdx];
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === q.correctIndex;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    if (idx === q.correctIndex) {
      setScore((s) => s + 1);
      onEarnXp(20);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= QUIZ_QUESTIONS.length) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-card text-center space-y-5">
        <div className="flex justify-center">
          <MeowMascot mood={pct >= 70 ? 'celebrating' : 'happy'} size={84} />
        </div>
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">
            <Award className="w-4 h-4" />
            Hoàn thành bài kiểm tra nhanh
          </span>
          <h2 className="text-2xl font-display font-extrabold text-slate-900">
            Bạn trả lời đúng {score}/{QUIZ_QUESTIONS.length} câu ({pct}%)
          </h2>
          <p className="text-sm text-slate-600">
            {pct >= 80
              ? 'Quá đỉnh! Bạn đã nắm rất chắc các bẫy phỏng vấn SQL phổ biến.'
              : 'Tuyệt vời! Bạn có thể làm lại để củng cố thêm các khái niệm vừa ôn nhé.'}
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-edu-600 hover:bg-edu-700 text-white text-sm font-bold shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Làm lại bộ câu hỏi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-5">
        {/* Progress Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-edu-600">
              {q.topic} · {q.difficulty}
            </span>
            <h1 className="text-lg font-display font-extrabold text-slate-900 mt-0.5">
              Câu hỏi {currentIdx + 1} / {QUIZ_QUESTIONS.length}
            </h1>
          </div>
          <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            Điểm hiện tại: {score}
          </div>
        </div>

        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-edu-600 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <p className="text-base font-semibold text-slate-900 leading-relaxed">
          {q.question}
        </p>

        {q.codeSnippet && (
          <pre className="p-3.5 rounded-xl bg-slate-900 text-sky-200 font-mono text-xs sm:text-[13px] overflow-x-auto leading-relaxed">
            {q.codeSnippet}
          </pre>
        )}

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            let style =
              'border-slate-200 bg-white hover:border-edu-400 hover:bg-edu-50/30 text-slate-800';
            if (isAnswered) {
              if (idx === q.correctIndex) {
                style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
              } else if (idx === selectedOption) {
                style = 'border-rose-400 bg-rose-50 text-rose-900';
              } else {
                style = 'border-slate-200 bg-slate-50/50 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-sm ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 font-mono font-bold text-xs flex items-center justify-center shrink-0 text-slate-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isAnswered && idx === q.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== q.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className="space-y-4 pt-2">
            <MeowMascot
              mood={isCorrect ? 'celebrating' : 'error'}
              size={48}
              message={`${isCorrect ? 'Chính xác (+20 XP)! ' : 'Chưa đúng rồi! '}${q.explanation}`}
              className="w-full"
            />
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold"
              >
                {currentIdx + 1 >= QUIZ_QUESTIONS.length ? 'Xem tổng kết' : 'Câu tiếp theo'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
