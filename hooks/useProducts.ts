<<<<<<< HEAD
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productService, ProductFilters } from '../services/productService';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
    placeholderData: keepPreviousData,
  });
};

export const useProductDetail = (id?: string) => {
  return useQuery({
=======
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
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
    queryKey: ['product', id],
    queryFn: () => (id ? productService.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
<<<<<<< HEAD
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeatured(),
  });
=======

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
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
};
