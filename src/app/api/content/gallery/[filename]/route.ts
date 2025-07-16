import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // Decode URL-encoded filename
    const { filename: encoded } = await params;
    const filename = decodeURIComponent(encoded);
    const filePath = path.join(process.cwd(), 'content', 'gallery', filename);
    
    // Check if file exists and is an image (including RAW formats)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.dng'];
    const isImage = imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    
    if (!isImage) {
      console.error('Invalid file type:', filename);
      return new NextResponse('Invalid file type', { status: 400 });
    }
    
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    let contentType = 'image/jpeg'; // default
    if (filename.toLowerCase().endsWith('.png')) contentType = 'image/png';
    else if (filename.toLowerCase().endsWith('.gif')) contentType = 'image/gif';
    else if (filename.toLowerCase().endsWith('.webp')) contentType = 'image/webp';
    else if (filename.toLowerCase().endsWith('.bmp')) contentType = 'image/bmp';
    else if (filename.toLowerCase().endsWith('.dng')) contentType = 'image/x-adobe-dng';
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
} 
