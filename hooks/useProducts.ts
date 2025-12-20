
import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';
import { productService, ProductFilters } from '../services/productService';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery(['products', filters], () => productService.getAll(filters), { keepPreviousData: true });
};

export const useProductDetail = (id?: string) => {
  return useQuery(['product', id], () => (id ? productService.getById(id) : Promise.resolve(null)), { enabled: !!id });
};

export const useFeaturedProducts = () => {
  return useQuery(['products', 'featured'], () => productService.getFeatured());
};
