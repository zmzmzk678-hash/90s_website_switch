'use client';

import React, { useState } from 'react';
import { Monitor, Image as ImageIcon, Eye } from 'lucide-react';

interface LivePreviewProps {
  reconstructedHtml: string | null;
  screenshot: string | null;
}

export default function LivePreview({ reconstructedHtml, screenshot }: LivePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'screenshot'>('preview');

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg flex flex-col h-full overflow-hidden shadow-2xl">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Monitor size={14} className="text-teal-400" /> OUTPUT PREVIEW ENVIRONMENT
        </div>
        <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold tracking-wide transition-all uppercase ${
              activeTab === 'preview'
                ? 'bg-slate-800 text-teal-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye size={12} /> Retro Canvas
          </button>
          <button
            onClick={() => setActiveTab('screenshot')}
            disabled={!screenshot}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold tracking-wide transition-all uppercase disabled:opacity-40 disabled:pointer-events-none ${
              activeTab === 'screenshot'
                ? 'bg-slate-800 text-teal-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon size={12} /> Base Screenshot
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 relative min-h-[400px]">
        {activeTab === 'preview' ? (
          reconstructedHtml ? (
            <div className="w-full h-full crt-scanlines relative bg-white">
              <iframe
                title="Retro Code Space Execution Preview"
                srcDoc={reconstructedHtml}
                sandbox="allow-same-origin allow-popups"
                className="w-full h-full border-0 absolute top-0 left-0 bg-white"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs text-center p-6">
              <Monitor size={36} className="text-slate-700 stroke-[1.5]" />
              <div>
                <p className="font-bold text-slate-400">Sandbox Preview Engine Idle</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Initialize a pipeline compilation step to generate canvas viewports.</p>
              </div>
            </div>
          )
        ) : (
          screenshot && (
            <div className="w-full h-full overflow-auto p-2 flex items-start justify-center bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshot}
                alt="Source Page Extraction View"
                className="max-w-full height-auto border border-slate-800 rounded shadow-md"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}