import { readFile } from 'fs/promises';
import path from 'path';
import AboutClient from '../components/AboutClient';

export const dynamic = 'force-static';

export default async function AboutPage() {
  const logoArt = await readFile(
    path.join(process.cwd(), 'content', 'logo.txt'),
    'utf-8'
  );

  // Load all bio markdowns (1-4 and ai)
  const bios: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const text = await readFile(path.join(process.cwd(), 'content', 'about', `${i}.md`), 'utf-8');
    bios.push(text);
  }
  const aiText = await readFile(path.join(process.cwd(), 'content', 'about', 'ai.md'), 'utf-8');
  bios.push(aiText); // index 4

  return <AboutClient logoArt={logoArt} bios={bios} />;
} 
