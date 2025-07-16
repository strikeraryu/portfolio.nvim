import { readFile } from 'fs/promises';
import path from 'path';
import HomeClient from './components/HomeClient';

export const dynamic = 'force-static';

export default async function Home() {
  // Pre-read ASCII art so the client mounts with content already available
  const homeArt = await readFile(
    path.join(process.cwd(), 'content', 'home.txt'),
    'utf-8'
  );

  return <HomeClient homeArt={homeArt} />;
}
