'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal, Activity } from 'lucide-react';
import { AgentLog } from '../types';

interface AgentStatusProps {
  logs: AgentLog[];
  currentAgent: string;
}

export default function AgentStatus({ logs, currentAgent }: AgentStatusProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col h-full font-mono text-xs shadow-inner">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2 text-teal-400 font-bold tracking-wide">
          <Terminal size={16} /> DEEPSEEK AGENT COORDINATOR
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentAgent !== 'Idle' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${currentAgent !== 'Idle' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="text-[10px] uppercase text-slate-300 tracking-wider">
            State: <span className="text-teal-400 font-bold">{currentAgent}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[360px] lg:max-h-none">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic flex items-center gap-2 justify-center h-full py-12">
            <Activity size={14} className="animate-pulse" /> Orchestrator engine listening for layout dispatch...
          </div>
        ) : (
          logs.map((log) => {
            const statusColors = {
              info: 'text-slate-400',
              success: 'text-emerald-400 font-semibold',
              warning: 'text-amber-400',
              error: 'text-rose-400 font-bold bg-rose-950/20 px-1 rounded'
            };

            const agentColors = {
              System: 'text-blue-400',
              PuppeteerScraper: 'text-purple-400',
              DeepSeekReasoner: 'text-indigo-400 font-bold',
              DeepSeekChat: 'text-pink-400 font-bold'
            };

            return (
              <div key={log.id} className="leading-relaxed border-b border-slate-900/40 pb-1.5 last:border-0">
                <span className="text-slate-600 select-none mr-2">[{log.timestamp}]</span>
                <span className={`text-[11px] font-bold mr-2 ${agentColors[log.agent]}`}>
                  {log.agent}:
                </span>
                <span className={statusColors[log.status]}>{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}