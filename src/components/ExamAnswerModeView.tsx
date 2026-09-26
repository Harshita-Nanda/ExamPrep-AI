import React, { useState } from 'react';
import { StructuredTopic } from '../types/study-kit';
import { 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Printer, 
  PenTool,
  CheckCircle2
} from 'lucide-react';

interface ExamAnswerModeViewProps {
  topics: StructuredTopic[];
}

export const ExamAnswerModeView: React.FC<ExamAnswerModeViewProps> = ({ topics }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [selectedMarks, setSelectedMarks] = useState<'marks2' | 'marks5' | 'marks10'>('marks5');
  const [copied, setCopied] = useState(false);
  const [studentPracticeNotes, setStudentPracticeNotes] = useState('');

  const activeTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  const handleCopyAnswer = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentAnswerText = activeTopic?.examAnswers?.[selectedMarks] || 'Answer not generated.';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/80 p-6 rounded-2xl border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-slate-100 text-lg">
              10. 📝 Exam Answer Mode (2 / 5 / 10 Marks)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Tailor-made exam-ready answers according to question weightage: 2 Marks (Precision), 5 Marks (Structured Overview), or 10 Marks (Comprehensive Essay).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopyAnswer(currentAnswerText)}
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
                <span>Copy Model Answer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        {/* Topic Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
            Select Exam Topic:
          </label>
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {topics.map((t, idx) => (
              <option key={t.id || idx} value={t.id}>
                Topic {idx + 1}: {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Marks Weightage Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
            Select Question Weightage:
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedMarks('marks2')}
              className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                selectedMarks === 'marks2'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>2 Marks</span>
            </button>
            <button
              onClick={() => setSelectedMarks('marks5')}
              className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                selectedMarks === 'marks5'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>5 Marks</span>
            </button>
            <button
              onClick={() => setSelectedMarks('marks10')}
              className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                selectedMarks === 'marks10'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>10 Marks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Marks Rubric Guide Callout */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          {selectedMarks === 'marks2' && '2 Marks Format: Concise Definition + 1 to 2 key points.'}
          {selectedMarks === 'marks5' && '5 Marks Format: Definition + Detailed Explanation + Key Points + Example / Diagram + Short Conclusion.'}
          {selectedMarks === 'marks10' && '10 Marks Format: Formal Introduction + Subtopics breakdown + Complete Examples + Diagram / Flow + Academic Conclusion.'}
        </span>
        <span className="text-[11px] font-mono text-indigo-400 hidden sm:inline">
          Exam-ready format
        </span>
      </div>

      {/* Answer Display Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              {activeTopic?.name}
            </span>
            <h4 className="text-lg font-bold text-slate-100">
              Model Answer for {selectedMarks === 'marks2' ? '2 Marks' : selectedMarks === 'marks5' ? '5 Marks' : '10 Marks'}
            </h4>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
            {selectedMarks.replace('marks', '')} Marks
          </span>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line font-normal">
          {currentAnswerText}
        </div>
      </div>

      {/* Student Practice Writing Box */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-indigo-400" />
            Timed Practice Scratchpad (Write Your Answer):
          </label>
          <span className="text-xs text-slate-400">
            Word count: {studentPracticeNotes.trim() ? studentPracticeNotes.trim().split(/\s+/).length : 0}
          </span>
        </div>
        <textarea
          value={studentPracticeNotes}
          onChange={(e) => setStudentPracticeNotes(e.target.value)}
          placeholder={`Test yourself! Practice writing a ${selectedMarks.replace('marks', '')}-mark answer here without looking, then compare with the model answer above...`}
          rows={4}
          className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3.5 text-sm text-slate-200 placeholder:text-slate-600 transition resize-y"
        />
      </div>
    </div>
  );
};
