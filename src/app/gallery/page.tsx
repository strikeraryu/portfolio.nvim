'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import config from '../../../config.json';
import Skeleton from '../components/Skeleton';

interface Photo {
  id: number;
  filename: string;
  width: number;
  height: number;
  story?: string;
}

export default function GalleryPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [stories, setStories] = useState<{ [key: string]: string }>({});
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());
  const loadingRef = useRef(false);
  // Pagination constants
  const PHOTOS_PER_PAGE = 12;

  // Helper to map filenames returned from API to Photo objects
  const mapFilesToPhotos = (files: string[], startIndex: number): Photo[] => {
    return files.map((filename, idx) => {
      // Generate varied but realistic aspect ratios (same as before)
      const ratios = [
        { width: 1920, height: 1080 }, // 16:9 landscape
        { width: 1080, height: 1920 }, // 9:16 portrait
        { width: 1600, height: 1200 }, // 4:3 landscape
        { width: 1200, height: 1600 }, // 3:4 portrait
        { width: 1920, height: 1280 }, // 3:2 landscape
        { width: 1080, height: 1440 }, // 3:4 portrait
      ];
      const ratio = ratios[(startIndex + idx) % ratios.length];

      return {
        id: startIndex + idx + 1, // ensure unique id across pages
        filename,
        width: ratio.width,
        height: ratio.height,
      };
    });
  };

  // Reset loading state when component mounts
  useEffect(() => {
    // Always reset loading state on mount (whether fresh or navigation)
    setIsInitialLoading(true);
    setIsMounted(false);
    setDisplayedPhotos([]);
    setStories({});
    setSelectedImage(null);
    setCurrentPage(0);
    setHasMore(true);
    setIsLoading(false);
    loadingRef.current = false;
    
    // Small delay to ensure loading shows before starting data fetch
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs on every mount

  // Load initial page of images
  useEffect(() => {
    if (!isMounted) return;

    const loadInitial = async () => {
      await fetchPage(0);
      setIsInitialLoading(false);
    };

    loadInitial();
  }, [isMounted]);

  // Generic page fetcher
  const fetchPage = async (page: number) => {
    const offset = page * PHOTOS_PER_PAGE;
    try {
      const res = await fetch(`/api/content/gallery/images?offset=${offset}&limit=${PHOTOS_PER_PAGE}`);
      if (!res.ok) return;
      const data = await res.json();
      const files: string[] = data.files;
      const pagePhotos = mapFilesToPhotos(files, offset);

      setDisplayedPhotos((prev) => [...prev, ...pagePhotos]);
      setHasMore(data.hasMore);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch gallery images', err);
      setHasMore(false);
    }
  };

  // Load more photos function
  const loadMorePhotos = useCallback(async () => {
    if (isLoading || !hasMore || loadingRef.current) return;

    loadingRef.current = true;
    setIsLoading(true);

    const nextPage = currentPage + 1;
    await fetchPage(nextPage);

    setIsLoading(false);
    loadingRef.current = false;
  }, [isLoading, hasMore, currentPage]);



  // Add scroll listener for infinite scroll
  useEffect(() => {
    const scrollHandler = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePhotos();
      }
    };

    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [loadMorePhotos]);

  // Load stories from markdown files - only for displayed photos
  useEffect(() => {
    if (displayedPhotos.length === 0) return;
    
    const loadStories = async () => {
      const newStories: { [key: string]: string } = {};
      
      for (const photo of displayedPhotos) {
        const imageName = photo.filename.replace(/\.[^/.]+$/, ""); // Remove extension
        
        // Skip if story already loaded
        if (stories[imageName] !== undefined) continue;
        
        try {
          const response = await fetch(`/api/content/gallery/story/${encodeURIComponent(imageName)}`);
          if (response.ok) {
            const storyContent = await response.text();
            newStories[imageName] = storyContent;
          } else {
            newStories[imageName] = ''; // Empty fallback
          }
        } catch (error) {
          newStories[imageName] = ''; // Empty fallback
        }
      }
      
      // Only update if we have new stories
      if (Object.keys(newStories).length > 0) {
        setStories(prev => ({ ...prev, ...newStories }));
      }
    };

    loadStories();
  }, [displayedPhotos]);

  // Enhanced markdown renderer for long stories
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-accent); font-weight: bold;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color: var(--text-info); font-style: italic;">$1</em>')
      .replace(/\n\n/g, '</p><p style="margin-bottom: 1rem;">')
      .replace(/\n/g, '<br/>')
      .replace(/^/, '<p style="margin-bottom: 1rem;">')
      .replace(/$/, '</p>');
  };

  // Calculate image dimensions for grid based on screen size
  const getImageDimensions = (photo: Photo) => {
    const aspectRatio = photo.width / photo.height;
    
    // Use measured windowWidth so that server-rendered HTML matches
    // the very first client render (windowWidth === 0 before it is
    // measured inside useEffect). This prevents hydration warnings
    // that occurred when `window` was accessed during render.
    const getBaseHeight = () => {
      // Before the client has measured the width we default to the
      // desktop base height so that both server and first client
      // render are identical.
      if (windowWidth === 0) return 300;

      if (windowWidth < 480) return 150;      // Mobile
      if (windowWidth < 768) return 200;      // Small tablet
      if (windowWidth < 1024) return 250;     // Tablet

      return 300;                             // Desktop
    };
    
    const baseHeight = getBaseHeight();
    const width = baseHeight * aspectRatio;
    
    return { width: width, height: baseHeight };
  };

  const openImage = (photo: Photo) => {
    setSelectedImage(photo);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };



  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle keyboard shortcuts when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    // When modal is open, handle all keyboard events
    if (selectedImage) {
      // Always prevent default scrolling behavior when modal is open
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (scrollKeys.includes(e.key) || e.key.toLowerCase() === 'j' || e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'd' || e.key.toLowerCase() === 'u') {
        e.preventDefault();
        e.stopPropagation();
      }
      
      if (e.key === 'Escape') {
        closeImage();
        return;
      }
      // J/K for small scrolling in story - using direct scroll for modal content
      else if (e.key.toLowerCase() === 'j') {
        const storyElement = document.querySelector('.story-scroll');
        if (storyElement) {
          storyElement.scrollBy(0, 40);
        }
        return;
      }
      else if (e.key.toLowerCase() === 'k') {
        const storyElement = document.querySelector('.story-scroll');
        if (storyElement) {
          storyElement.scrollBy(0, -40);
        }
        return;
      }
      // D/U for page down/up in story - using direct scroll for modal content
      else if (e.key.toLowerCase() === 'd') {
        const storyElement = document.querySelector('.story-scroll');
        if (storyElement) {
          storyElement.scrollBy(0, storyElement.clientHeight * 0.8);
        }
        return;
      }
      else if (e.key.toLowerCase() === 'u') {
        const storyElement = document.querySelector('.story-scroll');
        if (storyElement) {
          storyElement.scrollBy(0, -storyElement.clientHeight * 0.8);
        }
        return;
      }
    } else {
      // When no modal is open, handle only scroll shortcuts (let navigation shortcuts pass through)
      const key = e.key.toLowerCase();
      
      // Only handle scroll shortcuts, let navigation shortcuts (h, b, n, w, p, a, x, l, t, q) pass through
      const scrollShortcuts = ['j', 'k', 'd', 'u'];
      
      if (scrollShortcuts.includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        
        // J/K for small scrolling - Direct scrolling like arrow keys
        if (key === 'j') {
          window.scrollBy(0, 100);
          return;
        }
        
        if (key === 'k') {
          window.scrollBy(0, -100);
          return;
        }
        
        // D/U for page down/up - Direct scrolling like page keys
        if (key === 'd') {
          window.scrollBy(0, window.innerHeight * 0.8);
          return;
        }
        
        if (key === 'u') {
          window.scrollBy(0, -window.innerHeight * 0.8);
          return;
        }
      }
      
      // Let all other keys (including navigation shortcuts) pass through to global handlers
    }
  }, [selectedImage]);

  const handleWheel = useCallback((e: WheelEvent) => {
    // Prevent background scrolling when modal is open
    if (selectedImage) {
      // Allow scrolling only if it's happening within the story scroll container
      const target = e.target as HTMLElement;
      const storyScrollContainer = document.querySelector('.story-scroll');
      
      if (storyScrollContainer && storyScrollContainer.contains(target)) {
        // Allow scrolling within the story container
        return;
      }
      
      // Prevent scrolling everywhere else
      e.preventDefault();
      e.stopPropagation();
    }
  }, [selectedImage]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Prevent background scrolling when modal is open
    if (selectedImage) {
      const target = e.target as HTMLElement;
      const storyScrollContainer = document.querySelector('.story-scroll');
      
      if (storyScrollContainer && storyScrollContainer.contains(target)) {
        // Allow scrolling within the story container
        return;
      }
      
      // Prevent scrolling everywhere else
      e.preventDefault();
    }
  }, [selectedImage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [selectedImage]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);



  // Handle window resize for responsive dimensions
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    setWindowWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup on unmount to prevent navigation delays
  useEffect(() => {
    return () => {
      // Clear any pending timeouts
      setIsLoading(false);
      setIsInitialLoading(false);
      setIsMounted(false);
      loadingRef.current = false;
      // Clear state to prevent memory leaks
      setDisplayedPhotos([]);
      setStories({});
      setSelectedImage(null);
    };
  }, []);

  return (
    <div>
      <PageHeader />
    <div className="page-content">
        <div className="max-w-7xl mx-auto">
          {/* Instruction Text */}
          <div className="text-left" style={{ 
            marginBottom: '0.5rem',
            position: 'relative',
            zIndex: 10,
            display: 'block',
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            padding: '0.5rem 0'
          }}>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Click to <span style={{ color: 'var(--text-primary)' }}>Expand</span> and check <span style={{ color: 'var(--text-primary)' }}>Story</span> behind it
            </div>
      </div>

          {/* Initial Loading */}
          {(isInitialLoading || !isMounted) ? (
            <div 
              className="flex flex-col items-center justify-center min-h-[500px]"
              style={{
                animation: 'fadeIn 0.3s ease-in-out',
                position: 'relative',
                zIndex: 10
              }}
            >
              <div className="mb-6">
                <div 
                  className="w-16 h-16 border-3 rounded-full animate-spin"
                  style={{
                    borderColor: 'var(--text-secondary)',
                    borderTopColor: 'var(--text-primary)',
                    borderWidth: '3px'
                  }}
                ></div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                  Loading Gallery
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Preparing your visual journey...
                </div>
              </div>
            </div>
          ) : (
            /* Photo Grid */
            <div className="photo-grid" style={{ 
              opacity: isInitialLoading ? 0 : 1,
              transition: 'opacity 0.5s ease-in-out',
              position: 'relative',
              zIndex: 0,
              marginTop: '2rem'
            }}>
              {displayedPhotos.map((photo) => {
              const dimensions = getImageDimensions(photo);
              const imageName = photo.filename.replace(/\.[^/.]+$/, "");
              
              return (
            <div
              key={photo.id}
                  className="photo-item"
                  style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    minWidth: `${dimensions.width}px`,
                    minHeight: `${dimensions.height}px`,
                  }}

                  onClick={() => openImage(photo)}
                >
                  {/* Skeleton until loaded */}
                  {!loadedIds.has(photo.id) && (
                    <Skeleton height="100%" width="100%" className="absolute inset-0" />
                  )}

                  <img
                    src={`/api/content/gallery/thumb?filename=${encodeURIComponent(photo.filename)}&w=${Math.round(dimensions.width)}`}
                    alt={imageName}
                    className="photo-image"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      opacity: loadedIds.has(photo.id) ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                    onLoad={() => setLoadedIds((prev) => new Set(prev).add(photo.id))}
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = 'flex';
                        fallback.classList.remove('hidden');
                      }
                    }}
                  />
                  {/* Fallback content - hidden by default */}
                  <div className="photo-fallback hidden" style={{
                    width: '100%',
                    height: '100%',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-secondary)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}>
                <div className="text-center">
                      <div className="text-2xl mb-2">📸</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {photo.filename}
                  </div>
                    </div>
                  </div>


                </div>
              );
                          })}
              </div>
          )}

          {/* Loading Indicator */}
          {isLoading && !isInitialLoading && (
            <div className="text-center mt-8">
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Loading more photos...
              </div>
            </div>
          )}

                    {/* Load More Button (fallback if infinite scroll doesn't work) */}
          {!isLoading && !isInitialLoading && hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMorePhotos}
                className="px-6 py-3 border border-gray-600 rounded hover:bg-gray-800 transition-colors"
                style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              >
                Load More Photos
              </button>
        </div>
          )}

        {/* Stats */}
          {!isInitialLoading && (
        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Showing:</span>
                  <span className="ml-2 px-2 py-1 bg-black rounded text-xs">
                    {displayedPhotos.length}
              </span>
            </div>
          </div>
        </div>
          )}
      </div>

        {/* Expanded Image Modal */}
      {selectedImage && (
        <div
            className="fixed inset-0 flex items-center justify-center p-4"
          onClick={closeImage}
            style={{ 
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh'
            }}
        >
            <div className="relative w-full h-full flex flex-col md:flex-row">
            <button
              onClick={closeImage}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  zIndex: 10000,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
            >
              ✕
            </button>
              
              {/* Image on the left */}
              <div 
                className="w-full md:flex-1 flex items-center justify-center p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={`/api/content/gallery/${encodeURIComponent(selectedImage.filename)}`}
                  alt={selectedImage.filename}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Story on the right */}
              <div 
                className="w-full md:flex-1 p-6 flex flex-col justify-center"
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  paddingTop: windowWidth < 768 ? '20px' : '80px',
                  paddingRight: windowWidth < 768 ? '20px' : '80px',
                  paddingLeft: windowWidth < 768 ? '20px' : '40px'
                }}
              >
                <div
                  className="w-full flex items-center justify-center"
                  style={{
                    height: windowWidth < 768 ? 'auto' : '65%',
                    maxHeight: windowWidth < 768 ? '60vh' : 'auto'
                  }}
                >
                  <div 
                    className="story-scroll w-full h-full overflow-y-auto bg-opacity-60 rounded-lg p-8 relative"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
                      maxHeight: windowWidth < 768 ? '60vh' : 'none'
                    }}
                  >
                    <div 
                      className="text-sm leading-relaxed text-left"
                      style={{ 
                        color: 'var(--text-primary)',
                        lineHeight: '1.7',
                        fontSize: '14px',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: stories[selectedImage.filename.replace(/\.[^/.]+$/, "")] === undefined
                          ? ''
                          : renderMarkdown(stories[selectedImage.filename.replace(/\.[^/.]+$/, "")] || "It seems I was too lazy to add a story to this.") 
                      }}
                    />

                    {stories[selectedImage.filename.replace(/\.[^/.]+$/, "")] === undefined && (
                      <div className="space-y-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Skeleton key={i} height="0.7rem" />
                        ))}
                      </div>
                    )}

                  </div>
              </div>
              </div>
              

            </div>
          </div>
        )}
        </div>

      <style jsx>{`
        .photo-grid {
          display: flex;
          flex-wrap: wrap;
          gap: ${config.gallery.gridGap}px;
          justify-content: center;
          align-items: flex-start;
          position: relative;
          z-index: 0;
          clear: both;
          margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
          .photo-grid {
            gap: ${Math.max(config.gallery.gridGap - 5, 10)}px;
          }
        }
        
        @media (max-width: 480px) {
          .photo-grid {
            gap: ${Math.max(config.gallery.gridGap - 10, 5)}px;
          }
        }
        
        .photo-item {
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease;
          overflow: hidden;
          flex-shrink: 0;
          ${config.gallery.enableFloatAnimation ? 'animation: float 6s ease-in-out infinite;' : ''}
        }
        
        .photo-item:hover {
          transform: translateY(-5px) scale(1.02);
        }
        
        .photo-item:nth-child(2n) {
          animation-delay: -2s;
        }
        
        .photo-item:nth-child(3n) {
          animation-delay: -4s;
        }
        
        .photo-item:nth-child(4n) {
          animation-delay: -1s;
        }
        
        .photo-item:nth-child(5n) {
          animation-delay: -3s;
        }
        
        .photo-image {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: box-shadow 0.3s ease;
        }
        
        .photo-item:hover .photo-image {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
        }
        

        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .hidden {
          display: none !important;
        }
        
        .photo-image {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin: 0;
          padding: 0;
          border: none;
          outline: none;
        }
        
        /* Custom scrollbar styles for story overlay */
        .story-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .story-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .story-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .story-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
} 
