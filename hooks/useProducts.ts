<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
=======

import { useQuery } from '@tanstack/react-query';
>>>>>>> 761b4aa0e334fc8c74177e361cd66e69829c60ff
import { Product } from '../types';
import { productService, ProductFilters } from '../services/productService';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery(['products', filters], () => productService.getAll(filters), { keepPreviousData: true });
};

<<<<<<< HEAD
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
    productService.getFeatured().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return { products, loading };
=======
export const useProductDetail = (id?: string) => {
  return useQuery(['product', id], () => (id ? productService.getById(id) : Promise.resolve(null)), { enabled: !!id });
};

export const useFeaturedProducts = () => {
  return useQuery(['products', 'featured'], () => productService.getFeatured());
>>>>>>> 761b4aa0e334fc8c74177e361cd66e69829c60ff
};
