import React, { useState } from 'react';
import { StructuredTopic } from '../types/study-kit';
import { 
  Smile, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Baby, 
  GraduationCap, 
  Lightbulb, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface HinglishBeginnerViewProps {
  topics: StructuredTopic[];
}

export const HinglishBeginnerView: React.FC<HinglishBeginnerViewProps> = ({ topics }) => {
  const [mode, setMode] = useState<'hinglish' | 'beginner'>('hinglish');
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const toggleSpeech = (idx: number, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Intro Header & Mode Toggle */}
      <div className="bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-slate-900/80 p-6 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
            {mode === 'hinglish' ? <Smile className="w-6 h-6" /> : <Baby className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-100 text-base sm:text-lg">
                {mode === 'hinglish' ? 'Hinglish Understanding' : "Explain Like I'm a Beginner"}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {mode === 'hinglish' ? 'Teacher Mode' : 'ELI5 Mode'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {mode === 'hinglish'
                ? 'Concepts explained in friendly Hindi + English, explaining the WHY & HOW with real-life analogies.'
                : 'Complex topics broken down into extremely simple language for crystal-clear clarity.'}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setMode('hinglish')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              mode === 'hinglish'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Hinglish Guru
          </button>
          <button
            onClick={() => setMode('beginner')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              mode === 'beginner'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            Beginner (ELI5)
          </button>
        </div>
      </div>

      {/* Topics Stack */}
      <div className="space-y-6">
        {topics.map((topic, idx) => {
          const isSpeaking = speakingIdx === idx;
          const isCopied = copiedIdx === idx;
          const displayText =
            mode === 'hinglish' ? topic.hinglishUnderstanding : topic.beginnerExplanation;

          return (
            <div
              key={topic.id || idx}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all shadow-lg overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-100">
                      {topic.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Difficulty: {topic.difficulty} • {topic.examImportance}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSpeech(idx, displayText)}
                    className={`p-1.5 rounded-lg border text-xs transition flex items-center gap-1.5 ${
                      isSpeaking
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                    title={isSpeaking ? 'Stop Audio' : 'Listen & Learn (Text to Speech)'}
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline font-medium">
                      {isSpeaking ? 'Pause' : 'Listen'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleCopy(idx, displayText)}
                    className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
                    title="Copy explanation"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                  {displayText}
                </p>

                {/* Quick Keyword Pill Hint */}
                {topic.keywords && topic.keywords.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Key terms:</span>
                    {topic.keywords.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-950/80 text-amber-300 border border-slate-800 text-xs font-mono"
                      >
                        {kw.term}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
