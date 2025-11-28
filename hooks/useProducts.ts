
import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { productService, ProductFilters } from '../services/productService';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: (filters?: ProductFilters) => void;
}

export const useProducts = (initialFilters?: ProductFilters): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (filters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll(filters);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(initialFilters);
  }, [fetchProducts]); // Initial load

  return { products, loading, error, refetch: fetchProducts };
};

export const useProductDetail = (id: string | undefined) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      if (!id) return;
      const load = async () => {
        setLoading(true);
        try {
          const data = await productService.getById(id);
          if (data) setProduct(data);
          else setError('Product not found');
        } catch (err) {
          setError('Could not load product details');
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [id]);
  
    return { product, loading, error };
  };

export const useFeaturedProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      productService.getFeatured().then(data => {
          setProducts(data);
          setLoading(false);
      });
    }, []);
  
    return { products, loading };
};
