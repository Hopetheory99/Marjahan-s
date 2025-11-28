
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MetalType, CategoryType } from '../types';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { ProductFilters } from '../services/productService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// Strict typing for filter state actions
type FilterAction = 
  | { type: 'setPrice'; value: number }
  | { type: 'setMetals'; value: MetalType[] }
  | { type: 'setCategories'; value: CategoryType[] };

const ProductFilter: React.FC<{
  filters: ProductFilters;
  onFilterChange: (action: FilterAction) => void;
}> = ({ filters, onFilterChange }) => {
  
  const handleMetalChange = (metal: MetalType) => {
    const currentMetals = filters.metals || [];
    const newMetals = currentMetals.includes(metal)
      ? currentMetals.filter(m => m !== metal)
      : [...currentMetals, metal];
    onFilterChange({ type: 'setMetals', value: newMetals });
  };

  const handleCategoryChange = (category: CategoryType) => {
    const currentCats = filters.categories || [];
    const newCategories = currentCats.includes(category)
      ? currentCats.filter(c => c !== category)
      : [...currentCats, category];
    onFilterChange({ type: 'setCategories', value: newCategories });
  };

  return (
    <div className="w-full lg:w-64 space-y-8">
      <div>
        <h3 className="font-semibold mb-4">By Category</h3>
        <div className="space-y-2">
          {(['Rings', 'Necklaces', 'Earrings', 'Bracelets'] as CategoryType[]).map(cat => (
            <label key={cat} className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.categories?.includes(cat) || false} 
                onChange={() => handleCategoryChange(cat)} 
                className="h-4 w-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold transition cursor-pointer" 
              />
              <span className="ml-3 text-gray-700 group-hover:text-brand-gold transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-4">By Metal</h3>
        <div className="space-y-2">
          {(['Gold', 'Silver', 'Platinum'] as MetalType[]).map(metal => (
            <label key={metal} className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.metals?.includes(metal) || false} 
                onChange={() => handleMetalChange(metal)} 
                className="h-4 w-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold transition cursor-pointer"
              />
              <span className="ml-3 text-gray-700 group-hover:text-brand-gold transition-colors">{metal}</span>
            </label>
          ))}
        </div>
      </div>
       <div>
        <h3 className="font-semibold mb-4">By Price</h3>
         <input 
            type="range" 
            min="0" 
            max="10000" 
            step="100"
            value={filters.price || 10000} 
            onChange={e => onFilterChange({ type: 'setPrice', value: Number(e.target.value) })}
            className="w-full accent-brand-gold"
          />
          <div className="text-sm text-gray-600 mt-2">Up to ${(filters.price || 10000).toLocaleString()}</div>
      </div>
    </div>
  );
};

const ProductsPage: React.FC = () => {
    useDocumentTitle('Collections');
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category');
    
    const [filters, setFilters] = useState<ProductFilters>({
        price: 10000,
        metals: [],
        categories: initialCategory ? [initialCategory as CategoryType] : [],
    });

    const { products, loading, error, refetch } = useProducts(filters);

    // Debounce the refetch when filters change to avoid hammering the "api"
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            refetch(filters);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [filters, refetch]);

    const handleFilterChange = (action: FilterAction) => {
        setFilters(prev => {
            switch (action.type) {
                case 'setPrice':
                    return { ...prev, price: action.value };
                case 'setMetals':
                    return { ...prev, metals: action.value };
                case 'setCategories':
                    return { ...prev, categories: action.value };
                default:
                    return prev;
            }
        });
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-serif text-center mb-12">Our Collection</h1>
            <div className="flex flex-col lg:flex-row gap-12">
                <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
                <div className="flex-1">
                    {loading ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {[1,2,3,4,5,6].map(i => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 h-80 w-full mb-4"></div>
                                    <div className="h-4 bg-gray-200 w-2/3 mx-auto"></div>
                                </div>
                            ))}
                         </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-10">{error}</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            {products.length === 0 && (
                                <div className="text-center py-20">
                                    <h2 className="text-2xl font-serif">No Products Found</h2>
                                    <p className="text-gray-600 mt-2">Try adjusting your filters to see more results.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
