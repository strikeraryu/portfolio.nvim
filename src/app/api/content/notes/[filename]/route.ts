import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = path.join(process.cwd(), 'content', 'notes', filename);
    const content = await readFile(filePath, 'utf-8');

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, immutable'
      },
    });
  } catch (error) {
    console.error('Error reading note markdown:', error);
    return new NextResponse('Error loading content', { status: 500 });
  }
} 