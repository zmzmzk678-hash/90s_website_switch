import { LayoutAnalysis, ScrapingResult } from '../types';

export class HtmlRewriter {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseUrl = process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1';
  }

  public async rewrite(scrapedData: ScrapingResult, analysis: LayoutAnalysis, imageMap: Record<string, string>): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured.');
    }

    const systemPrompt = `你是一个顶级 AI 全栈代码生成专家，专注于高还原度的 90 年代互联网复古网页开发。
你的任务是将现代网页内容重新编写为纯正的、具备历史年代感的 HTML 源码。

硬性规范要求（视觉破坏性更新）：
1. 布局：绝对禁止使用 Flexbox/Grid。必须全面使用传统的 <table>、<tr>、<td> 进行版面架构。
2. 图片（核心要求）：
   - 必须将所有 <img> 标签的 'src' 属性替换为用户提供的本地复古图片路径。
   - 必须给所有 <img> 标签添加内联样式：style="image-rendering: pixelated; image-rendering: crisp-edges; border: 3px outset #c0c0c0;"。这将使图片在浏览器中呈现出硬朗的像素锯齿感。
3. 特效：大量使用 <marquee scrollamount="5"> 滚动字幕、<blink> 闪烁文字、传统 3D 像素边框。
4. 小部件：必须加入访客计数器 GIF、"建設中"闪烁图标、彩虹渐变文字分割线。
5. 字体：Times New Roman, Comic Sans MS, Impact, 或宋体。
6. 完整性：输出直接可运行的完整 HTML 文件，禁止使用省略号。`;

    const imageMapPrompt = Object.entries(imageMap).length > 0
      ? `【重要】图片 URL 替换映射表（请将左侧的原图 URL 替换为右侧的本地复古路径）：\n${Object.entries(imageMap).map(([remote, local]) => `${remote} -> ${local}`).join('\n')}`
      : '（本次未抓取到可替换的图片）';

    const userPrompt = `Target Style: ${analysis.styleType}
Title: ${scrapedData.title}
Structural Analysis: ${JSON.stringify(analysis)}

${imageMapPrompt}

DOM Subtree with Original URLs (Samples):
${scrapedData.html.substring(0, 40000)}

Return ONLY the complete raw HTML code. Do not include markdown code block characters.`;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek Chat Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let reconstructedCode = data.choices[0].message.content.trim();

    if (reconstructedCode.startsWith('```html')) {
      reconstructedCode = reconstructedCode.replace(/^```html\s*/i, '').replace(/\s*```$/, '');
    } else if (reconstructedCode.startsWith('```')) {
      reconstructedCode = reconstructedCode.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    return reconstructedCode;
  }
}