import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bioId } = await params;
    const filePath = path.join(process.cwd(), 'content', 'about', `${bioId}.md`);
    const content = await readFile(filePath, 'utf-8');
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error reading about markdown:', error);
    return new NextResponse('Error loading content', { status: 500 });
  }
} 