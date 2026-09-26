import React, { useState } from 'react';
import { StudyKit } from '../types/study-kit';
import { 
  GraduationCap, 
  History, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentKit: StudyKit | null;
  savedKits: StudyKit[];
  onSelectKit: (kit: StudyKit) => void;
  onNewKit: () => void;
  onClearHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentKit,
  savedKits,
  onSelectKit,
  onNewKit,
  onClearHistory,
}) => {
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={onNewKit}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-100">
                ExamPrep<span className="text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Academic Tutor
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Structured Study Kits • Key Concepts • Questions • Flashcards
            </p>
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2.5">
          {/* History Dropdown */}
          {savedKits.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-medium transition flex items-center gap-2"
              >
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Saved Kits ({savedKits.length})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showHistoryDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowHistoryDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs">
                      <span className="font-semibold text-slate-300">Recent Study Kits</span>
                      <button
                        onClick={() => {
                          onClearHistory();
                          setShowHistoryDropdown(false);
                        }}
                        className="text-slate-400 hover:text-rose-400 transition flex items-center gap-1 text-[11px]"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto p-1 space-y-1">
                      {savedKits.map((kit) => (
                        <button
                          key={kit.id}
                          onClick={() => {
                            onSelectKit(kit);
                            setShowHistoryDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition text-xs flex flex-col gap-0.5 ${
                            currentKit?.id === kit.id
                              ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-200'
                              : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <span className="font-semibold truncate">{kit.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(kit.createdAt).toLocaleDateString()} • {kit.flashcards.length} cards
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* New Material Button */}
          {currentKit && (
            <button
              onClick={onNewKit}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Kit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
