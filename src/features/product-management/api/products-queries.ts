import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { IProduct } from '@/models/product-model';

interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  inStock?: boolean;
}

interface FetchProductsResponse {
  success: boolean;
  data: IProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useProducts = (params: FetchProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await axios.get<FetchProductsResponse>('/api/products', { params });
      return response as unknown as FetchProductsResponse;
    },
    // Keep previous data when paginating to avoid layout thrashing
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newProduct: {
      name: string;
      description: string;
      price: number;
      stock: number;
      images?: string[];
      video?: string;
      category: string;
      inStock?: boolean;
    }) => {
      const { data } = await axios.post('/api/products', newProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: any }) => {
      const { data } = await axios.patch(`/api/products/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/products/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

