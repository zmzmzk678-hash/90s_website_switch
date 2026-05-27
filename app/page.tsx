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
      {/* 1. 顶部经典 NASA 拟真 3D 仪表盘控制网格 */}
      <center>
        <table border={1} cellPadding={10} cellSpacing={0} bgColor="#333333" style={{
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
              <td colSpan={5} bgColor="#111111" style={{ padding: '30px', position: 'relative' }}>
                {/* 模拟中央庞大的复古微缩圆形行星标志 */}
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

      <br />
      <hr size={3} color="#808080" style={{ maxWidth: '800px', margin: '0 auto' }} />
      <br />

      {/* 2. 主标题区（带像素化小徽章感） */}
      <center id="console">
        <table border={0} cellPadding={0} cellSpacing={0} style={{ maxWidth: '800px', width: '100%' }}>
          <tbody>
            <tr>
              <td width="60" valign="middle">
                {/* 模拟 NASA 经典的小电脑动画图标 */}
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

      {/* 3. 核心交互表单：塞入 Web 1.0 的经典 Table 框中 */}
      <center style={{ marginTop: '25px' }}>
        <form onSubmit={handleTransform} style={{ maxWidth: '800px', width: '100%' }}>
          <table border={1} cellPadding={8} cellSpacing={0} bgColor="#dcdcdc" style={{
            borderColor: '#ffffff #808080 #808080 #ffffff',
            width: '100%',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
          }}>
            <thead>
              <tr bgColor="#000080">
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
                    style={{
                      width: '95%',
                      padding: '4px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      border: '2px inset #fff',
                      backgroundColor: '#ffffff',
                      color: '#000000'
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td><b>Destination Timeline Style:</b></td>
                <td>
                  <select 
                    value={styleType}
                    onChange={(e) => setStyleType(e.target.value)}
                    style={{
                      padding: '4px',
                      fontSize: '14px',
                      border: '2px inset #fff',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="90s Internet">NASA 1997 Style (Classic Gray)</option>
                    <option value="Win98">Windows 98 Desktop Edition</option>
                    <option value="GeoCities">GeoCities Cyber-Neighborhood</option>
                    <option value="Vaporwave">Vaporwave Neon Aesthetic</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colSpan={2} align="center" bgColor="#c0c0c0">
                  <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                      padding: '6px 25px',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      border: '3px outset #ffffff',
                      backgroundColor: '#c0c0c0',
                      color: '#000000'
                    }}
                  >
                    {loading ? '⚡ Aligning Matrix Vectors...' : '🚀 Initiate Retro Transformation'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </center>

      {/* 4. 无序列表说明板块：高还原 NASA 主页的超链接架构 */}
      <center style={{ marginTop: '30px' }}>
        <table border={0} cellPadding={0} cellSpacing={0} style={{ maxWidth: '800px', width: '100%' }}>
          <tbody>
            <tr>
              <td>
                <ul>
                  <li style={{ marginBottom: '10px' }}>
                    <a href="#console" style={{ color: '#0000ee', fontWeight: 'bold' }}>Engine Console</a> - This is the primary portal for injecting modern Web DOM nodes into our high-fidelity pixelated downscaling pipelines.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <a href="https://github.com" target="_blank" style={{ color: '#0000ee', fontWeight: 'bold' }}>Project Architecture Open-Source Repository</a> - Read the latest security warnings regarding modern CORS bypasses and Puppeteer layout tree synchronization modules.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <a href="#logs" style={{ color: '#0000ee', fontWeight: 'bold' }}>Image Processor Node Status</a> - Our system now bypasses Windows host file locking (<font color="#ff0000">EPERM Error</font>) by streaming asset binaries directly via completely sandboxed in-memory buffers.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <font color="#ff0000"><b>[NEW!]</b></font> <a href="https://api.deepseek.com" target="_blank" style={{ color: '#0000ee', fontWeight: 'bold' }}>DeepSeek Chat Integration Protocol</a> - Experience up to 32x color depth reduction while perfectly mapping structured layouts using fully layout-aware intelligent agents.
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </center>

      {/* 5. 结果及双重实时监视器监视面板 */}
      {error && (
        <center style={{ marginTop: '20px' }}>
          <table border={1} cellPadding={10} bgColor="#ffcccc" style={{ borderColor: '#ff0000', maxWidth: '800px', width: '100%' }}>
            <tbody><tr><td><font color="#cc0000"><b>🚨 SYSTEM MALFUNCTION:</b> {error}</font></td></tr></tbody>
          </table>
        </center>
      )}

      {result && (
        <center style={{ marginTop: '30px' }} id="logs">
          <table border={1} cellPadding={5} cellSpacing={0} bgColor="#ffffff" style={{
            borderColor: '#ffffff #808080 #808080 #ffffff',
            maxWidth: '850px',
            width: '100%',
            boxShadow: '3px 3px 10px rgba(0,0,0,0.4)'
          }}>
            <thead>
              <tr bgColor="#008080">
                <td style={{ padding: '8px' }}>
                  <font color="#ffffff"><b>📺 Live Retro Signal Monitor (Generated Output)</b></font>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="center" bgColor="#808080" style={{ padding: '15px' }}>
                  {/* 下载及控制按钮 */}
                  <button 
                    onClick={downloadHtml}
                    style={{
                      marginBottom: '15px',
                      padding: '5px 15px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      border: '2px outset #fff',
                      backgroundColor: '#c0c0c0'
                    }}
                  >
                    💾 Download Single-File Portable HTML (.html)
                  </button>
                  
                  {/* 用于加载重写渲染产物的 90 年代内嵌视窗容器 */}
                  <div style={{
                    border: '4px inset #fff',
                    backgroundColor: '#ffffff',
                    width: '100%',
                    height: '600px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <iframe 
                      title="Retro Signal Monitor"
                      srcDoc={result.reconstructedHtml} 
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        backgroundColor: '#fff'
                      }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </center>
      )}

      <br />
      <hr size={2} color="#808080" style={{ maxWidth: '800px', margin: '0 auto' }} />
      <br />

      {/* 6. 极致复古的 NASA 风格页脚声明区 */}
      <center>
        <table border={0} cellPadding={2} cellSpacing={0} style={{ maxWidth: '800px', width: '100%', fontSize: '13px' }}>
          <tbody>
            <tr>
              <td align="left"><b>Author:</b> Retro Alchemist Engineer</td>
              <td align="right"><b>Curator:</b> DeepSeek Reasoner Agent</td>
            </tr>
            <tr>
              <td align="left"><b>WebSite Design:</b> Stephen E. Chambers (1997 Protocol Re-auth)</td>
              <td align="right"><b>Last update:</b> May 9, 1997 / Regulated May 2026</td>
            </tr>
            <tr>
              <td colSpan={2} align="center" style={{ paddingTop: '15px' }}>
                <font size={1} color="#666666">Please send your temporal data packets and feedback comments to our local loopback interface.</font>
              </td>
            </tr>
          </tbody>
        </table>
      </center>
    </div>
  );
}