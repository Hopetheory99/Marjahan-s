import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';
import { productService, ProductFilters } from '../services/productService';

export const useProducts = (filters?: ProductFilters) => {
  const query = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
  });

  return {
    products: (query.data as Product[] | undefined) ?? [],
    loading: query.isLoading,
    error: query.error ? String(query.error) : null,
    refetch: query.refetch,
  };
};

export const useProductDetail = (id?: string) => {
  const query = useQuery({
    queryKey: ['product', id],
    queryFn: () => (id ? productService.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  });

  return {
    product: query.data as Product | null,
    loading: query.isLoading,
    error: query.error ? String(query.error) : null,
    refetch: query.refetch,
  };
};

export const useFeaturedProducts = () => {
  const query = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeatured(),
  });

  return {
    products: (query.data as Product[] | undefined) ?? [],
    loading: query.isLoading,
    error: query.error ? String(query.error) : null,
  };
};
};
