import crypto from 'crypto';
import sharp from 'sharp';

// 显式关闭 sharp 的全局缓存
sharp.cache(false);

const RETRO_IMAGE_CONFIG = {
  maxWidth: 320,
  maxHeight: 240,
  colors: 32,
};

export class ImageProcessorService {
  // 彻底废弃 PROCESSED_DIR 磁盘路径，不再需要 init() 和 mkdirSync

  // 创建一个内存中的兜底 Base64 占位图
  private static async getPlaceholderBase64(): Promise<string> {
    try {
      const buffer = await sharp({
        create: {
          width: 120,
          height: 90,
          channels: 3,
          background: { r: 212, g: 208, b: 200 }
        }
      })
      .png()
      .toBuffer();
      return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch (e) {
      // 极端情况下的硬编码极其微小的灰色 PNG 占位符
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
  }

  // 直接将网络图片下载为内存 Buffer
  private static async downloadImageToBuffer(url: string): Promise<Buffer | null> {
    try {
      if (!url || url.startsWith('data:')) return null;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': new URL(url).origin,
          'Cache-Control': 'no-cache'
        },
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (e) {
      console.error(`高级网络层下载资产失败: ${url}`);
      return null;
    }
  }

  // 核心改动：不再写入文件，而是直接返回重塑后的图片 Buffer
  private static async pixelateImageToBuffer(imageBuffer: Buffer): Promise<Buffer | null> {
    try {
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) return null;

      let width = metadata.width;
      let height = metadata.height;

      if (width > RETRO_IMAGE_CONFIG.maxWidth) {
        height = Math.round(height * (RETRO_IMAGE_CONFIG.maxWidth / width));
        width = RETRO_IMAGE_CONFIG.maxWidth;
      }

      if (height > RETRO_IMAGE_CONFIG.maxHeight) {
        width = Math.round(width * (RETRO_IMAGE_CONFIG.maxHeight / height));
        height = RETRO_IMAGE_CONFIG.maxHeight;
      }

      return await image
        .resize(width, height, {
          kernel: sharp.kernel.nearest,
        })
        .sharpen({ sigma: 1.5 })
        .png({
          quality: 100,
          colors: RETRO_IMAGE_CONFIG.colors,
          compressionLevel: 9,
          dither: 1.0
        })
        .toBuffer(); // 👈 核心修改：这里改用 toBuffer() 直接输出到内存
    } catch (e) {
      console.error(`图像核心矩阵降质失败`);
      return null;
    }
  }

  public static async processUrls(urls: string[]): Promise<Record<string, string>> {
    // 删除了对 this.init() 的调用，不再检查和创建文件夹
    const urlMap: Record<string, string> = {};

    const concurrencyLimit = 5;
    const batches = [];
    for (let i = 0; i < urls.length; i += concurrencyLimit) {
      batches.push(urls.slice(i, i + concurrencyLimit));
    }

    for (const batch of batches) {
      await Promise.all(batch.map(async (url) => {
        if (!url || url.startsWith('data:')) return;

        // 一步到位下载到内存中
        const imageBuffer = await this.downloadImageToBuffer(url);
        if (!imageBuffer) return;

        // 直接从内存 Buffer 处理成复古图片 Buffer
        const processedBuffer = await this.pixelateImageToBuffer(imageBuffer);

        if (processedBuffer) {
          // 👈 核心修改：直接将 Buffer 转为 Base64 编码的 DataURL 返回给前端
          urlMap[url] = `data:image/png;base64,${processedBuffer.toString('base64')}`;
        } else {
          // 失败时提供兜底图
          urlMap[url] = await this.getPlaceholderBase64();
        }
      }));
    }

    return urlMap;
  }
}