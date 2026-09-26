import React, { useState } from 'react';
import { StudyKit, StudentProgress } from '../types/study-kit';
import { StructuredNotesView } from './StructuredNotesView';
import { HinglishBeginnerView } from './HinglishBeginnerView';
import { ExamAnswerModeView } from './ExamAnswerModeView';
import { PracticeExamView } from './PracticeExamView';
import { InteractiveQuizView } from './InteractiveQuizView';
import { FlashcardDeck } from './FlashcardDeck';
import { SmartRevisionView } from './SmartRevisionView';
import { ProgressDashboardView } from './ProgressDashboardView';
import { LearningPathView } from './LearningPathView';
import { RawMarkdownView } from './RawMarkdownView';
import { TutorChatDrawer } from './TutorChatDrawer';
import { 
  BookOpen, 
  Smile, 
  FileText, 
  HelpCircle, 
  Award, 
  Layers, 
  Zap, 
  BarChart3, 
  Bot, 
  PlusCircle, 
  Calendar, 
  Code2,
  Compass,
  ArrowRight
} from 'lucide-react';

interface StudyKitDashboardProps {
  studyKit: StudyKit;
  onNewKit: () => void;
  savedKits: StudyKit[];
  onSelectSavedKit: (kit: StudyKit) => void;
}

type NavSection = 
  | 'notes' 
  | 'hinglish' 
  | 'examAnswers' 
  | 'practice' 
  | 'quiz' 
  | 'flashcards' 
  | 'revision' 
  | 'progress' 
  | 'roadmap' 
  | 'raw';

