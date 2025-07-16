import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // pagination parameters – fallback to sensible defaults
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '24', 10),
      200 // hard-cap to avoid returning huge payloads accidentally
    );

    const galleryPath = path.join(process.cwd(), 'content', 'gallery');
    const files = await readdir(galleryPath);

    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const imageFiles = files.filter((file) =>
      imageExtensions.some((ext) => file.toLowerCase().endsWith(ext))
    );

    // Slice according to pagination
    const paginated = imageFiles.slice(offset, offset + limit);

    const hasMore = offset + limit < imageFiles.length;

    return NextResponse.json({ files: paginated, hasMore });
  } catch (error) {
    console.error('Error reading Gallery directory:', error);
    return NextResponse.json({ files: [], hasMore: false }, { status: 500 });
  }
} 
