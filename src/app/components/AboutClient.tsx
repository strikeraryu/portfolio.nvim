'use client';

import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { normalizeAscii, useFilteredKeyDown } from './utils';
import Skeleton from './Skeleton';
// config not needed in this component

interface AboutClientProps {
  logoArt: string;
  bios: string[]; // index 0-3 standard, 4 AI
}

export default function AboutClient({ logoArt, bios }: AboutClientProps) {
  const normalizedLogo = normalizeAscii(logoArt);
  const [selectedBio, setSelectedBio] = useState(0);
  const [aboutContent, setAboutContent] = useState<string>(bios[0]);
  const [contentCache] = useState<Record<number, string>>({ 0: bios[0], 1: bios[1], 2: bios[2], 3: bios[3], 4: bios[4] });
  const [isContentLoaded] = useState(true);

  // Simple markdown-ish renderer (same as previous logic)
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-4">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} style={{ color: 'var(--text-accent)' }}>
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
      if (line.trim() === '') return <br key={index} />;
      return (
        <p key={index} className="mb-4">
          {line}
        </p>
      );
    });
  };

  // Fetch about content based on selectedBio
  const loadAboutContent = (bioIdx: number) => {
    setAboutContent(contentCache[bioIdx]);
  };

  // re-load when selection changes
  useEffect(() => {
    loadAboutContent(selectedBio);
  }, [selectedBio]);

  // keyboard navigation for bio selection
  const handleKey = (e: KeyboardEvent) => {
    switch (e.key) {
      case '[':
        e.preventDefault();
        setSelectedBio((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case ']':
        e.preventDefault();
        setSelectedBio((prev) => (prev < 4 ? prev + 1 : prev));
        break;
    }
  };
  useFilteredKeyDown(handleKey, []);

  const bioOptions = Array.from({ length: 5 }).map((_, i) => ({
    value: i,
    label: i === 0 ? 'SHORTEST' : i === 3 ? 'LONGEST' : i === 4 ? 'AI' : '',
  }));

  return (
    <div>
      <PageHeader />
      <div className="page-content">
        <div className="max-w-7xl mx-auto">
          <div className="about-container flex flex-row items gap-12">
            {/* Left */}
            <div className="flex-1 space-y-6">
              {/* Radio selection */}
              <div className="space-y-4">
                <div>
                  <div className="w-3/4">
                    <div
                      className="font-mono text-xs mb-4 text-left"
                      style={{ color: 'var(--text-primary)', opacity: 0.8 }}
                    >
                      ADJUST BIO LENGTH :
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between gap-4 w-full sm:w-3/4 mx-auto">
                    {bioOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="bio-length"
                          checked={selectedBio === option.value}
                          onChange={() => setSelectedBio(option.value)}
                          className="w-4 h-4 mb-1"
                          style={{ accentColor: 'var(--text-accent)' }}
                        />
                        {option.label && (
                          <span
                            className="font-mono text-xs transition-colors whitespace-nowrap"
                            style={{
                              color: 'var(--text-primary)',
                              fontSize: '8px',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = 'var(--text-accent)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = 'var(--text-primary)')
                            }
                          >
                            {option.label}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hint text */}
              <div
                className="text-xs font-mono space-y-1 desktop-only"
                style={{ color: 'var(--text-secondary)', marginTop: '4rem' }}
              >
                <p>
                  Use <span style={{ color: 'var(--text-primary)' }}>[</span> and{' '}
                  <span style={{ color: 'var(--text-primary)' }}>]</span> to change
                  selection
                </p>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {!isContentLoaded ? (
                  <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} height="0.8rem" />
                    ))}
                  </div>
                ) : (
                  <div
                    className="leading-relaxed font-mono text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {renderMarkdown(aboutContent)}
                  </div>
                )}
              </div>
            </div>

            {/* Right - logo */}
            <div className="flex-1 flex items justify-center min-h-[400px]">
              <div className="w-full max-w-md h-full flex justify-center">
                <div
                  className="about-logo-art text-left h-full flex items-start"
                  style={{ color: 'var(--text-accent)', whiteSpace: 'pre' }}
                >
                  {normalizedLogo}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
