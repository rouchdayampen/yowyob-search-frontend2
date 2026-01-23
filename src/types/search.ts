/**
 * Search-related types
 * @author Matteo Owona, Rouchda Yampen
 * @date 2024-12-05
 */

export interface SearchItem {
  id: string;
  name: string;
  description: string;
  type: 'product' | 'service' | 'shop';
  price?: number;
  images: string[];
  shop: ShopInfo;
  location: GeoLocation;
  tags: string[];
  availability: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  hours?: string;
  rating?: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface SearchFilters {
  query: string;
  type?: 'all' | 'product' | 'service' | 'shop';
  category?: string;
  min_price?: number;
  max_price?: number;
  distance?: number;
  latitude?: number;
  longitude?: number;
  sort_by?: 'relevance' | 'price' | 'distance' | 'date';
  sort_order?: 'asc' | 'desc';
  page?: number;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: string;
  count?: number;
}