'use client';

import { usePathname } from 'next/navigation';
import config from '../../config.json';

interface PageHeaderProps {
  title?: string;
  description?: string;
  color?: string;
}

export default function PageHeader({ title, description, color }: PageHeaderProps) {
  const pathname = usePathname();
  
  // Get section info from config if not provided
  const section = config.navigation.sections.find(s => s.path === pathname);
  
  const pageTitle = title || section?.name || 'Page';
  const pageDescription = description || section?.description || '';
  const pageColor = color || section?.color || 'var(--text-accent)';
  
  return (
    <div className="page-header">
      <div className="page-header-container">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="page-title">
              {pageTitle}
            </h1>
            <p className="page-subtitle">
              {pageDescription}
            </p>
          </div>
          
          {/* Shortcuts (hidden on mobile) */}
          <div className="shortcut-hint flex-shrink-0 mt-2">
            <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
              Use <span style={{ color: 'var(--text-primary)' }}>J</span>/<span style={{ color: 'var(--text-primary)' }}>K</span> for scrolling
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
              Use <span style={{ color: 'var(--text-primary)' }}>D</span>/<span style={{ color: 'var(--text-primary)' }}>U</span> for page down/up
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 