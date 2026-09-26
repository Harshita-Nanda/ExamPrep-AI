import React, { useState } from 'react';
import { Copy, Check, Download, Printer, Code2, FileText } from 'lucide-react';

interface RawMarkdownViewProps {
  markdown: string;
  title: string;
}

export const RawMarkdownView: React.FC<RawMarkdownViewProps> = ({ markdown, title }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-study-kit.md`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Format View:</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('formatted')}
              className={`px-3 py-1 rounded text-xs font-medium transition flex items-center gap-1.5 ${
                viewMode === 'formatted'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Formatted Layout
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 rounded text-xs font-medium transition flex items-center gap-1.5 ${
                viewMode === 'raw'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Raw Markdown
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 flex items-center gap-1.5"
            title="Copy Markdown to Clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Study Kit</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 flex items-center gap-1.5"
            title="Download .md File"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .md</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 hidden sm:flex items-center gap-1.5"
            title="Print / Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Content Display */}
      {viewMode === 'raw' ? (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto">
          <pre className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-indigo-600/30">
            {markdown}
          </pre>
        </div>
      ) : (
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 text-slate-200">
          <div className="prose prose-invert max-w-none prose-headings:text-slate-100 prose-h3:text-lg prose-h3:font-bold prose-h3:border-b prose-h3:border-slate-800 prose-h3:pb-2 prose-h3:text-indigo-300 prose-p:text-slate-300 prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
            {/* Render with structured sections */}
            <div className="space-y-6 whitespace-pre-line text-sm sm:text-base leading-relaxed">
              {markdown}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
