import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PuppeteerService } from '../../../services/puppeteerService';
import { ImageProcessorService } from '../../../services/imageProcessorService'; 
import { LayoutAnalyzer } from '../../../agents/layoutAnalyzer';
import { HtmlRewriter } from '../../../agents/htmlRewriter';
import { sanitizeReconstructedHtml } from '../../../utils/sanitizer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, style = 'GeoCities' } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 });
    }

    // --- 核心转换流水线 ---

    // 1. 爬取并收割图片队列
    const scrapedData = await PuppeteerService.scrapeUrl(url);

    // 2. 图像降质处理 (返回本地相对网络路径字典)
    let imageMap: Record<string, string> = {};
    if (scrapedData.imageUrls && scrapedData.imageUrls.length > 0) {
      try {
        imageMap = await ImageProcessorService.processUrls(scrapedData.imageUrls);
      } catch (e) {
        console.error('Sharp 图形核心集群任务异常:', e);
      }
    }

    // 3. DeepSeek 分析布局
    const analyzer = new LayoutAnalyzer();
    const analysisResult = await analyzer.analyze(scrapedData, style);

    // 4. DeepSeek 重写 HTML (这里生成的 src 还是网络链接，例如 /retro_storage/...)
    const rewriter = new HtmlRewriter();
    const rawRetroHtml = await rewriter.rewrite(scrapedData, analysisResult, imageMap);

    // 5. 安全隔离 XSS 净化
    const securedRetroHtml = sanitizeReconstructedHtml(rawRetroHtml);

    // ==============================================================================
    // 6. [資深工程師优化：资产内联处理器]
    // 为了生成可双击直接打开的“单文件产物”，我们需要在此处将所有本地图片资产 Base64 化并拼入 HTML。
    // ==============================================================================
    
    // 我们只需要处理那些由于处理成功而被记录在映射表中的 /retro_storage/ 路径。
    const localRetroAssetPaths = Object.values(imageMap);
    let finalPortableHtml = securedRetroHtml;

    if (localRetroAssetPaths.length > 0) {
      const publicPath = path.join(process.cwd(), 'public');
      
      // 并行读取并替换资产
      await Promise.all(localRetroAssetPaths.map(async (relativeWebPath) => {
        // 1. 将网络路径转为磁盘物理路径
        const physicalPath = path.join(publicPath, relativeWebPath);
        
        // 2. 只有图片确实存在且在 retro_storage 目录下才处理
        if (fs.existsSync(physicalPath) && relativeWebPath.includes('retro_storage/processed/')) {
          try {
            // 3. 读取为 Buffer 并生成 Base64
            const fileBuffer = fs.readFileSync(physicalPath);
            const base64String = fileBuffer.toString('base64');
            // 我们之前处理时默认统一输出 PNG-8 格式
            const dataUri = `data:image/png;base64,${base64String}`;
            
            // 4. 在 HTML 源码中全量搜索网络链接路径，精确平替为 Base64 数据
            // 例如将 src="/retro_storage/..." 替换为 src="data:image/png..."
            const escapedPathForRegex = relativeWebPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const replaceRegex = new RegExp(`src="${escapedPathForRegex}"`, 'g');
            finalPortableHtml = finalPortableHtml.replace(replaceRegex, `src="${dataUri}"`);
          } catch (err) {
            console.error(`无法将资产内联化 (${relativeWebPath}):`, err);
          }
        }
      }));
    }

    // ==============================================================================

    // 返回全套内联化的复古资源束
    return NextResponse.json({
      html: scrapedData.html,
      layout: analysisResult,
      screenshot: scrapedData.screenshot,
      reconstructedHtml: finalPortableHtml, // 这里返回的是内联了图片的完整产物
      imageMap: imageMap 
    });

  } catch (error: any) {
    console.error('Processing Pipeline Failed:', error);
    return NextResponse.json(
      { error: error.message || 'Internal execution routine failed.' },
      { status: 500 }
    );
  }
}