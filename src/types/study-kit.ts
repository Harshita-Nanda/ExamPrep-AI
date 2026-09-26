export type DifficultyLevel = 'Easy' | 'Medium' | 'Difficult';
export type ExamImportanceLevel = 'Very Important' | 'Important' | 'Supporting Concept';

export interface KeywordItem {
  term: string;
  definition: string;
  hinglish: string;
}

export interface DiagramExplanation {
  title: string;
  asciiDiagram: string;
  components: Array<{
    name: string;
    description: string;
  }>;
}

export interface ExamAnswersByMarks {
  marks2: string; // 2 Marks: Definition + 1-2 key points
  marks5: string; // 5 Marks: Definition, explanation, key points, example/diagram, short conclusion
  marks10: string; // 10 Marks: Intro, detailed breakdown, subtopics, examples, flow/diagram, conclusion
}

export interface StructuredTopic {
  id: string;
  name: string;
  subtopics: string[];
  difficulty: DifficultyLevel;
  examImportance: ExamImportanceLevel;
  formalNotes: string; // Structured notes with headings, bullet points, and tags (⭐, 🔥, 📌, 🧮, 💡, ⚠️)
  hinglishUnderstanding: string; // Friendly teacher Hindi+English, step-by-step, WHY & HOW, analogies
  beginnerExplanation: string; // Explain Like I'm a Beginner
  keywords: KeywordItem[];
  diagramExplanation?: DiagramExplanation;
  examAnswers: ExamAnswersByMarks;
}

export interface LearningPathStep {
  stepNumber: number;
  topic: string;
  phase: string; // e.g. "Basics", "Core Concept", "Working", "Application", "Advanced", "Revision"
  prerequisites?: string[];
  description: string;
}

export interface ConceptConnection {
  from: string;
  to: string;
  relationship: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  explanation: string;
}

export interface ShortAnswerQuestion {
  question: string;
  sampleHighScoringAnswer: string;
  keyGradingPoints?: string[];
}

export interface ConceptualApplicationQuestion {
  question: string;
  scenario?: string;
  sampleAnswer: string;
}

export interface PracticeQuestions {
  mcq: MCQQuestion;
  shortAnswer: ShortAnswerQuestion;
  conceptualApplication: ConceptualApplicationQuestion;
}

export interface QuizQuestion {
  id: string;
  topicName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptRemediation: string; // Explanation of why this concept matters and how to think about it correctly
}

export interface Flashcard {
  term: string;
  back: string;
}

export interface QuickRevision {
  keyPoints: string[];
  definitions: string[];
  formulasOrRules: string[];
  keyTerms: string[];
  commonMistakes: string[];
}

export interface SmartRevisionModes {
  fiveMinuteRevision: {
    title: string;
    mustRememberPoints: string[];
    definitions: string[];
    formulas: string[];
  };
  examRevision: {
    title: string;
    highYieldConcepts: string[];
    expectedQuestions: string[];
    formulasAndDefinitions: string[];
    criticalPitfalls: string[];
  };
  lastMinuteRevision: {
    title: string;
    ultraSummaryBullets: string[];
  };
}

export interface StudyKit {
  id: string;
  title: string;
  createdAt: string;
  sourceSummary?: string;
  markdownResponse: string;
  // All 22 comprehensive sections
  topics: StructuredTopic[];
  learningPath: LearningPathStep[];
  conceptConnections: ConceptConnection[];
  practiceQuestions: PracticeQuestions;
  topicQuiz: QuizQuestion[];
  flashcards: Flashcard[];
  quickRevision: QuickRevision;
  smartRevision: SmartRevisionModes;
}

export interface StudentProgress {
  completedTopicIds: string[];
  quizAttempts: Record<string, { selectedIndex: number; isCorrect: boolean; timestamp: number }>;
  flaggedWeakTopicNames: string[];
  notesReadStatus: Record<string, boolean>;
  flashcardsMastered: number;
}
