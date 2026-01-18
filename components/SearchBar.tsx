import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '../services/logger';
import { searchService } from '../services/searchService';
import Image from './Image';
import { Product } from '../types';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  onSearch?: (query: string, results: Product[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search for jewelry...',
  className = '',
  showSuggestions = true,
  onSearch,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Handle search with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length > 0) {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await searchService.searchProducts(query, { limit: 5 });
          // Map Hits to Products if necessary, but searchService usually returns Products or similar
          const hits = (results.hits || []) as unknown as Product[];
          setSuggestions(hits);
          setShowDropdown(true);

          if (onSearch) {
            onSearch(query, hits);
          }
        } catch (error) {
          logger.error('Search error', error as Error, { query, service: 'filters' });
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, onSearch]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    navigate(`/products/${product.id}`);
    setShowDropdown(false);
    setQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-4 py-2 pl-10 pr-12 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onFocus={() => query.trim() && setShowDropdown(true)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="w-5 h-5 text-gray-400"
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
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setShowDropdown(false);
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <svg
                className="w-5 h-5 text-gray-400 hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && showDropdown && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Searching...
              </div>
            </div>
          )}

          {!isLoading && suggestions.length === 0 && query.trim() && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No products found for &quot;{query}&quot;
            </div>
          )}

          {!isLoading &&
            suggestions.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSuggestionClick(product)}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') && handleSuggestionClick(product)
                }
              >
                <div className="flex-shrink-0 mr-3">
                  <Image
                    src={product.images?.[0] || 'https://placehold.co/48x48?text=No+Image'}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                    placeholderSrc="https://placehold.co/48x48?text=No+Image"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                  <div className="text-xs text-gray-500 truncate">{product.category}</div>
                  <div className="text-sm font-semibold text-blue-600">
                    {formatPrice(product.price)}
                  </div>
                </div>
                {product.stock === 0 && (
                  <span className="text-xs text-red-500 font-medium ml-2">Out of Stock</span>
                )}
              </div>
            ))}

          {!isLoading && suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
