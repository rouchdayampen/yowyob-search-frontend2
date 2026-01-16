import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchState, createSearchSlice } from './slices/search-slice';
import { UIState, createUISlice } from './slices/ui-slice';

export type AppState = SearchState & UIState;

export const useStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createSearchSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        filters: state.filters,
      }),
    }
  )
);

// Hook pour le store de recherche uniquement
export const useSearchStore = () => {
  const state = useStore();
  return {
    query: state.query,
    filters: state.filters,
    isSearching: state.isSearching,
    setSearchQuery: state.setSearchQuery,
    setFilters: state.setFilters,
    resetFilters: state.resetFilters,
  };
};
