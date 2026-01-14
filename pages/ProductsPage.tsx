import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MetalType, CategoryType } from '../types';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useProducts } from '../hooks/useProducts';
import { ProductFilters } from '../services/productService';
import { searchService } from '../services/searchService';
import SEO from '../components/SEO';

// Strict typing for filter state actions
type FilterAction =
  | { type: 'setPrice'; value: number }
  | { type: 'setMetals'; value: MetalType[] }
  | { type: 'setCategories'; value: CategoryType[] }
  | { type: 'setSearch'; value: string }
  | { type: 'setSort'; value: string }
  | { type: 'clearFilters' };

const ProductFilter: React.FC<{
  filters: ProductFilters;
  onFilterChange: (action: FilterAction) => void;
}> = ({ filters, onFilterChange }) => {
  const handleMetalChange = (metal: MetalType) => {
    const currentMetals = filters.metals || [];
    const newMetals = currentMetals.includes(metal)
      ? currentMetals.filter((m) => m !== metal)
      : [...currentMetals, metal];
    onFilterChange({ type: 'setMetals', value: newMetals });
  };

  const handleCategoryChange = (category: CategoryType) => {
    const currentCats = filters.categories || [];
    const newCategories = currentCats.includes(category)
      ? currentCats.filter((c) => c !== category)
      : [...currentCats, category];
    onFilterChange({ type: 'setCategories', value: newCategories });
  };

  return (
    <div className="w-full lg:w-64 space-y-8">
      {/* Category Filter */}
      <div>
        <h3 className="text-sm tracking-wider uppercase text-brand-charcoal mb-4">Category</h3>
        <div className="space-y-3">
          {(['Rings', 'Necklaces', 'Earrings', 'Bracelets'] as CategoryType[]).map((cat) => (
            <label
              key={cat}
              htmlFor={`cat-${cat}`}
              className="flex items-center cursor-pointer group"
            >
              <input
                id={`cat-${cat}`}
                type="checkbox"
                checked={filters.categories?.includes(cat) || false}
                onChange={() => handleCategoryChange(cat)}
                className="h-4 w-4 text-brand-burgundy border-brand-cream rounded focus:ring-brand-burgundy transition cursor-pointer"
              />
              <span className="ml-3 text-brand-warm-gray group-hover:text-brand-burgundy transition-colors duration-300 text-sm">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Metal Filter */}
      <div>
        <h3 className="text-sm tracking-wider uppercase text-brand-charcoal mb-4">Metal</h3>
        <div className="space-y-3">
          {(['Gold', 'Silver', 'Platinum'] as MetalType[]).map((metal) => (
            <label
              key={metal}
              htmlFor={`metal-${metal}`}
              className="flex items-center cursor-pointer group"
            >
              <input
                id={`metal-${metal}`}
                type="checkbox"
                checked={filters.metals?.includes(metal) || false}
                onChange={() => handleMetalChange(metal)}
                className="h-4 w-4 text-brand-burgundy border-brand-cream rounded focus:ring-brand-burgundy transition cursor-pointer"
              />
              <span className="ml-3 text-brand-warm-gray group-hover:text-brand-burgundy transition-colors duration-300 text-sm">
                {metal}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-sm tracking-wider uppercase text-brand-charcoal mb-4">Price Range</h3>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={filters.price || 10000}
          onChange={(e) => onFilterChange({ type: 'setPrice', value: Number(e.target.value) })}
          className="w-full accent-brand-burgundy"
        />
        <div className="text-sm text-brand-warm-gray mt-2 font-serif">
          Up to{' '}
          <span className="text-brand-burgundy">${(filters.price || 10000).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [filters, setFilters] = useState<ProductFilters>({
    price: 10000,
    metals: [],
    categories: initialCategory ? [initialCategory as CategoryType] : [],
    search: '',
    sort: 'name',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { products, loading, error, refetch } = useProducts(filters);

  // Client-side search and filtering
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.metal.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, filters]);

  // Debounce the refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch(filters);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, refetch]);

  const handleFilterChange = (action: FilterAction) => {
    setFilters((prev) => {
      switch (action.type) {
        case 'setPrice':
          return { ...prev, price: action.value };
        case 'setMetals':
          return { ...prev, metals: action.value };
        case 'setCategories':
          return { ...prev, categories: action.value };
        case 'setSearch':
          return { ...prev, search: action.value };
        case 'setSort':
          return { ...prev, sort: action.value };
        case 'clearFilters':
          return {
            price: 10000,
            metals: [],
            categories: [],
            search: '',
            sort: 'name',
          };
        default:
          return prev;
      }
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange({ type: 'setSearch', value: searchQuery });
  };

  const clearFilters = () => {
    handleFilterChange({ type: 'clearFilters' });
    setSearchQuery('');
  };

  const hasActiveFilters =
    filters.categories?.length ||
    filters.metals?.length ||
    filters.price !== 10000 ||
    filters.search;

  return (
    <div className="bg-brand-ivory min-h-screen">
      <SEO
        title="Collections"
        description="Browse our extensive collection of fine jewelry including rings, necklaces, earrings, and bracelets."
      />

      {/* Page Header */}
      <div className="bg-brand-charcoal py-20 md:py-28">
        <div className="container-luxury text-center">
          <p className="text-brand-gold text-sm tracking-wider uppercase mb-3">Explore Our</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white">Collections</h1>
          <div className="w-16 h-px bg-brand-gold/50 mx-auto mt-6" />
        </div>
      </div>

      <div className="container-luxury py-12 md:py-16">
        {/* Search and Sort Controls */}
        <div className="mb-10 space-y-6">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search for jewelry..."
                onSearch={(query, results) => {
                  handleFilterChange({ type: 'setSearch', value: query });
                }}
                className="w-full"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-6 py-4 bg-white border border-brand-cream text-brand-charcoal text-sm tracking-wider uppercase hover:border-brand-burgundy transition-colors"
            >
              Filters
            </button>
          </div>

          {/* Sort and Results Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-brand-warm-gray">
                {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-brand-burgundy hover:text-brand-burgundy-dark underline transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm text-brand-warm-gray">
                Sort:
              </label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => handleFilterChange({ type: 'setSort', value: e.target.value })}
                className="bg-white border border-brand-cream px-4 py-2 text-sm text-brand-charcoal focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy outline-none transition-all"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="shimmer animate-pulse h-96 rounded-sm" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-brand-burgundy py-20 font-serif text-xl">
                {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-20">
                    <h2 className="font-serif text-2xl text-brand-charcoal">No Pieces Found</h2>
                    <p className="text-brand-warm-gray mt-3">
                      Try adjusting your search or filters to discover more.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-6 text-brand-burgundy underline hover:text-brand-burgundy-dark transition-colors"
                    >
                      View all jewelry
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
