import puppeteer from 'puppeteer';

/**
 * 封装后的浏览器服务
 * 支持本地开发模式与 Vercel 生产环境 (Browserless/Remote)
 */
export async function getRetroScreenshotAndHtml(url: string) {
  let browser;

  try {
    // 检查是否配置了云端浏览器地址
    if (process.env.BROWSER_WS_ENDPOINT) {
      console.log("🔗 正在连接到云端浏览器 (Remote Browser)...");
      browser = await puppeteer.connect({
        browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
      });
    } else {
      // 本地开发环境
      console.log("💻 正在启动本地浏览器 (Local Browser)...");
      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ],
        headless: true,
      });
    }

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const html = await page.content();
    const screenshot = await page.screenshot({ encoding: 'base64' });

    await page.close();

    if (!process.env.BROWSER_WS_ENDPOINT) {
      await browser.close();
    }

    return { html, screenshot };
  } catch (error) {
    console.error("❌ 浏览器服务执行出错:", error);
    throw error;
  }
}