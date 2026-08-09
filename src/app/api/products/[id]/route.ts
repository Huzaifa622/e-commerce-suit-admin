import { NextResponse } from 'next/server';
import connectDb from '@/lib/db/connect-db';
import { Product } from '@/models/product-model';
import { updateProductSchema } from '@/lib/validators/product-schema';
import { deleteImage } from '@/lib/cloudinary/delete-image';
import { z } from 'zod';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectDb();
    const product = await Product.findById(id).populate('category', 'name slug').lean();
    
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectDb();
    
    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    const product = await Product.findByIdAndUpdate(id, validatedData, { new: true, runValidators: true });
    
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product, message: 'Product updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectDb();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Delete images and video from Cloudinary
    const deletePromises = [];
    if (product.images && product.images.length > 0) {
      deletePromises.push(...product.images.map((img: string) => deleteImage(img)));
    }
    if (product.video) {
      deletePromises.push(deleteImage(product.video));
    }
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
    }

    await product.deleteOne();

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
