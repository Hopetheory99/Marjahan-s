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
    queryKey: ['product', id],
    queryFn: () => (id ? productService.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeatured(),
  });
};
