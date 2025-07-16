import { readFile } from 'fs/promises';
import path from 'path';
import MarkdownFullView from '../../components/MarkdownFullView';

interface Params {
  filename: string;
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { filename } = await params;

  // Load markdown content
  const filePath = path.join(process.cwd(), 'content', 'notes', filename);
  const markdown = await readFile(filePath, 'utf-8');

  // Attempt to load metadata for nicer title/subtitle
  let title: string = filename;
  let subtitle = '';
  let date = '';
  try {
    const metaRaw = await readFile(
      path.join(process.cwd(), 'content', 'notes', 'meta.json'),
      'utf-8'
    );
    const meta = JSON.parse(metaRaw) as Record<string, { name: string; subtitle: string; date: string }>;
    const info = meta[filename];
    if (info) {
      title = info.name;
      subtitle = info.subtitle;
      date = info.date;
    }
  } catch (err) {
    console.error('Failed to read notes meta.json', err);
  }

  return (
    <MarkdownFullView
      markdown={markdown}
      folder="notes"
      title={title}
      subtitle={subtitle}
      date={date}
      file={filename}
    />
  );
} 