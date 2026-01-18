import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SearchFilters {
  query: string;
  category: string;
  priceRange: [number, number];
  metal: string;
  sortBy: string;
  inStock: boolean;
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  categories: string[];
  metals: string[];
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onFiltersChange, categories, metals }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    priceRange: [0, 10000],
    metal: searchParams.get('metal') || '',
    sortBy: searchParams.get('sort') || 'name',
    inStock: searchParams.get('inStock') === 'true',
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.category) params.set('category', filters.category);
    if (filters.metal) params.set('metal', filters.metal);
    if (filters.sortBy !== 'name') params.set('sort', filters.sortBy);
    if (filters.inStock) params.set('inStock', 'true');

    setSearchParams(params, { replace: true });
    onFiltersChange(filters);
  }, [filters, onFiltersChange, setSearchParams]);

  // Handle search input with debouncing
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, query: debouncedQuery }));
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedQuery(e.target.value);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      priceRange: [0, 10000],
      metal: '',
      sortBy: 'name',
      inStock: false,
    });
    setDebouncedQuery('');
  };

  const hasActiveFilters = filters.category || filters.metal || filters.inStock || filters.query;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Main Search Bar */}
      <div className="relative mb-4">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={debouncedQuery}
            onChange={handleSearchChange}
            placeholder="Search for rings, necklaces, bracelets..."
            className="input-modern w-full pl-12 pr-12 py-4 text-lg placeholder:text-brand-warm-gray focus:ring-2 focus:ring-brand-gold/50"
          />

          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-brand-warm-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Clear Button */}
          {debouncedQuery && (
            <button
              onClick={() => {
                setDebouncedQuery('');
                searchInputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-brand-cream rounded-full transition-colors"
            >
              <svg
                className="w-4 h-4 text-brand-warm-gray"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

        {/* Expand/Collapse Filters Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-12 top-1/2 transform -translate-y-1/2 p-2 text-brand-warm-gray hover:text-brand-burgundy transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold rounded"
          aria-label={isExpanded ? 'Hide filters' : 'Show filters'}
        >
          <svg
            className={`w-5 h-5 transform transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Advanced Filters */}
      <div
        ref={filtersRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white dark:bg-dark-surface border border-brand-cream dark:border-dark-border rounded-xl p-6 shadow-glass">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            {/* Category Filter */}
            <div>
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-brand-charcoal dark:text-dark-text mb-2"
              >
                Category
              </label>
              <select
                id="category-select"
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="input-modern w-full"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Metal Filter */}
            <div>
              <label
                htmlFor="metal-select"
                className="block text-sm font-medium text-brand-charcoal dark:text-dark-text mb-2"
              >
                Metal
              </label>
              <select
                id="metal-select"
                value={filters.metal}
                onChange={(e) => setFilters((prev) => ({ ...prev, metal: e.target.value }))}
                className="input-modern w-full"
              >
                <option value="">All Metals</option>
                {metals.map((metal) => (
                  <option key={metal} value={metal}>
                    {metal}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label
                htmlFor="sort-select"
                className="block text-sm font-medium text-brand-charcoal dark:text-dark-text mb-2"
              >
                Sort By
              </label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                className="input-modern w-full"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* In Stock Only */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters((prev) => ({ ...prev, inStock: e.target.checked }))}
                  className="w-4 h-4 text-brand-burgundy bg-gray-100 border-gray-300 rounded focus:ring-brand-gold focus:ring-2"
                />
                <span className="text-sm font-medium text-brand-charcoal dark:text-dark-text">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-brand-cream dark:border-dark-border">
            <div className="text-sm text-brand-warm-gray dark:text-dark-text-secondary">
              {hasActiveFilters && (
                <span>
                  {Object.values(filters).filter(Boolean).length} filter
                  {Object.values(filters).filter(Boolean).length !== 1 ? 's' : ''} applied
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-brand-burgundy hover:text-brand-burgundy-light transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold rounded px-2 py-1"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-burgundy/10 text-brand-burgundy border border-brand-burgundy/20">
              Category: {filters.category}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, category: '' }))}
                className="ml-2 hover:bg-brand-burgundy/20 rounded-full p-0.5"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          )}

          {filters.metal && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-gold/10 text-brand-charcoal border border-brand-gold/20">
              Metal: {filters.metal}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, metal: '' }))}
                className="ml-2 hover:bg-brand-gold/20 rounded-full p-0.5"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          )}

          {filters.inStock && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
              In Stock Only
              <button
                onClick={() => setFilters((prev) => ({ ...prev, inStock: false }))}
                className="ml-2 hover:bg-green-200 rounded-full p-0.5"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
