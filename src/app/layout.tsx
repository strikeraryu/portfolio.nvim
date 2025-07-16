'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import config from '../../config.json';
import { MenuItemProvider, useMenuItem } from './components/MenuItemContext';
import { ThemeProvider, useTheme } from './components/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

function StatusBar() {
  const { currentItem } = useMenuItem();
  const { theme } = useTheme();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Mobile navigation menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navPending, setNavPending] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  useEffect(() => { 
    setIsClient(true); 
    setCurrentTime(new Date()); 
    setLastUpdated(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  const getCurrentPageName = () => {
    const configAny = config as any;
    // try exact match first
    let section = configAny.navigation.sections.find((s: any) => s.path === pathname);
    if (section) return section.name.toLowerCase();

    // allow nested routes like /blogs/slug or /notes/slug
    section = configAny.navigation.sections.find((s: any) => pathname.startsWith(s.path + '/'));
    if (section) return section.name.toLowerCase();

    return 'home';
  };
  
  const getPageColor = (pageName: string) => {
    const configAny = config as any;
    const section = configAny.navigation.sections.find((s: any) => s.name.toLowerCase() === pageName);
    const colors = configAny.theme.colors[theme] || configAny.theme.colors.dark;
    return section?.color || colors.accent;
  };
  
  const getCurrentEntity = () => {
    const item = currentItem || '';
    return `~/portfolio/${getCurrentPageName().toLowerCase()}/${item}`;
  };
  
  const handlePageClick = (path: string) => router.push(path);
  // Remove mount-time prefetch; we'll prefetch on hover instead to avoid
  // unnecessary network traffic and layout shift during first paint.

  // Show progress bar on navigation start
  const handleNavigate = (path: string) => {
    if (pathname === path) return;
    setNavPending(true);
    // broadcast start so other components can trigger as well
    window.dispatchEvent(new Event('route-start'));
    router.push(path);
  };

  // Hide progress bar after route change completes
  useEffect(() => {
    setNavPending(false);
    window.dispatchEvent(new Event('route-done'));
  }, [pathname]);

  // Listen to global events in case navigation triggered elsewhere
  useEffect(() => {
    const start = () => setNavPending(true);
    const done = () => setNavPending(false);
    window.addEventListener('route-start', start);
    window.addEventListener('route-done', done);
    return () => {
      window.removeEventListener('route-start', start);
      window.removeEventListener('route-done', done);
    };
  }, []);
  
  return (
    <>
      <div className="status-line">
        <div className="status-left">
          <span className="status-page-name" style={{ backgroundColor: getPageColor(getCurrentPageName()) }}>{getCurrentPageName().toUpperCase()}</span>
          {getCurrentEntity() && (
            <span
              className="status-entity truncate desktop-only"
              style={{
                minWidth: '25vw',
                display: 'inline-block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                verticalAlign: 'bottom',
              }}
              title={getCurrentEntity()}
            >
              {getCurrentEntity().length > 50
                ? getCurrentEntity().slice(0, 50) + '...'
                : getCurrentEntity()}
            </span>
          )}
        </div>
        <div className="status-center">
          {/* Desktop horizontal nav */}
          <div className="status-nav">
            {(config as any).navigation.sections.map((section: any) => (
              <Link
                key={section.name}
                href={section.path}
                className={`status-nav-item ${pathname === section.path ? 'active' : ''}`}
                prefetch
                title={`${section.name} [${section.shortcut.toUpperCase()}]`}
                onClick={() => window.dispatchEvent(new Event('route-start'))}
              >
                {section.name} [{(section.shortcut as string).toUpperCase()}]
              </Link>
            ))}
          </div>
          {/* Mobile hamburger toggle shown on small screens */}
          <button
            className="mobile-nav-toggle"
            onClick={toggleMobileMenu}
            aria-label="Open navigation menu"
          >
            ☰ <span style={{ color: 'var(--text-primary)', fontSize: 'small', marginLeft: '0.5rem' }}>Menu</span>
          </button>
        </div>
        <div className="status-right">
          <span className="status-time" suppressHydrationWarning>
            Last Updated:{' '}
            {isClient && lastUpdated
              ? lastUpdated.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  timeZone: 'Asia/Kolkata',
                })
              : '--/--/--'}
          </span>
          <span className="status-current-time" suppressHydrationWarning>
            {isClient && currentTime
              ? currentTime.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                  timeZone: 'Asia/Kolkata',
                })
              : '--:--:--'}
          </span>
        </div>
      </div>
      {/* Route progress bar */}
      {navPending && <div className="route-progress" />}
      {/* Mobile navigation drop-up popup with backdrop */}
      {isMobileMenuOpen && (
        <>
          {/* invisible backdrop captures outside clicks */}
          <div
            className="mobile-nav-backdrop"
            onClick={toggleMobileMenu}
            aria-hidden="true"
          />
          <div className="mobile-nav-popup w-1/2" role="menu">
            {(config as any).navigation.sections.map((section: any) => (
              <Link
                key={section.name}
                href={section.path}
                className="mobile-nav-popup-item"
                prefetch
                onClick={() => {
                  window.dispatchEvent(new Event('route-start'));
                  setIsMobileMenuOpen(false);
                }}
              >
                {section.name}
              </Link>
            ))}
          </div>
        </>
      )}
      <div className="terminal-prompt">
        <span className="prompt-text">{(config as any).personal.username}@{(config as any).personal.host}</span>
      </div>
    </>
  );
}

