/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudyKit } from './types/study-kit';
import { Navbar } from './components/Navbar';
import { MaterialInputSection } from './components/MaterialInputSection';
import { StudyKitDashboard } from './components/StudyKitDashboard';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  Layers, 
  HelpCircle, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

const STORAGE_KEY = 'examprep_study_kits_history';

export default function App() {
  const [currentKit, setCurrentKit] = useState<StudyKit | null>(null);
  const [savedKits, setSavedKits] = useState<StudyKit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Load saved kits from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedKits(parsed);
          // Don't auto-select if user wants fresh start, or auto-select latest
        }
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  const saveKitToHistory = (kit: StudyKit) => {
    setSavedKits((prev) => {
      // Remove any with same id, prepend latest
      const filtered = prev.filter((k) => k.id !== kit.id);
      const updated = [kit, ...filtered].slice(0, 15); // keep up to 15
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setSavedKits([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleGenerate = async (payload: {
    text?: string;
    imageBase64?: string;
    imageMimeType?: string;
    customInstructions?: string;
  }) => {
    setIsLoading(true);
    setGlobalError(null);

    try {
      const response = await fetch('/api/study-kit/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate study kit.');
      }

      const newKit: StudyKit = data.studyKit;
      setCurrentKit(newKit);
      saveKitToHistory(newKit);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Generation failed:', err);
      setGlobalError(err.message || 'An unexpected error occurred during processing.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30">
      {/* Top Navbar */}
      <Navbar
        currentKit={currentKit}
        savedKits={savedKits}
        onSelectKit={(kit) => setCurrentKit(kit)}
        onNewKit={() => setCurrentKit(null)}
        onClearHistory={clearHistory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {globalError && (
          <div className="mb-6 max-w-4xl mx-auto p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-sm flex items-center justify-between">
            <span>{globalError}</span>
            <button
              onClick={() => setGlobalError(null)}
              className="text-xs text-rose-400 hover:text-rose-200 uppercase font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {!currentKit ? (
          <div className="space-y-12">
            {/* Input Section */}
            <MaterialInputSection
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />

            {/* Feature Highlights Grid */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm mb-1">
                    1. Academic Notes
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Topic & subtopic organization, definitions, formulas, and preserved technical terminology for exam revision.
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-indigo-400/80 font-medium">
                  Structured & formal
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm mb-1">
                    2. Hinglish Guru
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Friendly teacher explanations in conversational Hinglish with real-life analogies, breaking tough concepts into simple steps.
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-amber-400/80 font-medium">
                  Conceptual clarity
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm mb-1">
                    3 & 4. Exam Questions
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Core concepts plus 3 exam questions: MCQ (with explanation), Short Answer (sample high-scoring answer), and Conceptual Application.
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-blue-400/80 font-medium">
                  Active recall test
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm mb-1">
                    5 & 6. Flashcards & Cheat-Sheet
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Interactive 3D flashcards (with clean JSON export) and a last-minute quick revision cheat-sheet for exam day.
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-emerald-400/80 font-medium">
                  Spaced repetition & recap
                </div>
              </div>
            </div>
          </div>
        ) : (
          <StudyKitDashboard
            studyKit={currentKit}
            onNewKit={() => setCurrentKit(null)}
            savedKits={savedKits}
            onSelectSavedKit={(kit) => setCurrentKit(kit)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ExamPrep AI</span>
            <span>• Academic Tutor & Exam Preparation Assistant</span>
          </div>
          <div>
            Powered by Gemini 3.8 Flash • Multimodal Notes & Document Analysis
          </div>
        </div>
      </footer>
    </div>
  );
}
