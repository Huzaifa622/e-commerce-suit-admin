import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  video?: string;
  category: mongoose.Types.ObjectId;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    stock: { type: Number, required: true, default: 0 },
    images: { type: [String], default: [] },
    video: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
ProductSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
