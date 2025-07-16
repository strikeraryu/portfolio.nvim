'use client';

import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import config from '../../../config.json';
import { normalizeAscii } from './utils';

interface Props {
  logoAscii: string;
}

export default function LinksClient({ logoAscii }: Props) {
  const [logo] = useState<string>(normalizeAscii(logoAscii));
  const configAny = config as any;

  return (
    <div>
      <PageHeader />
      <div className="page-content">
        <div className="max-w-6xl mx-auto">
          <div className="links-container flex flex-col lg:flex-row gap-8">
            {/* ASCII Logo */}
            <div className="ascii-art text-left lg:w-1/2" style={{ whiteSpace: 'pre' }}>
              {logo}
            </div>

            {/* Links & info */}
            <div className="space-y-2 lg:w-1/2">
              <div
                className="text-xl font-mono mb-4"
                style={{ color: 'var(--text-accent)' }}
              >
                {configAny.personal.username}@{configAny.personal.host}
              </div>

              {/* full-width divider */}
              <div
                className="w-full"
                style={{
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {'-'.repeat(200)}
              </div>

              {Object.entries(configAny.links.attributes).map(([key, value]) => (
                <div key={key} className="font-mono text-sm">
                  <span style={{ color: 'var(--text-warning)' }}>{key}:</span>{' '}
                  {'link' in (value as any) ? (
                    <a
                      href={(value as any).link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition-colors"
                      style={{ color: 'var(--text-info)', cursor: 'pointer' }}
                    >
                      {(value as any).content}
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-primary)' }}>
                      {(value as any).content}
                    </span>
                  )}
                </div>
              ))}

              {/* Theme color palette */}
              <div className="grid grid-cols-5 mt-2" style={{ width: '120px' }}>
                {[
                  'var(--bg-primary)',
                  'var(--text-accent)',
                  'var(--text-warning)',
                  'var(--text-info)',
                  'var(--text-success)',
                  'var(--bg-secondary)',
                  'var(--text-primary)',
                  'var(--text-secondary)',
                  'var(--border-color)',
                  'var(--cursor-color)',
                ].map((clr, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: clr,
                      width: '24px',
                      height: '16px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 