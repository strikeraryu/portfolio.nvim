'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import PageHeader from '../../components/PageHeader';
import { useFilteredKeyDown } from './utils';
import { useMenuItem } from './MenuItemContext';

// Dynamically import react-markdown (cast to any to avoid complex generic types)
const ReactMarkdown: any = dynamic(() => import('react-markdown').then((m) => m.default as any), {
  // `react-markdown` should only render on the client
  ssr: false,
});

interface Props {
  markdown: string;
  folder: 'blogs' | 'notes';
  title: string;
  subtitle?: string;
  date?: string;
  file: string;
}

export default function MarkdownFullView({ markdown, folder, title, subtitle = '', date, file }: Props) {
  const router = useRouter();
  const { setCurrentItem } = useMenuItem();

  // set current item in menubar
  useEffect(() => {
    setCurrentItem(file);
    return () => setCurrentItem(null);
  }, [file, setCurrentItem]);

  // Esc key navigation back to list
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      router.push(`/${folder}`);
    }
  };
  useFilteredKeyDown(handler, [router, folder]);

  return (
    <div>
      <PageHeader title={title} description={subtitle} />
      <div className="page-content" style={{ position: 'relative' }}>
        {/* Esc hint in section top-right */}
        <div
          style={{ margin: '20px', position: 'absolute', top: 0, right: 0, color: 'var(--text-secondary)' }}
          className="text-xs font-mono desktop-only"
        >
          Esc ↩ back
        </div>
        <div className="prose prose-invert max-w-none text-[var(--text-primary)] telescope-markdown">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
        {date && (
          <div className="mt-8 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
            {date}
          </div>
        )}
      </div>
    </div>
  );
} 
