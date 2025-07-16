import { useEffect } from 'react';

export function normalizeAscii(ascii: string): string {
  const lines = ascii.split('\n');
  const max = Math.max(...lines.map((l) => l.length));
  return lines.map((l) => l.padEnd(max, ' ')).join('\n');
}

// Register global keydown listener that ignores events with modifier keys or from inputs
export function useFilteredKeyDown(handler: (e: KeyboardEvent) => void, deps: any[] = []) {
  useEffect(() => {
    const wrapped = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      handler(e);
    };
    window.addEventListener('keydown', wrapped);
    return () => window.removeEventListener('keydown', wrapped);
  }, deps);
} 