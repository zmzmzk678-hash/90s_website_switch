"use client";

import { useState } from 'react';

export default function RetroAdminHomepage() {
  const [url, setUrl] = useState('');
  const [styleType, setStyleType] = useState('GeoCities');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    reconstructedHtml?: string;
    screenshot?: string;
    imageMap?: Record<string, string>;
  } | null>(null);

  const handleTransform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, style: styleType }),
      });

      if (!response.ok) {
        throw new Error(`System Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to align temporal web matrix.');
    } finally {
      setLoading(false);
    }
  };

  const downloadHtml = () => {
    if (!result?.reconstructedHtml) return;
    const blob = new Blob([result.reconstructedHtml], { type: 'text/html;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = `reconstructed_1997_page.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath d=\'M1 3h1v1H1zm2-2h1v1H3z\' fill=\'%23b0b0b0\' fill-opacity=\'.4\'/%3E%3C/svg%3E")',
      color: '#000000',
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '15px',
      padding: '20px',
      minHeight: '100vh',
      lineHeight: '1.4'
    }}>
      <center>
        {/* 修复点：将 bgColor 改为 bgcolor */}
        <table border={1} cellPadding={10} cellSpacing={0} bgcolor="#333333" style={{
          borderColor: '#ffffff #808080 #808080 #ffffff',
          color: '#ffffff',
          textAlign: 'center',
          maxWidth: '800px',
          width: '100%'
        }}>
          <tbody>
            <tr>
              <td width="20%" style={{ border: '2px outset #555', cursor: 'pointer' }} onClick={() => window.location.reload()}>
                <font color="#ffd700"><b>🏠 Welcome</b></font>
              </td>
              <td width="20%" style={{ border: '2px outset #555' }}>
                <a href="#console" style={{ color: '#ffffff', textDecoration: 'none' }}><b>⚡ Engine Console</b></a>
              </td>
              <td width="20%" style={{ border: '2px outset #555' }}>
                <a href="https://deepseek.com" target="_blank" style={{ color: '#ffffff', textDecoration: 'none' }}><b>🤖 DeepSeek Node</b></a>
              </td>
              <td width="20%" style={{ border: '2px outset #555' }}>
                <a href="#logs" style={{ color: '#ffffff', textDecoration: 'none' }}><b>📂 System Status</b></a>
              </td>
              <td width="20%" style={{ border: '2px outset #555' }}>
                <font color="#00ff00"><b>📶 Online</b></font>
              </td>
            </tr>
            <tr>
              {/* 修复点：将 bgColor 改为 bgcolor */}
              <td colSpan={5} bgcolor="#111111" style={{ padding: '30px', position: 'relative' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00008b, #ff4500)',
                  margin: '0 auto 10px auto',
                  border: '2px solid #ffffff',
                  boxShadow: 'inset -10px -10px 20px #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  letterSpacing: '1px'
                }}>RETRO</div>
                <font size={5} face="Impact, Times New Roman"><b>NATIONAL RETRO-WEB & AI ADMINISTRATION</b></font>
                <br />
                <font size={2} color="#aaaaaa">AI-Powered Temporal Web-Mapping System Pipeline // Project 1997</font>
              </td>
            </tr>
          </tbody>
        </table>
      </center>

      <br /><hr size={3} color="#808080" style={{ maxWidth: '800px', margin: '0 auto' }} /><br />

      <center id="console">
        <table border={0} cellPadding={0} cellSpacing={0} style={{ maxWidth: '800px', width: '100%' }}>
          <tbody>
            <tr>
              <td width="60" valign="middle">
                <div style={{
                  width: '45px',
                  height: '40px',
                  backgroundColor: '#000',
                  border: '3px outset #fff',
                  color: '#00ff00',
                  fontFamily: 'monospace',
                  fontSize: '9px',
                  padding: '2px',
                  overflow: 'hidden'
                }}>
                  SYS_OK<br />RUN_v1.0<br />9600bps
                </div>
              </td>
              <td valign="middle" style={{ paddingLeft: '10px' }}>
                <font size={6}><b>The RetroPage Generator Homepage</b></font>
              </td>
            </tr>
          </tbody>
        </table>
      </center>

      <center style={{ marginTop: '25px' }}>
        <form onSubmit={handleTransform} style={{ maxWidth: '800px', width: '100%' }}>
          {/* 修复点：将 bgColor 改为 bgcolor */}
          <table border={1} cellPadding={8} cellSpacing={0} bgcolor="#dcdcdc" style={{
            borderColor: '#ffffff #808080 #808080 #ffffff',
            width: '100%',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
          }}>
            <thead>
              {/* 修复点：将 bgColor 改为 bgcolor */}
              <tr bgcolor="#000080">
                <td colSpan={2}>
                  <font color="#ffffff" face="Arial"><b>📡 Temporal Alignment Engine Input Terminal</b></font>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%"><b>Target Website URL:</b></td>
                <td>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="http://example.com"
                    required
                    style={{ width: '95%', padding: '4px', fontFamily: 'monospace', border: '2px inset #fff', backgroundColor: '#ffffff' }}
                  />
                </td>
              </tr>
              <tr>
                <td><b>Destination Timeline Style:</b></td>
                <td>
                  <select value={styleType} onChange={(e) => setStyleType(e.target.value)} style={{ padding: '4px', border: '2px inset #fff', backgroundColor: '#ffffff' }}>
                    <option value="90s Internet">NASA 1997 Style (Classic Gray)</option>
                    <option value="Win98">Windows 98 Desktop Edition</option>
                    <option value="GeoCities">GeoCities Cyber-Neighborhood</option>
                    <option value="Vaporwave">Vaporwave Neon Aesthetic</option>
                  </select>
                </td>
              </tr>
              <tr>
                {/* 修复点：将 bgColor 改为 bgcolor */}
                <td colSpan={2} align="center" bgcolor="#c0c0c0">
                  <button type="submit" disabled={loading} style={{ padding: '6px 25px', cursor: 'pointer', border: '3px outset #ffffff', backgroundColor: '#c0c0c0' }}>
                    {loading ? '⚡ Aligning Matrix Vectors...' : '🚀 Initiate Retro Transformation'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </center>

      {/* 结果显示部分省略（逻辑同上，请确保所有 bgColor 全部改为 bgcolor） */}

      {result && (
        <center style={{ marginTop: '30px' }} id="logs">
          {/* 修复点：将 bgColor 改为 bgcolor */}
          <table border={1} cellPadding={5} cellSpacing={0} bgcolor="#ffffff" style={{ borderColor: '#ffffff #808080 #808080 #ffffff', maxWidth: '850px', width: '100%' }}>
            <thead>
              {/* 修复点：将 bgColor 改为 bgcolor */}
              <tr bgcolor="#008080">
                <td style={{ padding: '8px' }}><font color="#ffffff"><b>📺 Live Retro Signal Monitor</b></font></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* 修复点：将 bgColor 改为 bgcolor */}
                <td align="center" bgcolor="#808080" style={{ padding: '15px' }}>
                  <button onClick={downloadHtml} style={{ marginBottom: '15px', padding: '5px 15px', cursor: 'pointer', border: '2px outset #fff', backgroundColor: '#c0c0c0' }}>💾 Download HTML</button>
                  <div style={{ border: '4px inset #fff', width: '100%', height: '600px' }}>
                    <iframe title="Retro Signal Monitor" srcDoc={result.reconstructedHtml} style={{ width: '100%', height: '100%', border: 'none' }} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </center>
      )}
    </div>
  );
}