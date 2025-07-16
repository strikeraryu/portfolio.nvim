import { readFile } from 'fs/promises';
import path from 'path';
import LinksClient from '../components/LinksClient';

export const dynamic = 'force-static';

export default async function LinksPage() {
  const logoAscii = await readFile(
    path.join(process.cwd(), 'content', 'logo.txt'),
    'utf-8'
  );

  return <LinksClient logoAscii={logoAscii} />;
} 