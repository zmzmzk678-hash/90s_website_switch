import puppeteer from 'puppeteer-core';

/**
 * 封装后的浏览器服务
 * 支持本地开发模式与 Vercel 生产环境 (Browserless/Remote)
 */
export async function getRetroScreenshotAndHtml(url: string) {
  let browser;

  try {
    const wsEndpoint = process.env.BROWSER_WS_ENDPOINT
      || (process.env.BROWSERLESS_API_TOKEN
          ? `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`
          : null);

    if (wsEndpoint) {
      console.log("🔗 正在连接到云端浏览器 (Remote Browser)...");
      browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint,
      });
    } else {
      // 本地开发环境
      console.log("💻 正在启动本地浏览器 (Local Browser)...");
      browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome',
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

    if (!wsEndpoint) {
      await browser.close();
    }

    return { html, screenshot };
  } catch (error) {
    console.error("❌ 浏览器服务执行出错:", error);
    if (browser) {
      try { await browser.close(); } catch {}
    }
    throw error;
  }
}