import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

// 显式关闭 sharp 的全局缓存，彻底断绝 Windows 环境下的句柄残留与内存死锁
sharp.cache(false);

const RETRO_IMAGE_CONFIG = {
  maxWidth: 320,      
  maxHeight: 240,
  colors: 32,         
};

export class ImageProcessorService {
  private static PROCESSED_DIR = path.join(process.cwd(), 'public', 'retro_storage', 'processed');

  public static init() {
    // 删除了 ORIGINALS_DIR 的初始化，不再向磁盘写入任何中间临时文件
    if (!fs.existsSync(this.PROCESSED_DIR)) {
      fs.mkdirSync(this.PROCESSED_DIR, { recursive: true });
    }
    this.ensurePlaceholder();
  }

  private static async ensurePlaceholder() {
    const placeholderPath = path.join(this.PROCESSED_DIR, 'placeholder_broken.png');
    if (!fs.existsSync(placeholderPath)) {
      try {
        await sharp({
          create: {
            width: 120,
            height: 90,
            channels: 3,
            background: { r: 212, g: 208, b: 200 } 
          }
        })
        .png()
        .toFile(placeholderPath);
      } catch (e) {
        console.error('无法创建兜底占位图:', e);
      }
    }
  }

  private static generateHash(url: string): string {
    return crypto.createHash('md5').update(url).digest('hex');
  }

  // 核心升级：直接将网络图片下载为内存 Buffer
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

  // 核心升级：直接从内存 Buffer 中读取源图并执行复古像素化重塑
  private static async pixelateImageFromBuffer(imageBuffer: Buffer, targetPath: string): Promise<boolean> {
    try {
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) return false;

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

      await image
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
        .toFile(targetPath);

      return true;
    } catch (e) {
      console.error(`图像核心矩阵降质失败`);
      return false;
    }
  }

  public static async processUrls(urls: string[]): Promise<Record<string, string>> {
    this.init();
    const urlMap: Record<string, string> = {}; 

    const concurrencyLimit = 5;
    const batches = [];
    for (let i = 0; i < urls.length; i += concurrencyLimit) {
      batches.push(urls.slice(i, i + concurrencyLimit));
    }

    for (const batch of batches) {
      await Promise.all(batch.map(async (url) => {
        if (!url || url.startsWith('data:')) return;

        const hash = this.generateHash(url);
        const processedFileName = `${hash}_retro.png`; 
        const processedPath = path.join(this.PROCESSED_DIR, processedFileName);
        const webUrlPath = `/retro_storage/processed/${processedFileName}`;

        // 1. 一步到位下载到内存中，避免任何磁盘痕迹
        const imageBuffer = await this.downloadImageToBuffer(url);
        if (!imageBuffer) return;

        // 2. 直接从 Buffer 烘焙至最终的 public 静态资源目录
        const processSuccess = await this.pixelateImageFromBuffer(imageBuffer, processedPath);
        
        if (processSuccess) {
          urlMap[url] = webUrlPath;
        }
        
        // 3. 彻底移除了 fs.unlinkSync 逻辑，再也不会触发 Windows 权限死锁！
      }));
    }

    return urlMap;
  }
}