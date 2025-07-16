"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
// removed remark-gfm to prevent runtime errors
import { useMenuItem } from "./MenuItemContext";
import { useFilteredKeyDown } from "./utils";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Skeleton from "./Skeleton";

interface EntryMeta {
  file: string;
  name: string;
  subtitle: string;
  date: string; // YYYY-MM-DD
}

interface TelescopeListProps {
  /** Either "blogs" or "notes" */
  folder: "blogs" | "notes";
}

/**
 * A Telescope-inspired split view component that lists markdown files on the left
 * and shows a markdown preview on the right. It supports Vim-like keyboard
 * navigation and search, with an optional full-view mode.
 */
export default function TelescopeList({ folder }: TelescopeListProps) {
  const [entries, setEntries] = useState<EntryMeta[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openEntry, setOpenEntry] = useState<EntryMeta | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [markdownCache, setMarkdownCache] = useState<Record<string, string>>({});
  // jsx caching removed for simplicity
  const [isMarkdownLoading, setIsMarkdownLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [debouncedIndex, setDebouncedIndex] = useState(0);

  const searchRef = useRef<HTMLInputElement | null>(null);

  /* Pagination constants */
  const PAGE_SIZE = 10;

  const previewRef = useRef<HTMLDivElement | null>(null);
  const fullViewRef = useRef<HTMLDivElement | null>(null);

  // menu item context
  const { setCurrentItem } = useMenuItem();
  const router = useRouter();

  // Fetch list of entries when component mounts or folder changes
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch(`/api/content/${folder}`);
        if (!res.ok) throw new Error("Failed to fetch entries");
        const data: EntryMeta[] = await res.json();
        setEntries(data);
        // Reset state when folder changes
        setSelectedIndex(0);
        setOpenEntry(null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEntries();
  }, [folder]);

  // Helper: current filtered entries based on search
  const filtered = entries.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.subtitle.toLowerCase().includes(q) ||
      e.date.includes(q)
    );
  });

  const pagesCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.floor(selectedIndex / PAGE_SIZE);
  const pageEntries = filtered.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE
  );

  // Prefetch full-view routes for visible entries
  useEffect(() => {
    pageEntries.forEach(e => {
      router.prefetch(`/${folder}/${encodeURIComponent(e.file)}`);
    });
  }, [pageEntries, router, folder]);

  // debounce selected index
  useEffect(() => {
    const t = setTimeout(() => setDebouncedIndex(selectedIndex), 150);
    return () => clearTimeout(t);
  }, [selectedIndex]);

  // keep status bar in sync
  useEffect(() => {
    const entry = filtered[debouncedIndex];
    if (entry) {
      setCurrentItem(entry.file);
    }
  }, [filtered, debouncedIndex, setCurrentItem]);

  // Ensure selectedIndex is always within filtered list bounds
  useEffect(() => {
    if (filtered.length === 0) return;
    if (selectedIndex >= filtered.length) {
      setSelectedIndex(0);
    }
  }, [filtered.length, selectedIndex]);

  // Fetch markdown for preview or full view when selection changes
  useEffect(() => {
    const entry = filtered[debouncedIndex];
    if (!entry) return;

    const loadContent = async () => {
      if (markdownCache[entry.file]) {
        setMarkdown(markdownCache[entry.file]);
        setIsMarkdownLoading(false);
        return;
      }
      try {
        setIsMarkdownLoading(true);
        const res = await fetch(
          `/api/content/${folder}/${encodeURIComponent(entry.file)}`
        );
        if (!res.ok) throw new Error("Failed to fetch content");
        const text = await res.text();
        setMarkdownCache(prev => ({ ...prev, [entry.file]: text }));
        setMarkdown(text);
      } catch (err) {
        console.error(err);
      } finally {
        setIsMarkdownLoading(false);
      }
    };
    // clear previous markdown so skeleton shows
    setMarkdown("");
    if (!openEntry || openEntry.file === entry.file) {
      loadContent();
    }
  }, [filtered, debouncedIndex, folder, openEntry]);

  // Focus search bar on `/`
  const focusSearch = useCallback(() => {
    searchRef.current?.focus();
  }, []);

  // Scroll helpers for full view
  const scrollFull = useCallback((delta: number) => {
    const el = fullViewRef.current;
    if (el) {
      el.scrollBy({ top: delta, behavior: "smooth" });
    } else {
      window.scrollBy({ top: delta, behavior: "smooth" });
    }
  }, []);

  const scrollPreview = useCallback((delta:number)=>{
    const el = previewRef.current;
    if(el){ el.scrollBy({top:delta,behavior:'smooth'}); }
  },[]);

  // Global keybindings
  const handler = (e: KeyboardEvent) => {
    // Ignore input/textarea interactions
    if (
      e.metaKey || e.ctrlKey || e.altKey ||
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      // Allow Esc to blur search field when inside inputs
      if (
        !e.metaKey && !e.ctrlKey && !e.altKey &&
        e.key === "Escape" && e.target === searchRef.current
      ) {
        (e.target as HTMLInputElement).blur();
      }
      return;
    }

    // Shared
    if (e.key === "/") {
      e.preventDefault();
      focusSearch();
      return;
    }

    // Page navigation with [ ]
    if (!openEntry) {
      if (e.key === "[") {
        e.preventDefault();
        if (currentPage > 0) {
          setSelectedIndex((currentPage - 1) * PAGE_SIZE);
        }
        return;
      }
      if (e.key === "]") {
        e.preventDefault();
        if (currentPage < pagesCount - 1) {
          setSelectedIndex(Math.min(filtered.length - 1, (currentPage + 1) * PAGE_SIZE));
        }
        return;
      }
    }

    // LIST / PREVIEW MODE
    if (!openEntry) {
      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            filtered.length === 0 ? 0 : Math.min(prev + 1, filtered.length - 1)
          );
          break;
        case "k":
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            filtered.length === 0 ? 0 : Math.max(prev - 1, 0)
          );
          break;
        case "Enter":
          if (filtered[selectedIndex]) {
            e.preventDefault();
            router.push(`/${folder}/${encodeURIComponent(filtered[selectedIndex].file)}`);
          }
          break;
        case "Escape":
          // Blur search if somehow focused elsewhere
          if (document.activeElement instanceof HTMLElement) {
            (document.activeElement as HTMLElement).blur();
          }
          break;
        case "d":
          e.preventDefault();
          scrollPreview(window.innerHeight * 0.8);
          break;
        case "u":
          e.preventDefault();
          scrollPreview(-window.innerHeight * 0.8);
          break;
      }
      return;
    }

    // FULL VIEW MODE
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpenEntry(null);
        // ensure list selection matches openEntry index in filtered list
        break;
      case "j":
      case "ArrowDown":
        e.preventDefault();
        scrollFull(40);
        break;
      case "k":
      case "ArrowUp":
        e.preventDefault();
        scrollFull(-40);
        break;
    }
  };

  useFilteredKeyDown(handler, [filtered, selectedIndex, openEntry, focusSearch, scrollFull, currentPage, pagesCount, router]);

  // Render list item
  const renderItem = (entry: EntryMeta, absoluteIdx: number) => {
    const isSelected = absoluteIdx === selectedIndex;
    return (
      <div
        key={entry.file}
        className={`telescope-item ${isSelected ? "telescope-item-selected" : ""}`}
        onMouseEnter={() => setSelectedIndex(absoluteIdx)}
        onClick={() => router.push(`/${folder}/${encodeURIComponent(entry.file)}`)}
      >
        <div className="overflow-hidden flex-1">
          <div className="telescope-item-title truncate">{entry.name}</div>
          <div className="telescope-item-sub truncate">{entry.subtitle}</div>
        </div>
        <span className="telescope-item-date" >
          {entry.date}
        </span>
      </div>
    );
  };

  // Main render
  if (openEntry) {
    return (
      <div className="h-full w-full overflow-y-auto p-8 border border-[var(--border-color)]" ref={fullViewRef}>
        <ReactMarkdown className="prose prose-invert max-w-none text-[var(--text-primary)]">
          {markdown}
        </ReactMarkdown>
        <div className="mt-4 text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
          Esc ↩ back
        </div>
      </div>
    );
  }

  const goPrevPage = () => {
    if (currentPage > 0) setSelectedIndex((currentPage - 1) * PAGE_SIZE);
  };
  const goNextPage = () => {
    if (currentPage < pagesCount - 1)
      setSelectedIndex(Math.min(filtered.length - 1, (currentPage + 1) * PAGE_SIZE));
  };

  return (
    <div className="telescope-container">
      {/* Left */}
      <div className="telescope-left">
        {/* Header */}
        <div className="telescope-header">
          <div className="telescope-search-wrapper flex-grow">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-3 w-3 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=""
                className="telescope-search pl-8"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              />
            </div>
            <span className="telescope-search-shortcut">
              <span className="shortcut-bracket">[</span>&nbsp;
              <span className="shortcut-key">{isSearchFocused ? 'Esc' : '/'}</span>&nbsp;
              <span className="shortcut-bracket">]</span>
            </span>
          </div>
          <span className="telescope-page-indicator desktop-only">
            {currentPage + 1}/{pagesCount}
          </span>
        </div>

        {/* mobile nav buttons */}
        <div className="flex items-center justify-between my-2 text-xs font-mono" style={{color:'var(--text-secondary)'}}>
          <button onClick={goPrevPage} disabled={currentPage===0} style={{opacity:currentPage===0?0.3:1}}>Prev</button>
          <span className="mobile-only">{currentPage+1}/{pagesCount}</span>
          <button onClick={goNextPage} disabled={currentPage===pagesCount-1} style={{opacity:currentPage===pagesCount-1?0.3:1}}>Next</button>
        </div>

        {/* List */}
        <div className="telescope-list custom-scrollbar">
          {entries.length === 0 && searchQuery === '' ? (
            <div className="space-y-2 w-full">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <Skeleton key={i} height="2rem" />
              ))}
            </div>
          ) : pageEntries.length === 0 ? (
            <div style={{ color: "var(--text-secondary)" }}>No matches</div>
          ) : (
            pageEntries.map((entry, idx) =>
              renderItem(entry, currentPage * PAGE_SIZE + idx)
            )
          )}
        </div>

        {/* Footer */}
        <div className="telescope-footer desktop-only">
          use&nbsp;
          <span className="shortcut-key">j</span>/<span className="shortcut-key">k</span>&nbsp;move&nbsp;•&nbsp;
          <span className="shortcut-key">Enter</span>&nbsp;open&nbsp;•&nbsp;
          <span className="shortcut-key">[</span>&nbsp;and&nbsp;<span className="shortcut-key">]</span>&nbsp;to navigate&nbsp;•&nbsp;
          <span className="shortcut-key">d</span>/<span className="shortcut-key">u</span>&nbsp;scroll
        </div>
      </div>

      {/* Right - preview */}
      <div className="desktop-only telescope-right" ref={previewRef}>
        {isMarkdownLoading || !markdown ? (
          <div className="space-y-2 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height="0.75rem" />
            ))}
          </div>
        ) : (
          <ReactMarkdown className="telescope-markdown">{markdown}</ReactMarkdown>
        )}
      </div>
    </div>
  );
} 
 
