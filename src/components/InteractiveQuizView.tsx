import React, { useState } from 'react';
import { QuizQuestion, StructuredTopic } from '../types/study-kit';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  Award,
  ChevronRight
} from 'lucide-react';

interface InteractiveQuizViewProps {
  quizQuestions: QuizQuestion[];
  topics: StructuredTopic[];
  onRecordAnswer: (questionId: string, isCorrect: boolean, topicName: string) => void;
  onNavigateToRevision: () => void;
}

export const InteractiveQuizView: React.FC<InteractiveQuizViewProps> = ({
  quizQuestions,
  topics,
  onRecordAnswer,
  onNavigateToRevision,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [weakTopicsDetected, setWeakTopicsDetected] = useState<Set<string>>(new Set());

  const handleSelectOption = (q: QuizQuestion, optionIdx: number) => {
    if (selectedAnswers[q.id] !== undefined) return; // already answered

    const isCorrect = optionIdx === q.correctIndex;
    setSelectedAnswers((prev) => ({ ...prev, [q.id]: optionIdx }));

    if (!isCorrect) {
      setWeakTopicsDetected((prev) => {
        const next = new Set(prev);
        next.add(q.topicName);
        return next;
      });
    }

    onRecordAnswer(q.id, isCorrect, q.topicName);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setWeakTopicsDetected(new Set());
  };

  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = quizQuestions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Quiz Header & Live Scorecard */}
      <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900/80 p-6 rounded-2xl border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-slate-100 text-lg">
              11. 🧪 Interactive Topic Quiz & Weak Area Detection
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Immediate feedback with conceptual remediation for wrong answers to identify and fix conceptual stumbling blocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Live Score
            </span>
            <span className="text-lg font-extrabold text-indigo-400">
              {correctCount} / {quizQuestions.length}
            </span>
          </div>
          {totalAnswered > 0 && (
            <button
              onClick={handleResetQuiz}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Retake Quiz"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Weak Topic Detection Alert Card */}
      {weakTopicsDetected.size > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              🧩 Weak Areas Detected ({weakTopicsDetected.size})
            </div>
            <button
              onClick={onNavigateToRevision}
              className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-semibold"
            >
              Open Smart Revision &rarr;
            </button>
          </div>
          <p className="text-xs text-slate-300">
            You missed questions in the following topics. Review the simplified Hinglish explanations below:
          </p>
          <div className="space-y-2 pt-1">
            {Array.from(weakTopicsDetected).map((topicName, idx) => {
              const matchedTopic = topics.find(
                (t) => t.name.toLowerCase() === topicName.toLowerCase()
              );
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">
                      Topic: {topicName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300">
                      Needs Conceptual Review
                    </span>
                  </div>
                  {matchedTopic && (
                    <p className="text-slate-300 text-xs leading-relaxed pt-1">
                      💡 <strong className="text-amber-200">Hinglish Tip: </strong>
                      {matchedTopic.hinglishUnderstanding.substring(0, 180)}...
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quiz Questions List */}
      <div className="space-y-6">
        {quizQuestions.map((q, idx) => {
          const selectedIdx = selectedAnswers[q.id];
          const hasAnswered = selectedIdx !== undefined;
          const isCorrect = selectedIdx === q.correctIndex;

          return (
            <div
              key={q.id || idx}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-800/40">
                  Question {idx + 1} • {q.topicName}
                </span>
                {hasAnswered && (
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                      isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              <h4 className="text-base font-semibold text-slate-100 leading-snug">
                {q.question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedIdx === optIdx;
                  const isAnswerOption = optIdx === q.correctIndex;

                  let btnStyle =
                    'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-700 hover:bg-slate-800/50';

                  if (hasAnswered) {
                    if (isAnswerOption) {
                      btnStyle =
                        'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/40';
                    } else if (isSelected && !isCorrect) {
                      btnStyle =
                        'border-rose-500/80 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500/40';
                    } else {
                      btnStyle = 'border-slate-800/60 bg-slate-950/20 text-slate-400 opacity-60';
                    }
                  }

                  const cleanOpt = opt.replace(/^[A-D]\)\s*|^[A-D]\.\s*/i, '');
                  const letters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={optIdx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(q, optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${btnStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          hasAnswered && isAnswerOption
                            ? 'bg-emerald-500 text-slate-950'
                            : hasAnswered && isSelected
                            ? 'bg-rose-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {letters[optIdx] || optIdx + 1}
                      </span>
                      <span className="text-sm leading-relaxed pt-0.5 flex-1">{cleanOpt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback & Remediation */}
              {hasAnswered && (
                <div
                  className={`p-4 rounded-xl border space-y-2 animate-in fade-in duration-200 ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-xs">
                    <strong className="text-slate-100">Explanation: </strong>
                    {q.explanation}
                  </div>

                  {/* Concept Remediation if incorrect */}
                  {!isCorrect && q.conceptRemediation && (
                    <div className="pt-2 border-t border-slate-800/80 text-xs text-amber-200 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300 block mb-0.5">
                          Concept Remediation (Why this matters):
                        </strong>
                        {q.conceptRemediation}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
