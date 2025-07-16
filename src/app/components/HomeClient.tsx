'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import config from '../../../config.json';
import { useTheme } from './ThemeContext';
import { useFilteredKeyDown } from './utils';

interface HomeClientProps {
  homeArt: string;
}

export default function HomeClient({ homeArt }: HomeClientProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    const configAny = config as any;
    const menuItems = configAny.navigation.sections;
    const totalItems = menuItems.length + 2; // theme + quit

    switch (e.key) {
      case 'ArrowDown':
      case 'j':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
      case 'k':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex < menuItems.length) {
          router.push(menuItems[selectedIndex].path);
        } else if (selectedIndex === menuItems.length) {
          toggleTheme();
        } else {
          router.push('/');
        }
        break;
      case 't':
      case 'T':
        e.preventDefault();
        toggleTheme();
        break;
    }
  };

  useFilteredKeyDown(handleKeyDown, [selectedIndex, router, toggleTheme]);

  const handleMenuClick = (path: string) => router.push(path);
  const getShortcutDisplay = (s: string) => s.toUpperCase();
  const getThemeDisplayName = () =>
    theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'Random';

  return (
    <div
      className="min-h-screen flex flex-col items-center p-2 pt-2 sm:p-4 sm:pt-4 md:p-6 md:pt-4 lg:p-8 lg:pt-4"
      style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '6rem' }}
    >
      <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl">
        {/* ASCII Art Header */}
        <div className="home-ascii-art" style={{ whiteSpace: 'pre' }}>
          {homeArt}
        </div>

        {/* Navigation Menu */}
        <div
          className="vim-alpha-menu"
          onMouseLeave={() => setSelectedIndex(0)}
        >
          {(config as any).navigation.sections.map(
            (section: any, index: number) => (
              <div
                key={section.name}
                className={`menu-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleMenuClick(section.path)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="menu-content">
                  <div className="menu-text">
                    <span className="menu-icon">{section.icon}</span>
                    <span className="menu-arrow">{'>'}</span>
                    <span className="menu-title">{section.description}</span>
                  </div>
                  <div className="menu-shortcut">
                    {getShortcutDisplay(section.shortcut)}
                  </div>
                </div>
              </div>
            )
          )}

          {/* Theme Toggle */}
          <div
            key={`theme-toggle-${theme}`}
            className={`menu-item ${
              selectedIndex === (config as any).navigation.sections.length
                ? 'selected'
                : ''
            }`}
            style={{
              borderTop: '1px solid var(--border-color)',
              marginTop: '0.5rem',
              paddingTop: '0.5rem',
            }}
            onMouseEnter={() =>
              setSelectedIndex((config as any).navigation.sections.length)
            }
            onClick={toggleTheme}
          >
            <div className="menu-content">
              <div className="menu-text">
                <span className="menu-icon">◐</span>
                <span className="menu-arrow">{'>'}</span>
                <span className="menu-title">
                  Theme: {hasMounted ? getThemeDisplayName() : ''}
                </span>
              </div>
              <div className="menu-shortcut">T</div>
            </div>
          </div>

          {/* Quit */}
          <div
            className={`menu-item ${
              selectedIndex === (config as any).navigation.sections.length + 1
                ? 'selected'
                : ''
            }`}
            onMouseEnter={() =>
              setSelectedIndex((config as any).navigation.sections.length + 1)
            }
            onClick={() => router.push('/')}
          >
            <div className="menu-content">
              <div className="menu-text">
                <span className="menu-icon">×</span>
                <span className="menu-arrow">{'>'}</span>
                <span className="menu-title">Quit Portfolio</span>
              </div>
              <div className="menu-shortcut">Q</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 