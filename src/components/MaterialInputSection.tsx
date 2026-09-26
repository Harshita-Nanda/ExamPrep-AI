import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  Trash2, 
  X, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { SAMPLE_MATERIALS, SampleMaterial } from '../data/sampleMaterials';

interface MaterialInputSectionProps {
  onGenerate: (data: {
    text?: string;
    imageBase64?: string;
    imageMimeType?: string;
    customInstructions?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const MaterialInputSection: React.FC<MaterialInputSectionProps> = ({
  onGenerate,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
  } | null>(null);
  const [examLevel, setExamLevel] = useState('Undergraduate / College');
  const [inputError, setInputError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  // Cycling loading phrases for feedback
  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStatus(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStatus((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const loadingMessages = [
    'Parsing and structuring study material...',
    'Creating academic Notes & Hinglish Understanding...',
    'Extracting Key Concepts & Drafting 3 Practice Exam Questions...',
    'Compiling Flashcard Set & Quick Revision cheat-sheet...',
  ];

  // Handle image upload
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setInputError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setInputError('Image size should be less than 20MB.');
      return;
    }

    setInputError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage({ file, previewUrl, base64 });
    };
    reader.readAsDataURL(file);
  };

  // Handle text document (.txt, .md) upload
  const handleTextDocumentFile = (file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      setInputError('Please upload a .txt or .md text file, or use the image upload for photos.');
      return;
    }
    setInputError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setTextInput(content);
      setActiveTab('text');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setActiveTab('image');
        handleImageFile(file);
      } else {
        handleTextDocumentFile(file);
      }
    }
  };

  const handleLoadSample = (sample: SampleMaterial) => {
    setTextInput(sample.text);
    setActiveTab('text');
    setSelectedImage(null);
    setInputError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const hasText = textInput.trim().length > 0;
    const hasImage = !!selectedImage;

    if (!hasText && !hasImage) {
      setInputError('Please enter lecture/study notes or upload a document photo.');
      return;
    }

    try {
      await onGenerate({
        text: textInput.trim() || undefined,
        imageBase64: selectedImage?.base64,
        imageMimeType: selectedImage?.file.type,
        customInstructions: `Target Academic Level: ${examLevel}`,
      });
    } catch (err: any) {
      setInputError(err.message || 'Error parsing material.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
      {/* Title & Description */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <GraduationCap className="w-4 h-4" />
          Academic Tutor & Exam Prep Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Transform Raw Notes into an Actionable Study Kit
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          Upload textbook pages, handwritten notes, lecture slides, or paste raw study material to generate key concepts, exam-ready questions, and flashcards.
        </p>
      </div>

      {/* Quick Sample Presets */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2.5">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            Quick Test Samples (1-Click Fill):
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_MATERIALS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {sample.category}
                </span>
                <h4 className="text-xs font-semibold text-slate-200 mt-0.5 group-hover:text-indigo-300 transition">
                  {sample.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                {sample.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Mode Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'text'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              Study Notes / Text
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'image'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Document / Photo Upload
              {selectedImage && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>
          </div>

          {/* Academic Level Selector */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Level:</span>
            <select
              value={examLevel}
              onChange={(e) => setExamLevel(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Undergraduate / College">Undergraduate Finals</option>
              <option value="AP / High School Advanced">AP / High School</option>
              <option value="Graduate / Professional">Graduate / Professional</option>
              <option value="Fundamental / General Exam">Fundamental Overview</option>
            </select>
          </div>
        </div>

        {/* Tab 1: Text Notes Input */}
        {activeTab === 'text' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Paste lecture transcripts, textbook chapters, or summary notes:</span>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={docFileInputRef}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleTextDocumentFile(e.target.files[0]);
                  }}
                  accept=".txt,.md"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => docFileInputRef.current?.click()}
                  className="text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Import .txt / .md
                </button>
                {textInput && (
                  <button
                    type="button"
                    onClick={() => setTextInput('')}
                    className="text-slate-400 hover:text-rose-400 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste raw academic study materials here (e.g. Chapter 4: Photosynthesis, Keynesian economic models, Operating System Virtual Memory)..."
              rows={8}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition leading-relaxed resize-y font-normal"
            />
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>
                {textInput.length} characters • {textInput.trim() ? textInput.trim().split(/\s+/).length : 0} words
              </span>
              <span>Rich parsing enabled (multimodal backend)</span>
            </div>
          </div>
        )}

        {/* Tab 2: Document / Image Upload */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) handleImageFile(e.target.files[0]);
              }}
              accept="image/*"
              className="hidden"
            />

            {!selectedImage ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500/80 rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition bg-slate-950/40 hover:bg-slate-950/60 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-base font-semibold text-slate-200 mb-1">
                  Upload Document Image or Handwritten Notes
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-4">
                  Drag and drop a photo of your textbook, lecture slide, exam sheet, or handwritten notebook page.
                </p>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
                  Browse Device Photos
                </span>
                <div className="mt-4 text-[11px] text-slate-400">
                  Supports PNG, JPG, JPEG, WEBP up to 20MB
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-48 h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                  <img
                    src={selectedImage.previewUrl}
                    alt="Document preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-900 text-slate-300 hover:text-white transition"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Document Image Loaded
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Change Photo
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {selectedImage.file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(selectedImage.file.size / (1024 * 1024)).toFixed(2)} MB • Ready for backend visual document OCR & tutoring analysis
                  </p>
                  <div className="pt-1">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Optional notes or questions regarding this image..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {inputError && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{inputError}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Generates Notes, Hinglish Guru Understanding, Key Concepts, Exam Questions, Flashcards & Quick Revision
          </div>

          <button
            type="submit"
            disabled={isLoading || (!textInput.trim() && !selectedImage)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{loadingMessages[loadingStatus]}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Generate Structured Study Kit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
