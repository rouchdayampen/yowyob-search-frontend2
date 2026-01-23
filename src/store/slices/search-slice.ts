import { StateCreator } from 'zustand';

export interface SearchFilters {
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  location: string;
  radius: number;
  sortBy: 'recent' | 'price_asc' | 'price_desc' | 'popular';
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

export const createSearchSlice: StateCreator<SearchState> = (set) => ({
  query: '',
  filters: {
    category: '',
    minPrice: null,
    maxPrice: null,
    location: '',
    radius: 10,
    sortBy: 'recent',
  },
  isSearching: false,
  
  setSearchQuery: (query: string) => 
    set((state) => ({ 
      ...state, 
      query,
      isSearching: !!query.trim()
    })),
  
  setFilters: (newFilters: Partial<SearchFilters>) =>
    set((state) => ({
      ...state,
      filters: { ...state.filters, ...newFilters },
    })),
    
  resetFilters: () =>
    set((state) => ({
      ...state,
      filters: {
        category: '',
        minPrice: null,
        maxPrice: null,
        location: '',
        radius: 10,
        sortBy: 'recent',
      },
    })),
});