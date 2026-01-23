/**
 * SearchBar component with autocomplete
 * @author Matteo Owona, Rouchda Yampen
 * @date 2024-12-06
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  showSuggestions?: boolean;
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  defaultValue = '',
  placeholder = 'Rechercher des produits, services, commerces...',
  showSuggestions = false,
  onSearch,
  className,
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!showSuggestions || query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      // Mock suggestions - Replace with API call
      const mockSuggestions = [
        'Ordinateurs portables',
        'Téléphones Samsung',
        'Vêtements femme',
        'Restaurants Yaoundé',
      ].filter(s => s.toLowerCase().includes(query.toLowerCase()));

      setSuggestions(mockSuggestions);
      setShowDropdown(mockSuggestions.length > 0);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, showSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className={cn(
          "flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-blue-500/20 dark:shadow-blue-400/10 border border-blue-100 dark:border-gray-700 hover:shadow-3xl hover:shadow-blue-500/30 dark:hover:shadow-blue-400/20 transition-all duration-500",
          className
        )}>
          <div className="flex items-center gap-3 flex-1 px-4">
            <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 py-4 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-lg"
            />
            {isLoading && (
              <div className="spinner w-5 h-5"></div>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary px-8 py-4 text-lg font-bold flex items-center gap-2 group"
          >
            Rechercher
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slide-down">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-6 py-4 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-200">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};