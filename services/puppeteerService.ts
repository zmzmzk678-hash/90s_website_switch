import puppeteer, { Browser, Page } from 'puppeteer';
import { ScrapingResult } from '../types';

export class PuppeteerService {
  private static async getBrowserInstance(): Promise<Browser> {
    return await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security', 
        '--window-size=1280,1024'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    });
  }

  public static async scrapeUrl(url: string): Promise<ScrapingResult> {
    const browser = await this.getBrowserInstance();
    const page: Page = await browser.newPage();
    
    try {
      await page.setViewport({ width: 1280, height: 1024 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // 自动无限滚动以触发图片的懒加载 (Lazy Load)
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 400;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight || totalHeight > 8000) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 150);
        });
      });

      // 留出2秒给动态脚本加载缓冲
      await new Promise(resolve => setTimeout(resolve, 2000));

      const title = await page.title();
      const html = await page.content();
      
      const meta = await page.evaluate(() => {
        const result: Record<string, string> = {};
        const metaTags = document.getElementsByTagName('meta');
        for (let i = 0; i < metaTags.length; i++) {
          const name = metaTags[i].getAttribute('name') || metaTags[i].getAttribute('property');
          const content = metaTags[i].getAttribute('content');
          if (name && content) result[name] = content;
        }
        return result;
      });

      // 深度提取 DOM 树并标记/抽离图片网络绝对链接
      const evaluationResult = await page.evaluate(() => {
        const extractedUrls: string[] = [];

        function mapNode(node: Node): any {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue?.trim();
            return text ? { type: 'text', text } : null;
          }
          if (node.nodeType !== Node.ELEMENT_NODE) return null;

          const element = node as Element;
          const tagName = element.tagName.toLowerCase();
          const ignoredTags = ['script', 'style', 'noscript', 'iframe', 'svg'];
          if (ignoredTags.includes(tagName)) return null;

          const attributes: Record<string, string> = {};
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            attributes[attr.name] = attr.value;
          }

          if (tagName === 'img' && attributes['src']) {
            try {
              const absUrl = new URL(attributes['src'], window.location.href).href;
              extractedUrls.push(absUrl);
              attributes['data-retro-original-src'] = absUrl; 
            } catch (e) {
              // 自动吞掉非规范的链接异常
            }
          }

          const children: any[] = [];
          node.childNodes.forEach(child => {
            const mapped = mapNode(child);
            if (mapped) children.push(mapped);
          });

          return {
            type: 'element',
            tagName,
            attributes,
            children: children.filter(Boolean)
          };
        }
        
        const domTree = mapNode(document.body);
        return { domTree, extractedUrls };
      });

      const screenshotBase64 = await page.screenshot({
        fullPage: true,
        encoding: 'base64',
        type: 'jpeg',
        quality: 60
      });

      const uniqueUrls = Array.from(new Set(evaluationResult.extractedUrls));

      return {
        html,
        title,
        meta,
        screenshot: `data:image/jpeg;base64,${screenshotBase64}`,
        domTree: evaluationResult.domTree,
        imageUrls: uniqueUrls 
      };
    } finally {
      await page.close();
      await browser.close();
    }
  }
}