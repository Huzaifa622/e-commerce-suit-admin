import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { OrdersResponse } from '../types';

interface UseOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useOrders = (params: UseOrdersParams) => {
  const { page = 1, limit = 10, search = '', status = '', sortBy = 'createdAt', sortOrder = 'desc' } = params;

  return useQuery({
    // Spread individual primitives — NOT the object reference — so the key is stable across renders
    queryKey: ['orders', page, limit, search, status, sortBy, sortOrder],
    queryFn: async () => {
      const response = await axiosInstance.get<OrdersResponse>('/api/orders', {
        params: { page, limit, search: search || undefined, status: status || undefined, sortBy, sortOrder },
      });
      return response as unknown as OrdersResponse;
    },
    placeholderData: (previousData) => previousData,
  });
};
