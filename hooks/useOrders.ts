import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  return useQuery({ 
    queryKey: ['orders'], 
    queryFn: () => orderService.getAll() 
  });
};

export const useOrderDetail = (id?: string) => {
  return useQuery({ 
    queryKey: ['order', id], 
    queryFn: () => (id ? orderService.getById(id) : Promise.resolve(null)), 
    enabled: !!id 
  });
};
