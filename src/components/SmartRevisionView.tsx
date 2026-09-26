import React, { useState } from 'react';
import { QuickRevision, SmartRevisionModes } from '../types/study-kit';
import { 
  Zap, 
  Clock, 
  Target, 
  Flame, 
  Copy, 
  Check, 
  Printer, 
  AlertTriangle, 
  CheckCircle2, 
  Bookmark, 
  Variable, 
  Tag 
} from 'lucide-react';

interface SmartRevisionViewProps {
  quickRevision: QuickRevision;
  smartRevision: SmartRevisionModes;
  topicTitle: string;
}

export const SmartRevisionView: React.FC<SmartRevisionViewProps> = ({
  quickRevision,
  smartRevision,
  topicTitle,
}) => {
  const [activeMode, setActiveMode] = useState<'quick' | '5min' | 'exam' | 'lastMinute'>('quick');
  const [copied, setCopied] = useState(false);

  const handleCopyCurrent = () => {
    let text = `${topicTitle} - Revision\n\n`;
    if (activeMode === 'quick') {
      text += `KEY POINTS:\n${quickRevision.keyPoints.join('\n')}\n\nCOMMON MISTAKES:\n${quickRevision.commonMistakes.join('\n')}`;
    } else if (activeMode === '5min') {
      text += `5-MINUTE REVISION:\n${smartRevision.fiveMinuteRevision.mustRememberPoints.join('\n')}`;
    } else if (activeMode === 'exam') {
      text += `EXAM REVISION:\n${smartRevision.examRevision.highYieldConcepts.join('\n')}`;
    } else {
      text += `LAST-MINUTE REVISION:\n${smartRevision.lastMinuteRevision.ultraSummaryBullets.join('\n')}`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/80 p-6 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-slate-100 text-lg">
              14 & 21. 🔄 Smart & Quick Revision Hub
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Tailored rapid revision workflows: Chapter Quick Revision, 5-Minute Sprint, Deep Exam Revision, and Last-Minute Flash Recap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCurrent}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Section</span>
              </>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition hidden sm:flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveMode('quick')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeMode === 'quick'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>⚡ Quick Revision</span>
        </button>

        <button
          onClick={() => setActiveMode('5min')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeMode === '5min'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>⏱️ 5-Minute Sprint</span>
        </button>

        <button
          onClick={() => setActiveMode('exam')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeMode === 'exam'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>🎯 Exam Revision</span>
        </button>

        <button
          onClick={() => setActiveMode('lastMinute')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeMode === 'lastMinute'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>⏳ Last-Minute</span>
        </button>
      </div>

      {/* Mode 1: Quick Revision */}
      {activeMode === 'quick' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Key Points */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              5–10 Essential Key Points
            </h4>
            <div className="space-y-2">
              {quickRevision.keyPoints.map((pt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5">
                  <span className="font-bold text-emerald-400">{idx + 1}.</span>
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Conceptual Mistakes */}
          <div className="bg-slate-900/90 rounded-2xl border border-rose-900/40 p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Common Conceptual Mistakes Students Make (Exam Pitfalls)
            </h4>
            <div className="space-y-2">
              {quickRevision.commonMistakes.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs sm:text-sm text-rose-200 flex items-start gap-2.5">
                  <span className="font-bold text-rose-400">⚠️</span>
                  <span className="leading-relaxed">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Definitions & Formulas Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> Core Definitions
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {quickRevision.definitions.map((d, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Variable className="w-4 h-4" /> Important Formulas & Laws
              </h4>
              {quickRevision.formulasOrRules && quickRevision.formulasOrRules.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  {quickRevision.formulasOrRules.map((f, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-amber-300">
                      {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">No direct mathematical equations in this topic.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: 5-Minute Sprint */}
      {activeMode === '5min' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Clock className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-base font-bold text-slate-100">
                {smartRevision.fiveMinuteRevision.title || '5-Minute High-Yield Sprint'}
              </h4>
              <p className="text-xs text-slate-400">
                Only the most critical concepts, definitions, and formulas. No fluff.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Must-Remember Points:
              </span>
              <div className="space-y-2">
                {smartRevision.fiveMinuteRevision.mustRememberPoints.map((pt, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                    <span className="font-bold text-emerald-400">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {smartRevision.fiveMinuteRevision.definitions && smartRevision.fiveMinuteRevision.definitions.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
                  Key Definitions:
                </span>
                <div className="space-y-1.5">
                  {smartRevision.fiveMinuteRevision.definitions.map((def, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-xs text-slate-300">
                      {def}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Exam Revision */}
      {activeMode === 'exam' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Target className="w-5 h-5 text-indigo-400" />
            <div>
              <h4 className="text-base font-bold text-slate-100">
                {smartRevision.examRevision.title || 'Comprehensive Exam Revision'}
              </h4>
              <p className="text-xs text-slate-400">
                High-yield concepts, expected questions, and critical pitfalls.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                High-Yield Concepts:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {smartRevision.examRevision.highYieldConcepts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Expected Exam Questions:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {smartRevision.examRevision.expectedQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {smartRevision.examRevision.criticalPitfalls && smartRevision.examRevision.criticalPitfalls.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs text-rose-200 space-y-1.5">
              <strong className="text-rose-400 uppercase tracking-wide block text-[11px]">
                Critical Pitfalls to Avoid in Exam Hall:
              </strong>
              {smartRevision.examRevision.criticalPitfalls.map((p, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 4: Last-Minute Flash Recap */}
      {activeMode === 'lastMinute' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Flame className="w-5 h-5 text-rose-400" />
            <div>
              <h4 className="text-base font-bold text-slate-100">
                {smartRevision.lastMinuteRevision.title || 'Last-Minute Must-Remember Bullets'}
              </h4>
              <p className="text-xs text-slate-400">
                Read this in the final 10 minutes before entering the exam room.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {smartRevision.lastMinuteRevision.ultraSummaryBullets.map((bullet, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-100 flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
