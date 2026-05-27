'use client';

import React, { useState } from 'react';
import { Code, Braces, Download, Copy, Check } from 'lucide-react';

interface OutputTabsProps {
  reconstructedHtml: string | null;
  layoutJson: Record<string, any> | null;
}

export default function OutputTabs({ reconstructedHtml, layoutJson }: OutputTabsProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'json'>('html');
  const [copied, setCopied] = useState(false);

  const rawJsonString = layoutJson ? JSON.stringify(layoutJson, null, 2) : '';

  const handleCopy = async () => {
    const textToCopy = activeTab === 'html' ? reconstructedHtml : rawJsonString;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to write stream copy', err);
    }
  };

  const handleDownload = () => {
    if (!reconstructedHtml) return;
    const blob = new Blob([reconstructedHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'retro_reconstructed_index.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg flex flex-col h-full overflow-hidden">
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs transition-all ${
              activeTab === 'html'
                ? 'bg-slate-800 text-teal-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code size={14} /> RECONSTRUCTED HTML
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs transition-all ${
              activeTab === 'json'
                ? 'bg-slate-800 text-teal-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Braces size={14} /> LAYOUT ANALYTICS JSON
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={activeTab === 'html' ? !reconstructedHtml : !layoutJson}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-300 hover:text-teal-400 hover:border-teal-500 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!reconstructedHtml}
            className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded text-xs transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Download size={13} /> Download Artifact
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 p-4 font-mono text-xs overflow-auto max-h-[350px]">
        {activeTab === 'html' ? (
          reconstructedHtml ? (
            <pre className="text-amber-200/90 whitespace-pre-wrap word-break-all select-text selection:bg-slate-700">
              {reconstructedHtml}
            </pre>
          ) : (
            <div className="text-slate-600 italic text-center py-8">Code tree compilation vector empty.</div>
          )
        ) : (
          rawJsonString ? (
            <pre className="text-sky-300 whitespace-pre-wrap select-text selection:bg-slate-700">
              {rawJsonString}
            </pre>
          ) : (
            <div className="text-slate-600 italic text-center py-8">Layout metadata tree matrix missing.</div>
          )
        )}
      </div>
    </div>
  );
}