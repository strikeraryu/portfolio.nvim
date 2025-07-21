'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import config from '../../../config.json';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themeObj: any;
  setThemeObj: (obj: any) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState('dark');
  const [themeObj, setThemeObjState] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Generate random theme colors
  const generateRandomTheme = useCallback(() => {
    const randomColor = () => {
      const hue = Math.floor(Math.random() * 360);
      const saturation = Math.floor(Math.random() * 50) + 50; // 50-100%
      const lightness = Math.floor(Math.random() * 30) + 20; // 20-50%
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const randomLightColor = () => {
      const hue = Math.floor(Math.random() * 360);
      const saturation = Math.floor(Math.random() * 30) + 30; // 30-60%
      const lightness = Math.floor(Math.random() * 20) + 70; // 70-90%
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const accentHue = Math.floor(Math.random() * 360);
    const accentColor = `hsl(${accentHue}, 70%, 60%)`;
    const glowColor = `hsl(${accentHue}, 80%, 50%)`;

    return {
      background: randomColor(),
      background2: randomColor(),
      foreground: randomLightColor(),
      foreground2: `hsl(0, 0%, ${Math.floor(Math.random() * 30) + 60}%)`, // Gray variants
      cursor: accentColor,
      selection: `hsl(${accentHue}, 30%, 80%)`,
      accent: accentColor,
      error: `hsl(0, 70%, 60%)`,
      warning: `hsl(45, 70%, 60%)`,
      info: `hsl(200, 70%, 60%)`,
      success: `hsl(120, 70%, 60%)`,
      border: `hsl(0, 0%, ${Math.floor(Math.random() * 20) + 30}%)`,
      glow: glowColor
    };
  }, []);

  // Cache the generated random theme object for the lifetime of the session so
  // we don’t run Math.random() every time React re-renders.
  const randomThemeRef = useRef<any | null>(null);

  const getRandomTheme = () => {
    if (!randomThemeRef.current) {
      randomThemeRef.current = generateRandomTheme();
    }
    return randomThemeRef.current;
  };

  // Hydrate from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      let savedThemeObj = null;
      if (savedTheme === 'random') {
        // Always generate a fresh random theme when the preference is "random"
        // and ensure we do NOT persist the generated colors so that
        // a new palette is produced on the next reload as well.
        savedThemeObj = generateRandomTheme();
        localStorage.removeItem('themeObject');
      } else {
        // For non-random themes we can safely restore the last used color palette
        try {
          savedThemeObj = JSON.parse(localStorage.getItem('themeObject') || 'null');
        } catch (e) {
          /* ignore */
        }
      }
      
      setThemeState(savedTheme);
      setThemeObjState(savedThemeObj);
    }
  }, [generateRandomTheme]);

  // Listen for theme changes in other tabs
  useEffect(() => {
    if (!isClient) return;

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setThemeState(e.newValue);
      }
      if (e.key === 'themeObject' && e.newValue) {
        try {
          setThemeObjState(JSON.parse(e.newValue));
        } catch (e) {}
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [isClient]);

  // Apply theme to document when theme changes
  useEffect(() => {
    if (!isClient) return;

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply theme colors and fonts from config to CSS variables
    const applyTheme = () => {
      const root = document.documentElement;
      const configAny = config as any;
      const fonts = configAny.theme.fonts;
      let colors = themeObj;
      
      if (!colors) {
        colors = configAny.theme.colors[theme] || configAny.theme.colors.dark;
      }
      
      // Apply fonts
      root.style.setProperty('--font-primary', fonts.primary);
      root.style.setProperty('--font-secondary', fonts.secondary);
      root.style.setProperty('--font-mono', fonts.mono);
      
      // Apply colors
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
      root.style.setProperty('--scan-line-color', `${colors.glow}08`);
    };
    
    applyTheme();
  }, [theme, themeObj, isClient]);

  // Set theme function
  const setTheme = useCallback((newTheme: string) => {
    let newThemeObj = null;
    const configAny = config as any;
    
    if (newTheme === 'random') {
      // Generate a fresh random palette every time the user selects random
      newThemeObj = generateRandomTheme();
    } else {
      newThemeObj = configAny.theme.colors[newTheme] || configAny.theme.colors.dark;
    }

    setThemeState(newTheme);
    setThemeObjState(newThemeObj);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'random') {
        // Do not persist random theme object so that we get a new palette next time
        localStorage.removeItem('themeObject');
      } else {
        localStorage.setItem('themeObject', JSON.stringify(newThemeObj));
      }
    }
  }, [generateRandomTheme]);

  // Set theme object function
  const setThemeObj = useCallback((obj: any) => {
    setThemeObjState(obj);
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeObject', JSON.stringify(obj));
    }
  }, []);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    const currentTheme = theme;
    if (currentTheme === 'dark') {
      setTheme('light');
    } else if (currentTheme === 'light') {
      setTheme('random');
    } else {
      setTheme('dark');
    }
  }, [theme, setTheme]);

  const value = {
    theme,
    setTheme,
    themeObj,
    setThemeObj,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
} 