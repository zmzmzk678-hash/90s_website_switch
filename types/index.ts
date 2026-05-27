export interface LayoutAnalysis {
  layout: Record<string, any>;
  theme: Record<string, any>;
  components: Array<{
    type: string;
    selector: string;
    content: string;
    attributes: Record<string, string>;
  }>;
  dominantColors: string[];
  uiDensity: 'compact' | 'normal' | 'sparse';
  styleType: 'GeoCities' | 'Win98' | 'CRT' | 'Vaporwave' | '90s Internet';
}

export interface ScrapingResult {
  html: string;
  title: string;
  meta: Record<string, string>;
  screenshot: string;
  domTree: any;
  imageUrls: string[]; 
}

export interface ReconstructResponse {
  html: string;
  layout: Partial<LayoutAnalysis>;
  screenshot: string;
  reconstructedHtml: string;
  imageMap?: Record<string, string>; 
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agent: 'System' | 'PuppeteerScraper' | 'ImageProcessor' | 'DeepSeekReasoner' | 'DeepSeekChat';
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}