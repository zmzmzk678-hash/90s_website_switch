'use client';

import React, { useState } from 'react';
import { Globe, ShieldAlert, Cpu } from 'lucide-react';

interface ControlPanelProps {
  onStart: (url: string, style: string) => void;
  isLoading: boolean;
}

export default function ControlPanel({ onStart, isLoading }: ControlPanelProps) {
  const [url, setUrl] = useState('');
  const [style, setStyle] = useState('GeoCities');

  const stylesList = [
    { id: 'GeoCities', name: 'GeoCities (1995 Space Style)' },
    { id: 'Win98', name: 'Windows 98 Desktop App Layout' },
    { id: 'CRT', name: 'CRT Green Terminal Grid' },
    { id: 'Vaporwave', name: 'Vaporwave aesthetics (Glitch Neon)' },
    { id: '90s Internet', name: 'Classic 90s HTML Internet Table' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onStart(url, style);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg flex flex-col gap-5 h-full">
      <div>
        <h2 className="text-lg font-bold text-teal-400 flex items-center gap-2">
          <Cpu size={20} /> ENGINE CONTROL
        </h2>
        <p className="text-xs text-slate-400 mt-1">Specify layout target definitions below.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Globe size={14} className="text-slate-400" /> Target Website URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={isLoading}
            required
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">
            Retro Aesthetics Rendering Theme
          </label>
          <div className="flex flex-col gap-1.5">
            {stylesList.map((item) => (
              <label
                key={item.id}
                className={`flex items-center gap-3 p-2.5 rounded border cursor-pointer text-xs transition-all select-none ${
                  style === item.id
                    ? 'bg-teal-950/40 border-teal-500 text-teal-300 font-bold'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="retroStyle"
                  value={item.id}
                  checked={style === item.id}
                  onChange={() => setStyle(item.id)}
                  disabled={isLoading}
                  className="accent-teal-500 cursor-pointer h-3.5 w-3.5"
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !url}
          className={`w-full mt-auto py-3 px-4 rounded font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
            isLoading || !url
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 hover:from-teal-400 hover:to-emerald-500 active:scale-[0.99] shadow-lg shadow-teal-500/10'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              CONVERTING ENGINE PIPELINE...
            </>
          ) : (
            'RECONSTRUCT TO 90s'
          )}
        </button>
      </form>

      <div className="border-t border-slate-700/60 pt-3 flex items-start gap-2 text-[10px] text-slate-400">
        <ShieldAlert size={14} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-300 block">Security Isolation Sandbox Enabled:</span>
          XSS filters, script deletions, and sandbox parameters are enforced dynamically.
        </div>
      </div>
    </div>
  );
}