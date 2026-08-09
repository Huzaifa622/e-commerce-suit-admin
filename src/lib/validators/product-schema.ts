import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int().min(0, 'Stock must be 0 or positive'),
  images: z.array(z.string().url()).optional(),
  video: z.string().url().or(z.literal('')).optional(),
  category: z.string().min(1, 'Category is required'),
  inStock: z.boolean().optional(),
});

export const updateProductSchema = productSchema.partial();
