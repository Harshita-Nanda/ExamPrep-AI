import React from 'react';
import { StructuredTopic, StudentProgress, QuizQuestion } from '../types/study-kit';
import { 
  BarChart3, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Award, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface ProgressDashboardViewProps {
  topics: StructuredTopic[];
  progress: StudentProgress;
  quizQuestions: QuizQuestion[];
  onToggleCompleteTopic: (topicId: string) => void;
  onNavigateToTopicHinglish: (topicName: string) => void;
  onNavigateToQuiz: () => void;
}

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  topics,
  progress,
  quizQuestions,
  onToggleCompleteTopic,
  onNavigateToTopicHinglish,
  onNavigateToQuiz,
}) => {
  const completedCount = progress.completedTopicIds.length;
  const totalTopics = topics.length;
  const topicCompletionPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Quiz calculations
  const totalQuizAttempts = Object.keys(progress.quizAttempts).length;
  const correctQuizAttempts = Object.values(progress.quizAttempts).filter((a) => a.isCorrect).length;
  const incorrectQuizAttempts = totalQuizAttempts - correctQuizAttempts;
  const quizAccuracyPct =
    totalQuizAttempts > 0 ? Math.round((correctQuizAttempts / totalQuizAttempts) * 100) : 0;

  // Weak topics determination
  const weakTopics = progress.flaggedWeakTopicNames;

  // Generate ASCII-style progress bar like "██████████ 100%"
  const getAsciiBar = (percentage: number) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round((percentage / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks) + ` ${percentage}%`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/80 p-6 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-slate-100 text-lg">
              12 & 13. 📈 Student Learning Progress & Diagnostic Dashboard
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time mastery tracking across topics, quiz accuracy metrics, and targeted weak-topic diagnosis.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Overall Readiness
          </span>
          <span className="text-xl font-extrabold text-indigo-400">
            {Math.round((topicCompletionPct + quizAccuracyPct) / 2)}%
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Topics Completed</span>
          <div className="text-xl font-extrabold text-slate-100">
            {completedCount} / {totalTopics}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">{topicCompletionPct}% Finished</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Quiz Accuracy</span>
          <div className="text-xl font-extrabold text-slate-100">
            {quizAccuracyPct}%
          </div>
          <span className="text-[11px] text-indigo-400 font-semibold">{correctQuizAttempts} Correct / {totalQuizAttempts} Answered</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Weak Topics</span>
          <div className="text-xl font-extrabold text-amber-400">
            {weakTopics.length}
          </div>
          <span className="text-[11px] text-amber-300/80 font-medium">Needs Review</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Flashcards Mastered</span>
          <div className="text-xl font-extrabold text-emerald-400">
            {progress.flashcardsMastered || 0}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Active Recall</span>
        </div>
      </div>

      {/* Visual ASCII Progress Bars for Topics */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h4 className="text-sm font-bold text-slate-100 flex items-center justify-between">
          <span>Topic Mastery Progress Bars (Prompt Representation):</span>
          <span className="text-xs text-slate-400 font-normal">Click checkmark to update status</span>
        </h4>

        <div className="space-y-3 font-mono text-xs">
          {topics.map((t, idx) => {
            const isCompleted = progress.completedTopicIds.includes(t.id);
            const topicPct = isCompleted ? 100 : 0;
            const ascii = getAsciiBar(topicPct);

            return (
              <div
                key={t.id || idx}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleCompleteTopic(t.id)}
                    className="text-slate-400 hover:text-emerald-400 transition"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <span className="font-semibold text-slate-200 truncate max-w-sm">
                    Topic {idx + 1}: {t.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-xs ${
                      isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {ascii}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🧩 Weak Area Diagnosis & Next Steps */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            13. 🧩 Weak Topic Detection & Target Action Plan
          </h4>
          {weakTopics.length > 0 && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 font-semibold">
              {weakTopics.length} Focus Areas
            </span>
          )}
        </div>

        {weakTopics.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-200">
              No weak topics identified yet!
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Take the interactive Topic Quiz to test your retention. Any concept you miss will automatically trigger targeted diagnostic explanations here.
            </p>
            <button
              onClick={onNavigateToQuiz}
              className="mt-2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
            >
              Start Topic Quiz &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {weakTopics.map((topicName, idx) => {
              const matched = topics.find(
                (t) => t.name.toLowerCase() === topicName.toLowerCase()
              );

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                      ⚠️ {topicName}
                    </span>
                    <p className="text-xs text-slate-300">
                      Target Action: Review the friendly Hinglish breakdown and practice 2 marks questions.
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigateToTopicHinglish(topicName)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition flex items-center gap-1 shrink-0"
                  >
                    <span>Read Hinglish Guru</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
