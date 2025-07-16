import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');
    if (!filename) return new NextResponse('filename query param required', { status: 400 });
    const widthParam = url.searchParams.get('w');
    const width = widthParam ? Math.min( parseInt(widthParam, 10), 800) : 400; // clamp width

    const decoded = decodeURIComponent(filename);
    const filePath = path.join(process.cwd(), 'content', 'gallery', decoded);

    // load original image buffer
    const buffer = await readFile(filePath);

    // convert / resize via sharp
    const webpBuffer = await sharp(buffer).resize({ width }).webp({ quality: 75 }).toBuffer();

    return new NextResponse(webpBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    console.error('thumb generation error', e);
    return new NextResponse('Error', { status: 500 });
  }
} 