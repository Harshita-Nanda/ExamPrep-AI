import React, { useState } from 'react';
import { PracticeQuestions } from '../types/study-kit';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Award, 
  FileText, 
  Compass, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';

interface PracticeExamViewProps {
  practiceQuestions: PracticeQuestions;
}

export const PracticeExamView: React.FC<PracticeExamViewProps> = ({ practiceQuestions }) => {
  const { mcq, shortAnswer, conceptualApplication } = practiceQuestions;

  // MCQ state
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasSubmittedMCQ, setHasSubmittedMCQ] = useState(false);

  // Short Answer state
  const [studentShortAnswer, setStudentShortAnswer] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [checkedRubricPoints, setCheckedRubricPoints] = useState<Set<number>>(new Set());

  // Conceptual Application state
  const [studentApplicationAnswer, setStudentApplicationAnswer] = useState('');
  const [showApplicationAnalysis, setShowApplicationAnalysis] = useState(false);

  const handleSelectOption = (index: number) => {
    if (hasSubmittedMCQ) return;
    setSelectedOptionIndex(index);
    setHasSubmittedMCQ(true);
  };

  const resetMCQ = () => {
    setSelectedOptionIndex(null);
    setHasSubmittedMCQ(false);
  };

  const toggleRubricPoint = (index: number) => {
    setCheckedRubricPoints((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const isMCQCorrect = selectedOptionIndex === mcq.correctIndex;

  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">
            4. Practice Exam Questions
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Three distinct exam-tested formats based strictly on the source material: Multiple Choice Question (MCQ), Short Answer with high-scoring model answer, and Conceptual Application Question.
          </p>
        </div>
      </div>

      {/* A. Multiple Choice Question (MCQ) */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-lg transition-all hover:border-slate-700/80">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold tracking-wide uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            A. Multiple Choice Question (MCQ)
          </span>
          {hasSubmittedMCQ && (
            <button
              onClick={resetMCQ}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Question
            </button>
          )}
        </div>

        <h4 className="text-base sm:text-lg font-semibold text-slate-100 mb-5 leading-snug">
          {mcq.question}
        </h4>

        {/* Options */}
        <div className="space-y-3 mb-5">
          {mcq.options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isCorrect = idx === mcq.correctIndex;

            let optionStyle =
              'border-slate-800 bg-slate-950/50 text-slate-200 hover:border-slate-700 hover:bg-slate-800/50';

            if (hasSubmittedMCQ) {
              if (isCorrect) {
                optionStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/50';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500/50';
              } else {
                optionStyle = 'border-slate-800/60 bg-slate-950/20 text-slate-400 opacity-60';
              }
            }

            const optionLetters = ['A', 'B', 'C', 'D'];
            const cleanOptionText = option.replace(/^[A-D]\)\s*|^[A-D]\.\s*/i, '');

            return (
              <button
                key={idx}
                disabled={hasSubmittedMCQ}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${optionStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition ${
                    hasSubmittedMCQ && isCorrect
                      ? 'bg-emerald-500 text-slate-950'
                      : hasSubmittedMCQ && isSelected
                      ? 'bg-rose-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {optionLetters[idx] || idx + 1}
                </span>
                <span className="text-sm sm:text-base leading-relaxed pt-0.5 flex-1">
                  {cleanOptionText}
                </span>

                {hasSubmittedMCQ && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {hasSubmittedMCQ && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box */}
        {hasSubmittedMCQ && (
          <div
            className={`p-4 sm:p-5 rounded-xl border mt-4 animate-in fade-in slide-in-from-top-2 duration-300 ${
              isMCQCorrect
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isMCQCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {isMCQCorrect ? 'Correct Answer!' : 'Incorrect'}
              </span>
              <span className="text-xs text-slate-400">
                Marked Answer: Option {['A', 'B', 'C', 'D'][mcq.correctIndex]} ({mcq.correctAnswer})
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              <strong className="text-slate-100">Explanation: </strong>
              {mcq.explanation}
            </p>
          </div>
        )}
      </div>

      {/* B. Short Answer Question */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-lg transition-all hover:border-slate-700/80">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-semibold tracking-wide uppercase">
            <FileText className="w-3.5 h-3.5" />
            B. Short Answer Question
          </span>
          <button
            onClick={() => setShowModelAnswer(!showModelAnswer)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-medium transition"
          >
            {showModelAnswer ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Hide Model Answer
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Reveal Model Answer
              </>
            )}
          </button>
        </div>

        <h4 className="text-base sm:text-lg font-semibold text-slate-100 mb-4 leading-snug">
          {shortAnswer.question}
        </h4>

        {/* Student Scratchpad */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Practice Drafting Your Answer (Active Recall):
          </label>
          <textarea
            value={studentShortAnswer}
            onChange={(e) => setStudentShortAnswer(e.target.value)}
            placeholder="Write your exam-oriented answer here before checking the sample high-scoring answer..."
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3.5 text-sm text-slate-200 placeholder:text-slate-600 transition resize-y"
          />
          <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
            <span>Words: {studentShortAnswer.trim() ? studentShortAnswer.trim().split(/\s+/).length : 0}</span>
            {!showModelAnswer && (
              <button
                onClick={() => setShowModelAnswer(true)}
                className="text-indigo-400 hover:underline flex items-center gap-1"
              >
                Done drafting? Check model answer &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Sample High-Scoring Answer Accordion */}
        {showModelAnswer && (
          <div className="mt-5 p-5 rounded-xl bg-slate-950/90 border border-indigo-500/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                Sample High-Scoring Answer (Exam-Oriented)
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal bg-slate-900/80 p-4 rounded-lg border border-slate-800/80 whitespace-pre-line">
                {shortAnswer.sampleHighScoringAnswer}
              </p>
            </div>

            {/* Rubric Points Checklist if available */}
            {shortAnswer.keyGradingPoints && shortAnswer.keyGradingPoints.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Key Points / Rubric Checklist (Did your answer cover):
                </span>
                <div className="space-y-1.5">
                  {shortAnswer.keyGradingPoints.map((point, idx) => {
                    const isChecked = checkedRubricPoints.has(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleRubricPoint(idx)}
                        className="w-full flex items-center gap-2.5 text-left text-xs sm:text-sm text-slate-300 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800/50 transition"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className={isChecked ? 'line-through text-slate-400' : ''}>
                          {point}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* C. Conceptual Application Question */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-lg transition-all hover:border-slate-700/80">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-semibold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5" />
            C. Conceptual Application Question
          </span>
          <button
            onClick={() => setShowApplicationAnalysis(!showApplicationAnalysis)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-medium transition"
          >
            {showApplicationAnalysis ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Hide Sample Answer
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Reveal Sample Answer
              </>
            )}
          </button>
        </div>

        <h4 className="text-base sm:text-lg font-semibold text-slate-100 mb-3 leading-snug">
          {conceptualApplication.question}
        </h4>

        {/* Real-World Scenario Callout */}
        {conceptualApplication.scenario && (
          <div className="mb-4 p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-sm text-purple-200">
            <span className="font-semibold text-purple-300 block mb-1 text-xs uppercase tracking-wide">
              Real-World Scenario / Context:
            </span>
            {conceptualApplication.scenario}
          </div>
        )}

        {/* Student Thought Scratchpad */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Your Practical Application Answer:
          </label>
          <textarea
            value={studentApplicationAnswer}
            onChange={(e) => setStudentApplicationAnswer(e.target.value)}
            placeholder="Explain how the concept from the material applies to this real-world scenario..."
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3.5 text-sm text-slate-200 placeholder:text-slate-600 transition resize-y"
          />
        </div>

        {/* Suitable Sample Answer Reveal */}
        {showApplicationAnalysis && (
          <div className="p-5 rounded-xl bg-slate-950/90 border border-purple-500/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
              Suitable Sample Answer (Application Breakdown)
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal bg-slate-900/80 p-4 rounded-lg border border-slate-800/80 whitespace-pre-line">
              {conceptualApplication.sampleAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
