import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: Request, context: { params: Promise<{ filename: string }> }) {
  const { filename: rawFilename } = await context.params;
  // Decode and normalize filename
  let filename = decodeURIComponent(rawFilename);
  filename = filename.replace(/\.md$/, '');

    const filePath = path.join(process.cwd(), 'content', 'gallery', 'story', `${filename}.md`);
  console.log('Looking for file:', filePath);

  try {
    const content = await readFile(filePath, 'utf-8');
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.log('Story not found for:', filename, 'at', filePath);
    return new NextResponse('', {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // negative result cached 1h
      },
    });
  }
} 
