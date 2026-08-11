import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Order } from '../types';

interface OrderResponse {
  success: boolean;
  data: Order;
}

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const response = await axiosInstance.get<OrderResponse>(`/api/orders/${id}`);
      return response as unknown as OrderResponse;
    },
    enabled: !!id,
  });
};
