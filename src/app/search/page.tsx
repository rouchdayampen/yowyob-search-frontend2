/**
 * Search page with tabs and split view
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
import { ResultListItem } from '@/components/search/result-list-item';
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

  // Sync query with URL
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  // Fetch results
  const fetchResults = async () => {
    setIsLoading(true);
    try {
      // Build filters based on activeTab if needed
      let typeFilter: string | undefined = activeTab === 'all' || activeTab === 'map' ? undefined : activeTab;
      // map 'products' tab to 'product' type if needed, strict mapping might strictly require 'product'
      if (typeFilter === 'products') typeFilter = 'product';

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
        // Fallback to mock
        setResults(MOCK_RESULTS as unknown as SearchResult[]);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults(MOCK_RESULTS as unknown as SearchResult[]);
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (results.length === 0 && hasSearched) {
      return (
        <div className="text-center py-20">
          <h3 className="text-xl text-gray-600">Aucun résultat trouvé pour &quot;{query}&quot;</h3>
        </div>
      );
    }

    if (activeTab === 'map') {
      return (
        <div className="h-[calc(100vh-200px)] w-full">
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
      );
    }

    if (activeTab === 'all') {
      return (
        <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
          {/* List View Left */}
          <div className="w-full lg:w-[60%] lg:overflow-y-auto lg:h-[calc(100vh-220px)] custom-scrollbar pr-2">
            <div className="p-4 border-b border-gray-100">
              <p className="text-gray-500">{results.length} results found</p>
            </div>
            <div>
              {results.map(item => (
                <ResultListItem
                  key={item.id}
                  item={item}
                  onClick={() => router.push(`/products/${item.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Map View Right */}
          <div className="hidden lg:block w-[40%] pl-4 h-[calc(100vh-220px)] sticky top-0">
            <MapContainer
              markers={results.map(r => ({
                id: r.id,
                position: [r.location?.lat || 3.848, r.location?.lng || 11.5021],
                title: r.name
              }))}
              className="w-full h-full rounded-xl"
            />
          </div>
        </div>
      );
    }

    // Grid View for Shop, Services, Products
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((item) => (
            <ResultCard
              key={item.id}
              item={item}
              onClick={(id) => router.push(`/products/${id}`)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {session ? (
        <HeaderAuthenticated userName={session.user?.name || undefined} />
      ) : (
        <HeaderPublic />
      )}

      {/* Main Search Header Section */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="max-w-3xl">
            <SearchBar
              defaultValue={query}
              onSearch={handleSearch}
              showSuggestions={false}
              className="shadow-none border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      <div className="flex-1 max-w-[1920px] mx-auto w-full">
        {renderContent()}
      </div>

    </div>
  );
}