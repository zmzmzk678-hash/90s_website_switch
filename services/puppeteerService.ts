import puppeteer from 'puppeteer-core';

interface RetroResult {
  html: string;
  screenshot: string; // base64 PNG
}

/**
 * 通用 Puppeteer 服务
 * - 本地开发：自动使用本机 Chrome
 * - Vercel / Serverless：连接 Browserless
 * - Docker / Linux：可通过环境变量指定 Chrome 路径
 */
export async function getRetroScreenshotAndHtml(url: string): Promise<RetroResult> {
  let browser: puppeteer.Browser | null = null;

  const wsEndpoint =
    process.env.BROWSER_WS_ENDPOINT ||
    (process.env.BROWSERLESS_API_TOKEN
      ? `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`
      : null);

  const isRemote = Boolean(wsEndpoint);

  try {
    if (isRemote) {
      // =========================
      // ☁️ Serverless / Vercel
      // =========================
      console.log('🔗 使用远程 Browserless 浏览器');
      browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint!,
      });
    } else {
      // =========================
      // 💻 本地 / Docker / Linux
      // =========================
      console.log('💻 启动本地 Puppeteer 浏览器');

      browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, // 本地一般不需要
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-zygote',
        ],
      });
    }

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/120.0.0.0 Safari/537.36'
    );

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30_000,
    });

    const html = await page.content();

    // ✅ 完全不写磁盘：直接内存截图
    const screenshotBuffer = await page.screenshot({
      type: 'png',
    });

    await page.close();

    // ⚠️ 远程 browserless 不要 close
    if (!isRemote) {
      await browser.close();
    }

    return {
      html,
      screenshot: `data:image/png;base64,${screenshotBuffer.toString('base64')}`,
    };

  } catch (error) {
    console.error('❌ Puppeteer 执行失败:', error);
    if (browser && !isRemote) {
      try {
        await browser.close();
      } catch {}
    }
    throw error;
  }
}