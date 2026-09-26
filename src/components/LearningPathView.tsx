import React from 'react';
import { LearningPathStep, ConceptConnection } from '../types/study-kit';
import { 
  MapPin, 
  GitCommit, 
  ArrowDown, 
  Share2, 
  Compass, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface LearningPathViewProps {
  learningPath: LearningPathStep[];
  conceptConnections: ConceptConnection[];
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  learningPath,
  conceptConnections,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* 1. Learning Path Roadmap */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg">
              7. 🗺️ Step-by-Step Learning Path & Prerequisites
            </h3>
            <p className="text-xs text-slate-400">
              Optimal learning order designed to build prerequisites before tackling complex concepts.
            </p>
          </div>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-500/30">
          {learningPath.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Node dot */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                {step.stepNumber}
              </div>

              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-xl border border-slate-800/80 hover:border-indigo-500/40 transition">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
                    Phase: {step.phase}
                  </span>
                  {step.prerequisites && step.prerequisites.length > 0 && (
                    <span className="text-[11px] text-slate-400">
                      Prerequisites: {step.prerequisites.join(', ')}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-100 mb-1">
                  {step.topic}
                </h4>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Concept Connections Map */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg">
              8. 🔗 Concept Connections & Relationships
            </h3>
            <p className="text-xs text-slate-400">
              How key ideas interlock across the material to form a coherent mental model.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {conceptConnections.map((conn, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 hover:border-purple-500/40 transition"
            >
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-200">
                <span className="text-indigo-400">{conn.from}</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-purple-300">{conn.to}</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 italic">
                {conn.relationship}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