export const StudyKitDashboard: React.FC<StudyKitDashboardProps> = ({
  studyKit,
  onNewKit,
  savedKits,
  onSelectSavedKit,
}) => {
  const [activeSection, setActiveSection] = useState<NavSection>('notes');
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  // Student progress state maintained in session / dashboard
  const [studentProgress, setStudentProgress] = useState<StudentProgress>({
    completedTopicIds: [],
    quizAttempts: {},
    flaggedWeakTopicNames: [],
    notesReadStatus: {},
    flashcardsMastered: 0,
  });

  const handleToggleCompleteTopic = (topicId: string) => {
    setStudentProgress((prev) => {
      const exists = prev.completedTopicIds.includes(topicId);
      const updated = exists
        ? prev.completedTopicIds.filter((id) => id !== topicId)
        : [...prev.completedTopicIds, topicId];
      return { ...prev, completedTopicIds: updated };
    });
  };

  const handleRecordQuizAnswer = (questionId: string, isCorrect: boolean, topicName: string) => {
    setStudentProgress((prev) => {
      const attempts = {
        ...prev.quizAttempts,
        [questionId]: { selectedIndex: 0, isCorrect, timestamp: Date.now() },
      };

      const weakTopics = new Set(prev.flaggedWeakTopicNames);
      if (!isCorrect) {
        weakTopics.add(topicName);
      } else {
        // if user got it right, maybe leave or reduce
      }

      return {
        ...prev,
        quizAttempts: attempts,
        flaggedWeakTopicNames: Array.from(weakTopics),
      };
    });
  };

  return (
    <div className="w-full space-y-7">
      {/* Kit Title & Header Stats */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Full 22-Module Study Kit Ready
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(studyKit.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {studyKit.title}
          </h1>

          {studyKit.sourceSummary && (
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {studyKit.sourceSummary}
            </p>
          )}

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
              📚 {studyKit.topics?.length || 0} Topics
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 text-amber-300">
              🧠 Hinglish & ELI5
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 text-blue-300">
              📝 2/5/10 Marks Answers
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 text-purple-300">
              🧪 {studyKit.topicQuiz?.length || 0} Quiz Questions
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 text-emerald-300">
              🃏 {studyKit.flashcards?.length || 0} Flashcards
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={() => setIsTutorOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>💬 Ask a Doubt (Tutor)</span>
          </button>

          <button
            onClick={onNewKit}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Material</span>
          </button>
        </div>
      </div>

      {/* Recommended 9-Section Navigation Bar */}
      <div className="flex items-center border-b border-slate-800 pb-px overflow-x-auto scrollbar-none gap-1 sm:gap-2">
        <button
          onClick={() => setActiveSection('notes')}
          className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeSection === 'notes'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          📚 Notes
        </button>

        <button
          onClick={() => setActiveSection('hinglish')}
          className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeSection === 'hinglish'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smile className="w-4 h-4 text-amber-400" />
          🧠 Hinglish
        </button>

        <button
          onClick={() => setActiveSection('examAnswers')}
          className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeSection === 'examAnswers'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          📝 Exam Answers
        </button>

        <button
          onClick={() => setActiveSection('practice')}
          className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeSection === 'practice'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          ❓ Practice
        </button>

        <button
          onClick={() => setActiveSection('quiz')}
          className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeSection === 'quiz'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          🧪 Quiz
        </button>

        <button
          onClick={() => setActiveSection('flashcards')}
          className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeSection === 'flashcards'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          🃏 Flashcards
        </button>

        <button
          onClick={() => setActiveSection('revision')}
          className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeSection === 'revision'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-rose-400" />
          ⚡ Revision
        </button>

        <button
          onClick={() => setActiveSection('progress')}
          className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeSection === 'progress'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-teal-400" />
          📊 Progress
        </button>

        <button
          onClick={() => setActiveSection('roadmap')}
          className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeSection === 'roadmap'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          🗺️ Roadmap
        </button>

        <button
          onClick={() => setActiveSection('raw')}
          className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
            activeSection === 'raw'
              ? 'border-slate-500 text-slate-200'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Markdown
        </button>
      </div>

      {/* SECTION CONTENT */}

      {/* 1. 📚 Notes */}
      {activeSection === 'notes' && (
        <div className="py-2 animate-in fade-in duration-200">
          <StructuredNotesView
            topics={studyKit.topics || []}
            completedTopicIds={studentProgress.completedTopicIds}
            onToggleCompleteTopic={handleToggleCompleteTopic}
          />
        </div>
      )}

      {/* 2. 🧠 Hinglish & Beginner (ELI5) */}
      {activeSection === 'hinglish' && (
        <div className="py-2 animate-in fade-in duration-200">
          <HinglishBeginnerView topics={studyKit.topics || []} />
        </div>
      )}

      {/* 3. 📝 Exam Answers (2, 5, 10 Marks) */}
      {activeSection === 'examAnswers' && (
        <div className="py-2 animate-in fade-in duration-200">
          <ExamAnswerModeView topics={studyKit.topics || []} />
        </div>
      )}

      {/* 4. ❓ Practice Questions */}
      {activeSection === 'practice' && (
        <div className="py-2 animate-in fade-in duration-200">
          <PracticeExamView practiceQuestions={studyKit.practiceQuestions} />
        </div>
      )}

      {/* 5. 🧪 Topic Quiz with Remediation & Weak Topic Detection */}
      {activeSection === 'quiz' && (
        <div className="py-2 animate-in fade-in duration-200">
          <InteractiveQuizView
            quizQuestions={studyKit.topicQuiz || []}
            topics={studyKit.topics || []}
            onRecordAnswer={handleRecordQuizAnswer}
            onNavigateToRevision={() => setActiveSection('revision')}
          />
        </div>
      )}

      {/* 6. 🃏 Flashcards */}
      {activeSection === 'flashcards' && (
        <div className="py-2 animate-in fade-in duration-200 space-y-6">
          <FlashcardDeck flashcards={studyKit.flashcards || []} />

          {/* Clean JSON Viewer */}
          <div className="max-w-3xl mx-auto bg-slate-950 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="font-mono text-emerald-400 font-semibold">
                Valid JSON Format (Anki / Quizlet Export):
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(studyKit.flashcards, null, 2)
                  );
                }}
                className="hover:text-slate-200 transition text-[11px] bg-slate-900 px-2 py-1 rounded border border-slate-800"
              >
                Copy JSON
              </button>
            </div>
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto max-h-60 p-3 bg-slate-900/60 rounded-xl border border-slate-850">
              {JSON.stringify(studyKit.flashcards, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* 7. ⚡ Quick & Smart Revision Hub */}
      {activeSection === 'revision' && (
        <div className="py-2 animate-in fade-in duration-200">
          <SmartRevisionView
            quickRevision={studyKit.quickRevision}
            smartRevision={studyKit.smartRevision}
            topicTitle={studyKit.title}
          />
        </div>
      )}

      {/* 8. 📊 Progress & Weak Area Detection */}
      {activeSection === 'progress' && (
        <div className="py-2 animate-in fade-in duration-200">
          <ProgressDashboardView
            topics={studyKit.topics || []}
            progress={studentProgress}
            quizQuestions={studyKit.topicQuiz || []}
            onToggleCompleteTopic={handleToggleCompleteTopic}
            onNavigateToTopicHinglish={(name) => setActiveSection('hinglish')}
            onNavigateToQuiz={() => setActiveSection('quiz')}
          />
        </div>
      )}

      {/* 9. 🗺️ Learning Path & Concept Connections */}
      {activeSection === 'roadmap' && (
        <div className="py-2 animate-in fade-in duration-200">
          <LearningPathView
            learningPath={studyKit.learningPath || []}
            conceptConnections={studyKit.conceptConnections || []}
          />
        </div>
      )}

      {/* 10. Markdown Output */}
      {activeSection === 'raw' && (
        <div className="py-2 animate-in fade-in duration-200">
          <RawMarkdownView
            markdown={studyKit.markdownResponse}
            title={studyKit.title}
          />
        </div>
      )}

      {/* 💬 Ask a Doubt Tutor Side Drawer */}
      <TutorChatDrawer
        studyKit={studyKit}
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
      />
    </div>
  );
};