function ClearCurrentItemOnRouteChange() {
  const { setCurrentItem } = useMenuItem();
  const pathname = usePathname();

  useEffect(() => {
    setCurrentItem(null);
  }, [pathname, setCurrentItem]);

  return null;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  // Removed clearing logic; handled by ClearCurrentItemOnRouteChange

  useEffect(() => {
    // Set initial client state
    setIsClient(true);
    setCurrentTime(new Date());
    setLastUpdated(new Date()); // This would normally come from your content API
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't handle global keyboard shortcuts when a modal is open (check for modal overlays)
      const modalOverlay = document.querySelector('[style*="z-index: 9999"]');
      if (modalOverlay) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (e.defaultPrevented) {
        return;
      }

      // J/K scrolling (only on non-home pages) - Direct scrolling like arrow keys
      if (pathname !== '/' && key === 'j') {
        e.preventDefault();
        window.scrollBy(0, 100);
        return;
      }

      if (pathname !== '/' && key === 'k') {
        e.preventDefault();
        window.scrollBy(0, -100);
        return;
      }

      // D/U page down/up scrolling (only on non-home pages) - Direct scrolling like page keys
      if (pathname !== '/' && key === 'd') {
        e.preventDefault();
        window.scrollBy(0, window.innerHeight * 0.8);
        return;
      }

      if (pathname !== '/' && key === 'u') {
        e.preventDefault();
        window.scrollBy(0, -window.innerHeight * 0.8);
        return;
      }
      
      // Theme toggle
      if (key === 't') {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // Quit (go to home) - only Q key
      if (key === 'q') {
        e.preventDefault();
        router.push('/');
        return;
      }

      // Navigation shortcuts
      const configAny = config as any;
      const sections = configAny.navigation.sections;
      const section = sections.find((s: any) => s.shortcut.toLowerCase() === key);
      
      if (section) {
        e.preventDefault();
        window.dispatchEvent(new Event('route-start'));
        router.push(section.path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, pathname, toggleTheme]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>striker@Aryamaan-Jain.local</title>
        <link rel="icon" href="/me.jpg" />
        {/* Preload Google Inter font subset to avoid Flash Of Unstyled Text */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v12/UcCVDynNsjBQVzIhLQmC9Hcj.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <meta property="og:image" content={`${config.personal.site}/home.png`} />
        <meta property="og:title" content="striker@Aryamaan-Jain.local" />
        <meta property="og:description" content={config.personal.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${config.personal.site}/home.png`} />
        <meta name="description" content={config.personal.description} />
        <meta name="twitter:description" content={config.personal.description} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  var themeObj = null;
                  try {
                    themeObj = JSON.parse(localStorage.getItem('themeObject') || 'null');
                  } catch (e) {}
                  var colors = themeObj;
                  if(colors === null) {
                    var config = ${JSON.stringify(config)};
                    colors = config.theme.colors[theme] || config.theme.colors.dark;
                  }
                  var root = document.documentElement;
                  root.style.setProperty('--bg-primary', colors.background);
                  root.style.setProperty('--bg-secondary', colors.background2);
                  root.style.setProperty('--text-primary', colors.foreground);
                  root.style.setProperty('--text-secondary', colors.foreground2);
                  root.style.setProperty('--text-accent', colors.accent);
                  root.style.setProperty('--text-error', colors.error);
                  root.style.setProperty('--text-warning', colors.warning);
                  root.style.setProperty('--text-info', colors.info);
                  root.style.setProperty('--text-success', colors.success);
                  root.style.setProperty('--cursor-color', colors.cursor);
                  root.style.setProperty('--selection-bg', colors.selection);
                  root.style.setProperty('--border-color', colors.border);
                  root.style.setProperty('--glow-color', colors.glow);
                  root.style.setProperty('--scan-line-color', (colors.glow || '') + '08');
                  root.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <MenuItemProvider>
          <ClearCurrentItemOnRouteChange />
          <div className="crt-screen">{children}</div>
          <StatusBar />
        </MenuItemProvider>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}
