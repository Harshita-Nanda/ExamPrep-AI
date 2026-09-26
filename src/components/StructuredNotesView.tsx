import React, { useState } from 'react';
import { StructuredTopic } from '../types/study-kit';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Tag, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Star,
  Pin,
  HelpCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface StructuredNotesViewProps {
  topics: StructuredTopic[];
  completedTopicIds: string[];
  onToggleCompleteTopic: (topicId: string) => void;
}

export const StructuredNotesView: React.FC<StructuredNotesViewProps> = ({
  topics,
  completedTopicIds,
  onToggleCompleteTopic,
}) => {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    topics.forEach((t) => {
      init[t.id] = true;
    });
    return init;
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyNotes = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper for difficulty styling
  const renderDifficultyBadge = (diff: string) => {
    if (diff === 'Easy') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold">
          🟢 Easy
        </span>
      );
    }
    if (diff === 'Medium') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-semibold">
          🟡 Medium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 font-semibold">
        🔴 Difficult
      </span>
    );
  };

  // Helper for exam importance styling
  const renderImportanceBadge = (imp: string) => {
    if (imp === 'Very Important') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-semibold">
          ⭐ Very Important
        </span>
      );
    }
    if (imp === 'Important') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 font-semibold">
          📌 Important
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
        ○ Supporting Concept
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Structured Academic Notes
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Exam-oriented notes organized topic-wise with definitions, formulas, processes, and high-yield tags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Notes</span>
          </button>
        </div>
      </div>

      {/* Topics Stack */}
      <div className="space-y-6">
        {topics.map((topic, idx) => {
          const isCompleted = completedTopicIds.includes(topic.id);
          const isExpanded = expandedTopics[topic.id] !== false;
          const isCopied = copiedId === topic.id;

          return (
            <div
              key={topic.id || idx}
              className={`bg-slate-900/90 rounded-2xl border transition-all duration-200 overflow-hidden shadow-lg ${
                isCompleted
                  ? 'border-emerald-500/40 bg-slate-900/60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Topic Header Bar */}
              <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleCompleteTopic(topic.id)}
                    className="text-slate-400 hover:text-emerald-400 transition"
                    title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-indigo-400 font-mono">
                        TOPIC {idx + 1}
                      </span>
                      {renderDifficultyBadge(topic.difficulty)}
                      {renderImportanceBadge(topic.examImportance)}
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-100">
                      {topic.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => copyNotes(topic.id, topic.formalNotes)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center gap-1 border border-slate-700"
                    title="Copy topic notes"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleExpand(topic.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Subtopics Pills */}
              {topic.subtopics && topic.subtopics.length > 0 && (
                <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/60 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                  <span className="font-semibold text-slate-400">Subtopics:</span>
                  {topic.subtopics.map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50 text-[11px]"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              )}

              {/* Expanded Notes Body */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Notes Text */}
                  <div className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3">
                    {topic.formalNotes}
                  </div>

                  {/* ASCII / Text Diagram Component if present */}
                  {topic.diagramExplanation && (
                    <div className="p-5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                        <Sparkles className="w-4 h-4" />
                        Visual Flowchart / Diagram: {topic.diagramExplanation.title}
                      </div>

                      <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto whitespace-pre leading-snug">
                        {topic.diagramExplanation.asciiDiagram}
                      </pre>

                      {topic.diagramExplanation.components && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {topic.diagramExplanation.components.map((comp, cIdx) => (
                            <div
                              key={cIdx}
                              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs"
                            >
                              <span className="font-bold text-indigo-300 block">
                                {comp.name}
                              </span>
                              <span className="text-slate-400">{comp.description}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Keywords Pills */}
                  {topic.keywords && topic.keywords.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                        Key Terms in this Topic:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {topic.keywords.map((kw, kIdx) => (
                          <div
                            key={kIdx}
                            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1"
                          >
                            <span className="font-bold text-amber-300 block">
                              {kw.term}
                            </span>
                            <p className="text-slate-300">{kw.definition}</p>
                            <p className="text-amber-200/80 italic text-[11px] pt-0.5">
                              💡 Hinglish: {kw.hinglish}
                            </p>
                          </div>
                        ))}
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
