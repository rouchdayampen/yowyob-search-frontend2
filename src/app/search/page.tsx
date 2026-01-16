/**
 * Search page with filters and pagination
 * @author Matteo Owona, Rouchda Yampen
 * @date 2024-12-07
 */

'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/search/search-bar';
import { SearchFilters, FilterValues } from '@/components/search/search-filters';
import { ResultCard } from '@/components/search/result-card';
import { Pagination } from '@/components/search/pagination';
import { CardSkeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { HeaderPublic } from '@/components/layout/header-public';
import { HeaderAuthenticated } from '@/components/layout/header-authenticated';
import { Footer } from '@/components/layout/footer';
import { httpClient } from '@/lib/api/http-client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';

// Results interface matching frontend requirements with backend data
interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'product' | 'service' | 'shop';
  category: string;
  city: string;
  rating: number;
  // UI specific fields that might be missing from backend
  images: string[];
  shop: {
    name: string;
    address: string;
  };
  tags: string[];
}

export default function SearchPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    type: 'all',
    sort_by: 'relevance',
    sort_order: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const ITEMS_PER_PAGE = 6;

  // Fetch results from API
  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filters.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString());
      if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString());
      if (filters.distance !== undefined) params.append('distance', filters.distance.toString());
      // Backend expects 'city' but frontend uses 'location' in some places, 
      // let's stick to what the SearchController expects for now or adapt if needed.

      const endpoint = `${API_ENDPOINTS.SEARCH}?${params.toString()}`;
      const response = await httpClient.get<any>(endpoint);

      if (response && response.success) {
        // Map backend DTO to frontend SearchResult
        let mappedResults = (response.results || []).map((item: any) => ({
          ...item,
          type: (item.type?.toLowerCase() === 'listing' ? 'product' : item.type?.toLowerCase()) || 'product',
          images: item.images || ['https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400'], // Default image
          shop: item.shop || { name: 'Commerçant local', address: item.city || 'Ville' },
          tags: item.tags || [item.category].filter(Boolean) || [],
        }));
        
        // Filtrer côté client par prix si nécessaire
        if (filters.min_price !== undefined) {
          mappedResults = mappedResults.filter(item => item.price >= filters.min_price);
        }
        if (filters.max_price !== undefined) {
          mappedResults = mappedResults.filter(item => item.price <= filters.max_price);
        }
        
        // Appliquer le tri
        if (filters.sort_by === 'price') {
          mappedResults.sort((a, b) => filters.sort_order === 'asc' ? (a.price || 0) - (b.price || 0) : (b.price || 0) - (a.price || 0));
        }
        
        setResults(mappedResults);
      }
    } catch (error) {
      console.error('❌ Error fetching search results:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasSearched) {
      fetchResults();
    }
  }, [query, filters, currentPage]);

  // Charger les résultats par défaut au montage
  useEffect(() => {
    setHasSearched(true);
    fetchResults();
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
    setHasSearched(true);
  };

  const handleApplyFilters = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination local logic (since backend doesn't seem to have it yet in this version)
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {session ? (
        <HeaderAuthenticated userName={session.user?.name || undefined} />
      ) : (
        <HeaderPublic />
      )}
      <div className="min-h-screen py-8 px-4 md:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              defaultValue={query}
              showSuggestions
              onSearch={handleSearch}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <SearchFilters
                onApplyFilters={handleApplyFilters}
                defaultFilters={filters}
              />
            </aside>

            {/* Results */}
            <main className="lg:col-span-3">
              {/* Results Count */}
              {hasSearched && !isLoading && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {results.length} résultat{results.length > 1 ? 's' : ''} trouvé
                    {results.length > 1 ? 's' : ''}
                  </h2>
                  {query && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Recherche : &quot;{query}&quot;</p>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* No Search Yet */}
              {!hasSearched && !isLoading && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Commencez votre recherche
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Utilisez la barre de recherche pour trouver des produits et services
                  </p>
                </div>
              )}

              {/* No Results */}
              {hasSearched && !isLoading && results.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <li>✓ Vérifiez l&apos;orthographe des mots</li>
                    <li>✓ Essayez des termes plus généraux</li>
                    <li>✓ Élargissez les filtres de prix</li>
                  </ul>
                </div>
              )}

              {/* Results Grid */}
              {hasSearched && !isLoading && paginatedResults.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {paginatedResults.map((item) => (
                      <ResultCard
                        key={item.id}
                        item={item}
                        onClick={(id) => {
                          window.location.href = `/products/${id}`;
                        }}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        current_page={currentPage}
                        total_pages={totalPages}
                        on_page_change={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}