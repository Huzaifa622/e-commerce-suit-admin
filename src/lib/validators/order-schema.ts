import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
    message: 'Status must be one of pending, processing, shipped, delivered, or cancelled',
  }),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  items: z.array(
    z.object({
      product: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1'),
      price: z.number().min(0, 'Price must be positive'),
    })
  ).min(1, 'Order must contain at least one item'),
  totalAmount: z.number().min(0, 'Total amount must be positive'),
  currency: z.string().default('PKR'),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
});

