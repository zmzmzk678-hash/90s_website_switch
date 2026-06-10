import puppeteer, { Browser } from 'puppeteer-core';

export type RetroResult = {
  html: string;
  screenshot: string;
};

export async function getRetroScreenshotAndHtml(
  url: string
): Promise<RetroResult> {
  let browser: Browser | null = null;

  try {
    const wsEndpoint =
      process.env.BROWSER_WS_ENDPOINT ||
      (process.env.BROWSERLESS_API_TOKEN
        ? `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`
        : null);

    if (wsEndpoint) {
      console.log('🔗 正在连接到云端浏览器 (Remote Browser)...');
      browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint,
      });
    } else {
      console.log('💻 正在启动本地浏览器 (Local Browser)...');
      browser = await puppeteer.launch({
        executablePath:
          process.env.PUPPETEER_EXECUTABLE_PATH ||
          '/usr/bin/google-chrome',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
        headless: true,
      });
    }

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    );

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 70000,
    });

    const html = await page.content();
    const screenshot = await page.screenshot({ encoding: 'base64' });

    await page.close();
    await browser.close();

    return { html, screenshot };
  } catch (err) {
    console.error('❌ Puppeteer 执行失败:', err);
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    throw err;
  }
}