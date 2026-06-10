import { NextResponse } from 'next/server';
import { getRetroScreenshotAndHtml } from '../../../services/puppeteerService';
import { ImageProcessorService } from '../../../services/imageProcessorService';
import { LayoutAnalyzer } from '../../../agents/layoutAnalyzer';
import { HtmlRewriter } from '../../../agents/htmlRewriter';
import JSZip from 'jszip';

interface ProcessedSuccess {
  url: string;
  success: true;
  reconstructedHtml: string;
  screenshot: string;
  imageMap: Record<string, string>;
  title: string;
}

interface ProcessedError {
  url: string;
  success: false;
  error: string;
}

type ProcessedItem = ProcessedSuccess | ProcessedError;

async function processSingleUrl(url: string, style: string) {
  const { html, screenshot } = await getRetroScreenshotAndHtml(url);

  const imgUrls: string[] = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src && !src.startsWith('data:')) {
      try { imgUrls.push(new URL(src, url).toString()); } catch {}
    }
  }

  const imageMap = await ImageProcessorService.processUrls(imgUrls);

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const scrapedData = {
    html,
    screenshot: screenshot as string,
    title: titleMatch ? titleMatch[1] : url,
    meta: {},
    domTree: html.substring(0, 50000),
    imageUrls: [] as string[],
  };

  const analyzer = new LayoutAnalyzer();
  const analysis = await analyzer.analyze(scrapedData, style);

  const rewriter = new HtmlRewriter();
  const reconstructedHtml = await rewriter.rewrite(scrapedData, analysis, imageMap);

  return { reconstructedHtml, screenshot: screenshot as string, imageMap, title: scrapedData.title };
}

export async function POST(request: Request) {
  try {
    const { url, urls, style, exportZip } = await request.json();

    const urlList: string[] = urls?.length ? urls : url ? [url] : [];
    if (!urlList.length) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log(`🚀 开始处理 ${urlList.length} 个 URL，风格: ${style}`);

    const results = await Promise.allSettled(
      urlList.map((u) => processSingleUrl(u, style || 'GeoCities'))
    );

    const processed: ProcessedItem[] = results.map((r, i) => {
      if (r.status === 'fulfilled') {
        return { url: urlList[i], success: true as const, ...r.value };
      } else {
        return { url: urlList[i], success: false as const, error: (r as PromiseRejectedResult).reason?.message };
      }
    });

    if (exportZip) {
      const zip = new JSZip();
      for (const item of processed) {
        if (!item.success) continue;
        const slug = new URL(item.url).hostname.replace(/\./g, '_');
        zip.file(`${slug}/index.html`, item.reconstructedHtml);

        let imgIndex = 0;
        for (const [, dataUrl] of Object.entries(item.imageMap)) {
          if (!dataUrl.startsWith('data:')) continue;
          const base64Data = dataUrl.split(',')[1];
          const imgBuf = Buffer.from(base64Data, 'base64');
          zip.file(`${slug}/images/img_${imgIndex++}.png`, imgBuf);
        }
      }

      const zipBuf = await zip.generateAsync({ type: 'nodebuffer' });
      const arrayBuffer = zipBuf.buffer.slice(
        zipBuf.byteOffset,
        zipBuf.byteOffset + zipBuf.byteLength
      ) as ArrayBuffer;
      return new NextResponse(arrayBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="retro_pages.zip"',
        },
      });
    }

    if (urlList.length === 1) {
      const item = processed[0];
      return NextResponse.json(item);
    }
    return NextResponse.json({ success: true, results: processed });

  } catch (error: any) {
    console.error('❌ Pipeline 失败:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze' }, { status: 500 });
  }
}