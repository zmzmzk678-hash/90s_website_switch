"use client";

import { useState, useEffect } from 'react';

type Result = {
  reconstructedHtml?: string;
  screenshot?: string;
  imageMap?: Record<string, string>;
  error?: string;
  url?: string;
  success?: boolean;
};

const STEPS = [
  '🌐 Puppeteer 抓取页面...',
  '🖼️ 复古化图片处理...',
  '🤖 AI 分析布局结构...',
  '✍️ 生成复古 HTML...',
  '✅ 完成！',
];

const STYLE_OPTIONS = [
  { value: '90s Internet', label: 'NASA 1997 Style' },
  { value: 'Win98', label: 'Windows 98 Desktop' },
  { value: 'GeoCities', label: 'GeoCities Cyber' },
  { value: 'Vaporwave', label: 'Vaporwave Neon' },
];

export default function RetroAdminHomepage() {
  const [urls, setUrls] = useState('');
  const [styleType, setStyleType] = useState('GeoCities');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [history, setHistory] = useState<Result[]>([]);

  // 进度模拟
  useEffect(() => {
    if (!loading) return;
    setStep(0);
    const intervals = [2000, 4000, 8000, 14000];
    const timers = intervals.map((ms, i) =>
      setTimeout(() => setStep(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const handleTransform = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlList = urls.split('\n').map(u => u.trim()).filter(Boolean);
    if (!urlList.length) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlList, style: styleType }),
      });

      if (!response.ok) throw new Error(`System Error: ${response.status}`);

      const data = await response.json();
      const newResults: Result[] = data.results || [data];
      setResults(newResults);
      setActiveIdx(0);
      setStep(4);

      // 保存到历史
      setHistory(prev => [...newResults.filter(r => r.success), ...prev].slice(0, 10));
    } catch (err: any) {
      setError(err.message || 'Failed to align temporal web matrix.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportZip = async () => {
    const urlList = urls.split('\n').map(u => u.trim()).filter(Boolean);
    if (!urlList.length) return;

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: urlList, style: styleType, exportZip: true }),
    });

    if (!response.ok) { setError('ZIP export failed'); return; }
    const blob = await response.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'retro_pages.zip';
    a.click();
  };

  const downloadHtml = (html: string, filename = 'retro_page.html') => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  const isDark = theme === 'dark';
  const bg = isDark ? '#0a0a0a' : '#c0c0c0';
  const panelBg = isDark ? '#111' : '#dcdcdc';
  const text = isDark ? '#00ff41' : '#000';
  const border = isDark ? '#00ff41' : '#808080';
  const headerBg = isDark ? '#001a00' : '#000080';
  const headerText = isDark ? '#00ff41' : '#ffffff';

  const activeResult = results[activeIdx];

  return (
    <div style={{
      backgroundColor: bg,
      color: text,
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      minHeight: '100vh',
      padding: '12px',
      transition: 'all 0.3s',
    }}>
      {/* CRT scanline overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', zIndex: 9999,
        background: isDark
          ? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)'
          : 'none',
      }} />

      {/* Header */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <table width="100%" style={{ borderCollapse: 'collapse', marginBottom: '8px' }}>
          <tbody>
            <tr style={{ backgroundColor: headerBg }}>
              <td style={{ padding: '6px 10px', color: headerText, fontWeight: 'bold', fontSize: '11px' }}>
                <span style={{ marginRight: '16px' }}>🏠 RETRO-WEB AI SYSTEM v2.0</span>
                <span style={{ marginRight: '16px', cursor: 'pointer' }} onClick={() => window.scrollTo(0,0)}>⚡ Console</span>
                <span style={{ color: '#00ff41' }}>● ONLINE</span>
              </td>
              <td style={{ padding: '6px 10px', textAlign: 'right' }}>
                <button
                  onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                  style={{ background: 'none', border: `1px solid ${border}`, color: text, cursor: 'pointer', padding: '2px 8px', fontSize: '11px' }}
                >
                  {isDark ? '☀️ Light' : '🌙 Dark'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Title */}
        <div style={{ textAlign: 'center', padding: '16px 0', borderBottom: `1px solid ${border}` }}>
          <div style={{
            fontSize: isDark ? '22px' : '20px',
            fontWeight: 'bold',
            letterSpacing: '3px',
            color: isDark ? '#00ff41' : '#000080',
            textShadow: isDark ? '0 0 10px #00ff41' : 'none',
          }}>
            ◈ NATIONAL RETRO-WEB & AI ADMINISTRATION ◈
          </div>
          <div style={{ fontSize: '11px', color: isDark ? '#888' : '#555', marginTop: '4px' }}>
            AI-Powered Temporal Web-Mapping System // Project 1997 // v2.0
          </div>
        </div>

        {/* Main form */}
        <div style={{ marginTop: '16px', border: `1px solid ${border}`, backgroundColor: panelBg }}>
          <div style={{ backgroundColor: headerBg, padding: '6px 10px', color: headerText, fontSize: '12px', fontWeight: 'bold' }}>
            📡 TEMPORAL ALIGNMENT ENGINE — INPUT TERMINAL
          </div>
          <div style={{ padding: '16px' }}>
            <form onSubmit={handleTransform}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                  TARGET URL(S) — 每行一个，支持批量处理：
                </label>
                <textarea
                  value={urls}
                  onChange={e => setUrls(e.target.value)}
                  placeholder={'https://example.com\nhttps://another-site.com'}
                  rows={3}
                  style={{
                    width: '100%', padding: '6px', fontFamily: 'monospace', fontSize: '13px',
                    backgroundColor: isDark ? '#000' : '#fff',
                    color: isDark ? '#00ff41' : '#000',
                    border: `1px inset ${border}`,
                    boxSizing: 'border-box', resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '12px', marginRight: '8px' }}>TIMELINE STYLE:</label>
                  <select
                    value={styleType}
                    onChange={e => setStyleType(e.target.value)}
                    style={{
                      padding: '4px 8px', fontFamily: 'monospace',
                      backgroundColor: isDark ? '#000' : '#fff',
                      color: isDark ? '#00ff41' : '#000',
                      border: `1px solid ${border}`,
                    }}
                  >
                    {STYLE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '6px 20px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold',
                      backgroundColor: isDark ? '#001a00' : '#c0c0c0',
                      color: isDark ? '#00ff41' : '#000',
                      border: `2px outset ${border}`,
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? '⚡ PROCESSING...' : '🚀 INITIATE TRANSFORM'}
                  </button>
                  <button
                    type="button"
                    onClick={handleExportZip}
                    disabled={loading}
                    style={{
                      padding: '6px 16px', cursor: 'pointer', fontFamily: 'monospace',
                      backgroundColor: isDark ? '#001a00' : '#c0c0c0',
                      color: isDark ? '#00ff41' : '#000',
                      border: `2px outset ${border}`,
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    📦 EXPORT ZIP
                  </button>
                </div>
              </div>
            </form>

            {/* Progress */}
            {loading && (
              <div style={{ marginTop: '12px', padding: '10px', border: `1px solid ${border}`, backgroundColor: isDark ? '#000' : '#eee' }}>
                <div style={{ fontSize: '11px', marginBottom: '8px', color: isDark ? '#888' : '#555' }}>
                  PIPELINE STATUS:
                </div>
                {STEPS.map((s, i) => (
                  <div key={i} style={{
                    padding: '3px 0', fontSize: '12px',
                    color: i < step ? (isDark ? '#00ff41' : '#008000') : i === step ? text : (isDark ? '#333' : '#aaa'),
                  }}>
                    {i < step ? '✓' : i === step ? '▶' : '○'} {s}
                    {i === step && loading && <span style={{ animation: 'blink 1s infinite' }}> ████████░░</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Skeleton */}
            {loading && (
              <div style={{ marginTop: '12px', height: '200px', backgroundColor: isDark ? '#0a0a0a' : '#ddd', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: isDark ? '#333' : '#999', fontSize: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📺</div>
                  AWAITING SIGNAL...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginTop: '12px', padding: '10px', border: '1px solid #ff0000', backgroundColor: isDark ? '#1a0000' : '#ffe0e0', color: '#ff4444' }}>
            ❌ ERROR: {error}
          </div>
        )}

        {/* Results tabs (batch) */}
        {results.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            {results.length > 1 && (
              <div style={{ display: 'flex', gap: '4px', marginBottom: '0', flexWrap: 'wrap' }}>
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    style={{
                      padding: '4px 12px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px',
                      backgroundColor: activeIdx === i ? headerBg : panelBg,
                      color: activeIdx === i ? headerText : text,
                      border: `1px solid ${border}`,
                      borderBottom: activeIdx === i ? 'none' : `1px solid ${border}`,
                    }}
                  >
                    {r.success ? '✓' : '✗'} {r.url ? new URL(r.url).hostname : `URL ${i + 1}`}
                  </button>
                ))}
              </div>
            )}

            {activeResult && (
              <div style={{ border: `1px solid ${border}`, backgroundColor: panelBg }}>
                <div style={{ backgroundColor: headerBg, padding: '6px 10px', color: headerText, fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📺 LIVE RETRO SIGNAL MONITOR</span>
                  {activeResult.reconstructedHtml && (
                    <button
                      onClick={() => downloadHtml(activeResult.reconstructedHtml!, `retro_${activeIdx}.html`)}
                      style={{
                        padding: '2px 10px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px',
                        backgroundColor: isDark ? '#001a00' : '#c0c0c0',
                        color: isDark ? '#00ff41' : '#000',
                        border: `1px outset ${border}`,
                      }}
                    >
                      💾 DOWNLOAD HTML
                    </button>
                  )}
                </div>
                <div style={{ padding: '12px' }}>
                  {activeResult.error ? (
                    <div style={{ color: '#ff4444' }}>❌ {activeResult.error}</div>
                  ) : (
                    <div style={{ border: `3px inset ${border}`, width: '100%', height: '600px' }}>
                      <iframe
                        title="Retro Signal Monitor"
                        srcDoc={activeResult.reconstructedHtml}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div style={{ marginTop: '16px', border: `1px solid ${border}`, backgroundColor: panelBg }}>
            <div style={{ backgroundColor: headerBg, padding: '6px 10px', color: headerText, fontSize: '12px', fontWeight: 'bold' }}>
              📂 HISTORY LOG — 最近生成记录
            </div>
            <div style={{ padding: '8px' }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: `1px solid ${isDark ? '#222' : '#ccc'}`, fontSize: '12px' }}>
                  <span style={{ color: isDark ? '#888' : '#555' }}>{h.url || `记录 ${i + 1}`}</span>
                  <button
                    onClick={() => h.reconstructedHtml && downloadHtml(h.reconstructedHtml, `retro_history_${i}.html`)}
                    style={{
                      padding: '2px 8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px',
                      backgroundColor: isDark ? '#001a00' : '#c0c0c0',
                      color: isDark ? '#00ff41' : '#000',
                      border: `1px outset ${border}`,
                    }}
                  >
                    💾 下载
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: isDark ? '#333' : '#888' }}>
          ◈ RETRO-WEB AI SYSTEM v2.0 // POWERED BY DEEPSEEK // PROJECT 1997 ◈
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing: border-box; }
        textarea, select, button { outline: none; }
        @media (max-width: 600px) {
          div[style*="display: flex"] { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
