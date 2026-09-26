import React, { useState, useRef, useEffect } from 'react';
import { StudyKit } from '../types/study-kit';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  HelpCircle, 
  Loader2, 
  Smile,
  Languages
} from 'lucide-react';

interface TutorChatDrawerProps {
  studyKit: StudyKit;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'tutor';
  text: string;
}

export const TutorChatDrawer: React.FC<TutorChatDrawerProps> = ({
  studyKit,
  isOpen,
  onClose,
}) => {
  const [preferHinglish, setPreferHinglish] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'tutor',
      text: `Namaste! Main aapka academic tutor hoon for "${studyKit.title}". Kisi bhi concept mein doubt ho, koi analogy chahiye ho, ya exam questions practice karne ho — bejhijhak poochiye!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userPrompt?: string) => {
    const query = (userPrompt || input).trim();
    if (!query || loading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const context = `Study Kit Title: ${studyKit.title}
Topics Covered:
${studyKit.topics?.map((t) => `• ${t.name} (Difficulty: ${t.difficulty}, Importance: ${t.examImportance}):\n  Notes: ${t.formalNotes?.substring(0, 350)}...\n  Hinglish: ${t.hinglishUnderstanding?.substring(0, 200)}...`).join('\n\n') || ''}

Practice Questions:
MCQ: ${studyKit.practiceQuestions?.mcq?.question} (Correct: ${studyKit.practiceQuestions?.mcq?.correctAnswer})
Short Answer: ${studyKit.practiceQuestions?.shortAnswer?.question}
Conceptual Application: ${studyKit.practiceQuestions?.conceptualApplication?.question}`;

      const res = await fetch('/api/study-kit/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          context,
          studyKitTitle: studyKit.title,
          preferHinglish,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get tutor response');
      }

      setMessages((prev) => [...prev, { role: 'tutor', text: data.answer }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          text: `Kuch technical dikkat aa gayi: ${err.message}. Kripya dobara poochiye!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Ek easy daily-life example se samjhao',
    'Exam mein is topic se kya poochte hain?',
    'MCQ question ka logic explain karo',
    'Explain the Short Answer question key points',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              Academic Tutor (Guru Mode)
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
              {studyKit.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Hinglish / English Toggle */}
          <button
            onClick={() => setPreferHinglish(!preferHinglish)}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition flex items-center gap-1 ${
              preferHinglish
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Toggle Language Style"
          >
            <Languages className="w-3 h-3" />
            <span>{preferHinglish ? 'Hinglish' : 'English'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'tutor' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/80 shadow-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start items-center text-xs text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span className="italic">Tutor is drafting response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="text-[11px] text-slate-400 mb-1.5 font-medium flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-amber-400" />
          Quick Questions:
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60 transition shrink-0"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={preferHinglish ? 'Apna doubt Hinglish ya English mein likhein...' : 'Ask your academic tutor anything...'}
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
