import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  return useQuery(['orders'], () => orderService.getAll());
};

export const useOrderDetail = (id?: string) => {
  return useQuery(['order', id], () => (id ? orderService.getById(id) : Promise.resolve(null)), { enabled: !!id });
};
