import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const metaPath = path.join(process.cwd(), 'content', 'blogs', 'meta.json');
    const metaRaw = await readFile(metaPath, 'utf-8');
    const meta = JSON.parse(metaRaw) as Record<string, { name: string; subtitle: string; date: string }>;

    const entries = Object.entries(meta)
      .map(([file, data]) => ({ file, ...data }))
      .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first

    return NextResponse.json(entries, {
      headers: {
        'Cache-Control': 'public, max-age=600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Error reading blogs meta.json:', error);
    return NextResponse.json({ error: 'Error loading blogs' }, { status: 500 });
  }
} 