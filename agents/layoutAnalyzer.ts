import { LayoutAnalysis, ScrapingResult } from '../types';

export class LayoutAnalyzer {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseUrl = process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1';
  }

  public async analyze(scrapedData: ScrapingResult, chosenStyle: string): Promise<LayoutAnalysis> {
    if (!this.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured in environment variables.');
    }

    // Minify DOM metadata size passed to deepseek-reasoner to handle layout structural context safely
    const simplifiedDom = JSON.stringify(scrapedData.domTree).substring(0, 35000);

    const systemPrompt = `You are a Senior AI Web Agent Architect specializing in parsing complex application layout structures and converting them into 90s vintage web layouts.
Analyze the user's DOM tree architecture and produce an exact, strict structural analysis JSON conforming precisely to the layout schema requested.`;

    const userPrompt = `Target Style Configuration: ${chosenStyle}
Metadata Title: ${scrapedData.title}
Metadata Details: ${JSON.stringify(scrapedData.meta)}

DOM Subtree:
${simplifiedDom}

Perform structural layout reasoning, identify high-level logical zones (header, navbar, sidebar, content, footer, cards, buttons, typography), and evaluate layouts.
Return your response ONLY as a validated JSON payload matching exactly this structure:
{
  "layout": {},
  "theme": {},
  "components": [
    { "type": "navbar", "selector": "nav", "content": "Home, Products, About", "attributes": {} }
  ],
  "dominantColors": ["#hex", "#hex"],
  "uiDensity": "normal",
  "styleType": "${chosenStyle}"
}`;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek Reasoner API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;

    return JSON.parse(resultText) as LayoutAnalysis;
  }
}