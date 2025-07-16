'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import PageHeader from '../../components/PageHeader';
import config from '../../../config.json';
import { Pin, Folder, Search } from 'lucide-react';
import { useMenuItem } from '../components/MenuItemContext';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  archived: boolean;
  fork: boolean;
}

// Cast to any to satisfy TypeScript when react-window types aren’t present in Next.js runtime
const FixedSizeList: any = dynamic(() => import('react-window').then((m: any) => m.FixedSizeList as any), { ssr: false });

export default function ProjectsPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [pinnedRepos, setPinnedRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const reposPerPage = 6;
  const { setCurrentItem } = useMenuItem();

  const githubUsername = config.personal.github;

  // Fetch pinned repositories
  const fetchPinnedRepos = async () => {
    try {
      setRateLimitError(false);
      const response = await fetch(
        `https://api.github.com/search/repositories?q=user:${githubUsername}&sort=stars&order=desc&per_page=6`
      );
      if (response.status === 403) {
        setRateLimitError(true);
        setPinnedRepos([]);
        return;
      }
      const data = await response.json();
      // The search API returns { items: [...] }
      if (Array.isArray(data.items)) {
        setPinnedRepos(data.items.filter((repo: GitHubRepo) => !repo.fork && !repo.archived));
      } else {
        setPinnedRepos([]);
      }
    } catch (error) {
      console.error('Error fetching pinned repos:', error);
      setPinnedRepos([]);
    }
  };

  // Fetch all repositories
  const fetchRepos = async (page: number = 1, query: string = '') => {
    try {
      setLoading(true);
      setRateLimitError(false);
      let url = '';
      
      if (query) {
        url = `https://api.github.com/search/repositories?q=user:${githubUsername}+${encodeURIComponent(query)}&sort=updated&per_page=${reposPerPage}&page=${page}`;
      } else {
        url = `https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=${reposPerPage}&page=${page}`;
      }

      const response = await fetch(url);
      if (response.status === 403) {
        setRateLimitError(true);
        setRepos([]);
        setTotalPages(1);
        return;
      }
      const data = await response.json();
      
      if (query) {
        setRepos(data.items || []);
        setTotalPages(Math.ceil((data.total_count || 0) / reposPerPage));
      } else {
        setRepos(data);
        const totalResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (totalResponse.status === 403) {
          setRateLimitError(true);
          setTotalPages(1);
          return;
        }
        const userData = await totalResponse.json();
        setTotalPages(Math.ceil(userData.public_repos / reposPerPage));
      }
    } catch (error) {
      console.error('Error fetching repos:', error);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
    setIsSearching(debouncedQuery.length > 0);
    fetchRepos(1, debouncedQuery);
  }, [debouncedQuery]);

  // Handle search input change
  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
  };

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchRepos(page, searchQuery);
    }
  };

  // Open repository
  const openRepo = (url: string) => {
    window.open(url, '_blank');
  };

  useEffect(() => {
    fetchPinnedRepos();
    fetchRepos(1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case '[':
          e.preventDefault();
          goToPage(currentPage - 1);
          break;
        case ']':
          e.preventDefault();
          goToPage(currentPage + 1);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          e.preventDefault();
          const index = parseInt(e.key) - 1;
          if (pinnedRepos[index]) {
            openRepo(pinnedRepos[index].html_url);
          }
          break;
        case 'Escape':
          if (searchQuery) {
            setSearchQuery('');
            setIsSearching(false);
            setCurrentPage(1);
            fetchRepos(1);
            if (searchInputRef.current) {
              searchInputRef.current.value = '';
              searchInputRef.current.blur();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, pinnedRepos, searchQuery]);

  // Use the UTC timezone so that the string is identical on the server
  // and on every client, preventing hydration mismatches that can occur
  // when the viewer’s locale is ahead/behind the server.
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#fa7343',
      Kotlin: '#A97BFF',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Shell: '#89e051',
      HTML: '#e34c26',
      CSS: '#1572B6',
      Vue: '#4FC08D',
      React: '#61DAFB'
    };
    return colors[language] || 'var(--text-accent)';
  };

  return (
    <div>
      <PageHeader />
      <div className="page-content">
        <div className="max-w-6xl mx-auto">

          {/* Page Info and Search */}
          <div className="flex justify-between items-center mb-6 flex-col-lg-row">
            <div className="flex items-center space-x-4">
              <div className="telescope-search-wrapper" style={{ width: '20rem' }}>
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-3 w-3 pointer-events-none" />

                  <input
                    id="telescope-search-input"
                    ref={searchInputRef}
                    type="text"
                    placeholder=""
                    className="telescope-search"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.currentTarget.blur();
                      }
                    }}
                  />

                </div>
            <span className="telescope-search-shortcut"><span className="shortcut-bracket">[</span>&nbsp;<span className="shortcut-key">{isSearchFocused ? 'Esc' : '/'}</span>&nbsp;<span className="shortcut-bracket">]</span></span>
          </div>
              {isSearching && (
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Searching for "{searchQuery}"
                </span>
              )}
        </div>

              {/* Desktop page indicator & shortcut hint */}
              <div className="text-sm font-mono desktop-only" style={{ color: 'var(--text-secondary)' }}>
                <div className="text-xs mt-1 shortcut-hint">
                  Use <span style={{ color: 'var(--text-primary)' }}>[</span> and <span style={{ color: 'var(--text-primary)' }}>]</span> to navigate
                </div>
              </div>
            </div>

            {/* Pagination nav buttons */}
            <div className="w-full flex justify-between mt-3 text-xs font-mono mb-4" style={{ color: 'var(--text-secondary)' }}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.3 : 1 }}
              >
                Prev
              </button>
              <span >
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.3 : 1 }}
              >
                Next
              </button>
            </div>
          </div>

          {/* Pinned Projects - Only show on first page and when not searching */}
          {currentPage === 1 && !isSearching && (
        <div className="mb-12">
          <h2 className="text-xl mb-6 flex items-center" style={{ color: 'var(--text-accent)' }}>
                <Pin className="mr-2 w-5 h-5" />
                Pinned Repositories
          </h2>
              {rateLimitError ? (
                <div className="text-center py-8 text-l font-mono animate-pulse" style={{ color: 'var(--text-accent)' }}>
                  Stop spamming please!<br/>GitHub is watching you
                </div>
              ) : pinnedRepos.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                  Loading pinned repositories...
                </div>
              ) : (
                <div className="pinned-repos grid grid-cols-2" onMouseLeave={() => setCurrentItem(null)}>
                  {pinnedRepos.map((repo, index) => (
                    <div 
                      key={repo.id} 
                      className="card cursor-pointer transition-all duration-200 hover:scale-105 !mb-0"
                      style={{ 
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        marginBottom: 0
                      }}
                      onClick={() => openRepo(repo.html_url)}
                      onMouseEnter={() => setCurrentItem(repo.name)}
                    >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-accent)' }}>
                          {repo.name}
                  </h3>
                        <span 
                          className="px-2 py-1 rounded text-xs font-mono"
                          style={{ 
                            color: 'var(--text-primary)'
                          }}
                        >
                          {index + 1}
                  </span>
                </div>
                <p className="project-desc text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                        {repo.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                          {repo.language && (
                    <span className="flex items-center">
                              <span 
                                className="w-3 h-3 rounded-full mr-1"
                                  style={{ backgroundColor: getLanguageColor(repo.language), marginRight: '0.25rem' }}
                              ></span>
                              {repo.language}
                    </span>
                          )}
                        </div>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {formatDate(repo.updated_at)}
                    </span>
                  </div>
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-1 rounded text-xs"
                              style={{ 
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-info)'
                              }}
                            >
                              {topic}
                            </span>
                          ))}
                          {repo.topics.length > 3 && (
                            <span
                              className="px-2 py-1 rounded text-xs"
                              style={{ 
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              +{repo.topics.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Repositories */}
          <div className="mb-8">
            <h2 className="text-xl mb-6 flex items-center justify-between" style={{ color: 'var(--text-accent)' }}>
              <span className="flex items-center">
                <Folder className="mr-2 w-5 h-5" />
                {isSearching ? 'Search Results' : 'All Repositories'}
              </span>
            </h2>
            
            {rateLimitError ? (
                <div className="text-center py-8 text-l font-mono animate-pulse" style={{ color: 'var(--text-accent)' }}>
                  Stop spamming please!<br/>GitHub is watching you
                </div>
            ) : loading ? (
              <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                Loading repositories...
              </div>
            ) : repos.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                No repositories found.
          </div>
            ) : (
              <div className="all-repos" onMouseLeave={() => setCurrentItem(null)}>
                {repos.length > 20 && FixedSizeList ? (
                  <FixedSizeList
                    height={600}
                    itemCount={repos.length}
                    itemSize={220}
                    width="100%"
                  >
                    {(row: any) => {
                      const { index, style } = row;
                      const repo = repos[index];
                      return (
                        <div style={style} key={repo.id}>
                          <div
                            className="card cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                            onClick={() => openRepo(repo.html_url)}
                            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                            onMouseEnter={() => setCurrentItem(repo.name)}
                          >
                            {/* repo card content extracted to component for reuse */}
                            <RepoCard repo={repo} />
                          </div>
                        </div>
                      );
                    }}
                  </FixedSizeList>
                ) : (
                  repos.map((repo) => (
                    <div
                      key={repo.id}
                      className="card cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      onClick={() => openRepo(repo.html_url)}
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                      onMouseEnter={() => setCurrentItem(repo.name)}
                    >
                      <RepoCard repo={repo} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>


        </div>
      </div>
  );
} 

// Extracted repo card markup so we can reuse inside list row
function RepoCard({ repo }: { repo: GitHubRepo }) {
  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#fa7343',
      Kotlin: '#A97BFF',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Shell: '#89e051',
      HTML: '#e34c26',
      CSS: '#1572B6',
      Vue: '#4FC08D',
      React: '#61DAFB',
    };
    return colors[language] || 'var(--text-accent)';
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-semibold mr-3" style={{ color: 'var(--text-accent)' }}>
            {repo.name}
          </h3>
          {repo.archived && (
            <span
              className="px-2 py-1 rounded text-xs ml-2"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-error)' }}
            >
              Archived
            </span>
          )}
        </div>
        <p className="project-desc text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          {repo.description || 'No description available'}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {repo.language && (
              <span className="flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: getLanguageColor(repo.language), marginRight: '0.25rem' }}
                ></span>
                {repo.language}
              </span>
            )}
          </div>
          <span style={{ color: 'var(--text-secondary)' }}>
            {new Date(repo.updated_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: 'UTC',
            })}
          </span>
        </div>
        {repo.topics && repo.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {repo.topics.map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 rounded text-xs"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-info)' }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
