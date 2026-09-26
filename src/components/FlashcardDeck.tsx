import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard } from '../types/study-kit';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  Sparkles,
  ArrowLeftRight
} from 'lucide-react';

interface FlashcardDeckProps {
  flashcards: Flashcard[];
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ flashcards }) => {
  const [cards, setCards] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<number>>(new Set());
  const [reverseMode, setReverseMode] = useState(false); // test definition -> term

  useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setReviewIds(new Set());
  }, [flashcards]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const markMastered = () => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      next.add(currentIndex);
      return next;
    });
    setReviewIds((prev) => {
      const next = new Set(prev);
      next.delete(currentIndex);
      return next;
    });
    if (currentIndex < cards.length - 1) {
      handleNext();
    }
  };

  const markForReview = () => {
    setReviewIds((prev) => {
      const next = new Set(prev);
      next.add(currentIndex);
      return next;
    });
    setMasteredIds((prev) => {
      const next = new Set(prev);
      next.delete(currentIndex);
      return next;
    });
    if (currentIndex < cards.length - 1) {
      handleNext();
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev]);

  // Audio pronunciation helper
  const speakText = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
        No flashcards generated yet.
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const isMastered = masteredIds.has(currentIndex);
  const needsReview = reviewIds.has(currentIndex);

  const frontText = reverseMode ? currentCard.back : currentCard.term;
  const backText = reverseMode ? currentCard.term : currentCard.back;
  const frontLabel = reverseMode ? 'Definition / Answer' : 'Term / Question';
  const backLabel = reverseMode ? 'Term / Concept' : 'Definition / Answer';

  const progressPercent = Math.round(((masteredIds.size) / cards.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 text-xs sm:text-sm text-slate-400 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {masteredIds.size} Mastered
            </span>
            <span className="inline-flex items-center gap-1 text-amber-400 ml-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {reviewIds.size} Needs Review
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReverseMode(!reverseMode)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
              reverseMode
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch front and back"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{reverseMode ? 'Definition First' : 'Term First'}</span>
          </button>
          <button
            onClick={handleShuffle}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            title="Shuffle Deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/60 h-1.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="w-full h-80 sm:h-96 perspective-1000 cursor-pointer select-none group"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d rounded-2xl shadow-xl border ${
            isMastered
              ? 'border-emerald-500/40 ring-1 ring-emerald-500/30'
              : needsReview
              ? 'border-amber-500/40 ring-1 ring-amber-500/30'
              : 'border-slate-700/80 hover:border-indigo-500/50'
          } ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Card Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between text-xs text-indigo-400 font-mono tracking-wider">
              <span className="flex items-center gap-1.5 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-800/40">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                {frontLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => speakText(frontText, e)}
                  className="p-1 rounded-md text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80 transition"
                  title="Listen pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="text-slate-400 text-xs">Click or Space to flip</span>
              </div>
            </div>

            <div className="my-auto py-4 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight leading-snug">
                {frontText}
              </h3>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
              <span>Card {currentIndex + 1}</span>
              <span className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-400 transition">
                <RotateCw className="w-3.5 h-3.5 animate-spin-hover" />
                Flip for answer
              </span>
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/40 p-6 sm:p-8 flex flex-col justify-between overflow-hidden border-indigo-500/20">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-mono tracking-wider">
              <span className="flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {backLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => speakText(backText, e)}
                  className="p-1 rounded-md text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 transition"
                  title="Listen pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="text-slate-400 text-xs">Click or Space to flip back</span>
              </div>
            </div>

            <div className="my-auto py-3 overflow-y-auto max-h-56">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal text-left sm:text-center whitespace-pre-line">
                {backText}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
              <span>Back side</span>
              <span className="text-emerald-400 font-medium">Ready to rate?</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Mastery Actions */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition active:scale-95 flex items-center gap-1"
            title="Previous Card (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-xs hidden sm:inline">Prev</span>
          </button>
          <button
            onClick={handleFlip}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition active:scale-95 flex items-center gap-1.5"
          >
            <RotateCw className="w-4 h-4" />
            <span>Flip Card</span>
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition active:scale-95 flex items-center gap-1"
            title="Next Card (Right Arrow)"
          >
            <span className="text-xs hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Self-Rating Mastery Actions */}
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button
            onClick={markForReview}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
              needsReview
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Needs Review</span>
          </button>
          <button
            onClick={markMastered}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
              isMastered
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Mastered</span>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="mt-4 text-[11px] text-slate-400 flex items-center gap-3">
        <span>Shortcuts:</span>
        <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">Space</span> Flip
        <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">← / →</span> Navigate
      </div>
    </div>
  );
};
