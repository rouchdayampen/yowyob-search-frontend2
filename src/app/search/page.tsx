/**
 * Search page with tabs and toggle map
 * @author Matteo Owona, Rouchda Yampen
 * @date 2024-12-07
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SearchBar } from '@/components/search/search-bar';
import { ResultCard } from '@/components/search/result-card';
import { CardSkeleton } from '@/components/ui/skeleton';
import { HeaderPublic } from '@/components/layout/header-public';
import { HeaderAuthenticated } from '@/components/layout/header-authenticated';

import { httpClient } from '@/lib/api/http-client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { MOCK_RESULTS } from './mock-data';
import { SearchTabs, SearchTab } from '@/components/search/search-tabs';
import { MapContainer } from '@/components/map/map-container';

// Results interface matching frontend requirements with backend data
export interface SearchResult {
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
  location: {
    lat: number;
    lng: number;
  };
  tags: string[];
}

export default function SearchPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Sync query with URL
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    setQuery(urlQuery);
  }, [searchParams]);

  // Fetch results
  const fetchResults = async () => {
    setIsLoading(true);
    try {
      // Build filters based on activeTab if needed
      let typeFilter: string | undefined = activeTab === 'all' ? undefined : activeTab;
      // map 'products' tab to 'product' type, 'services' to 'service'
      if (typeFilter === 'products') typeFilter = 'product';
      if (typeFilter === 'services') typeFilter = 'service';

      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (typeFilter) params.append('type', typeFilter);

      const endpoint = `${API_ENDPOINTS.SEARCH}?${params.toString()}`;
      // Simulate API delay or fetch
      const response = await httpClient.get<any>(endpoint);

      if (response && response.success) {
        let mappedResults = (response.results || []).map((item: any) => ({
          ...item,
          type: (item.type?.toLowerCase() === 'listing' ? 'product' : item.type?.toLowerCase()) || 'product',
          images: item.images || ['https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400'], // Default image
          shop: item.shop || { name: 'Commerçant local', address: item.city || 'Yaoundé' },
          location: item.location || { lat: 3.8480, lng: 11.5021 },
          tags: item.tags || [item.category].filter(Boolean) || [],
        }));
        setResults(mappedResults);
      } else {
        // Fallback to mock with filtering
        let filteredMockResults = MOCK_RESULTS as unknown as SearchResult[];

        // Apply type filter to mock results
        if (typeFilter) {
          filteredMockResults = filteredMockResults.filter(item => item.type === typeFilter);
        }

        // Apply search query filter if exists
        if (query) {
          const lowerQuery = query.toLowerCase();
          filteredMockResults = filteredMockResults.filter(item =>
            item.name.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery) ||
            item.category.toLowerCase().includes(lowerQuery) ||
            item.shop.name.toLowerCase().includes(lowerQuery)
          );
        }

        setResults(filteredMockResults);
      }
    } catch (error) {
      console.error('Error fetching results:', error);

      // Fallback to mock with filtering
      let filteredMockResults = MOCK_RESULTS as unknown as SearchResult[];

      // Build type filter
      let typeFilter: string | undefined = activeTab === 'all' ? undefined : activeTab;
      if (typeFilter === 'products') typeFilter = 'product';
      if (typeFilter === 'services') typeFilter = 'service';

      // Apply type filter
      if (typeFilter) {
        filteredMockResults = filteredMockResults.filter(item => item.type === typeFilter);
      }

      // Apply search query filter if exists
      if (query) {
        const lowerQuery = query.toLowerCase();
        filteredMockResults = filteredMockResults.filter(item =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery) ||
          item.shop.name.toLowerCase().includes(lowerQuery)
        );
      }

      setResults(filteredMockResults);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeTab]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <>
      {session ? (
        <HeaderAuthenticated userName={session.user?.name || undefined} />
      ) : (
        <HeaderPublic />
      )}

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              defaultValue={query}
              onSearch={handleSearch}
              showSuggestions={true}
            />
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <SearchTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Toggle Map Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              {showMap ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Retirer la carte
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Afficher sur la carte
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 && hasSearched ? (
            <div className="text-center py-20">
              <h3 className="text-xl text-gray-600 dark:text-gray-400">Aucun résultat trouvé pour &quot;{query}&quot;</h3>
            </div>
          ) : showMap ? (
            // Layout with map: 2 columns + map sidebar
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {results.map((item) => (
                    <ResultCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-[500px] xl:w-[600px] flex-shrink-0">
                <div className="sticky top-24 h-[calc(100vh-200px)] rounded-3xl overflow-hidden shadow-2xl">
                  <MapContainer
                    markers={results.map(r => ({
                      id: r.id,
                      position: [r.location?.lat || 3.848, r.location?.lng || 11.5021],
                      title: r.name,
                      description: r.description
                    }))}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            // Layout without map: 4 columns
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((item) => (
                <ResultCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}