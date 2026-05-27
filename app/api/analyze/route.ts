import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
// 修正导入：直接导入函数
import { getRetroScreenshotAndHtml } from '../../../services/puppeteerService';
import { ImageProcessorService } from '../../../services/imageProcessorService';
import { LayoutAnalyzer } from '../../../agents/layoutAnalyzer';
import { HtmlRewriter } from '../../../agents/htmlRewriter';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // 调用修改后的函数
    const { html, screenshot } = await getRetroScreenshotAndHtml(url);

    // 假设后续逻辑使用这些数据
    // ... 你的业务逻辑代码 ...

    return NextResponse.json({ success: true, message: "Analysis complete" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}