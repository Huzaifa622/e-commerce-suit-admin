import { NextResponse } from 'next/server';
import connectDb from '@/lib/db/connect-db';
import { Category } from '@/models/category-model';
import { z } from 'zod';

const makeSlug = (str: string) => 
  str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
});

export async function GET() {
  try {
    await connectDb();
    
    let categories = await Category.find({}).sort({ name: 1 }).lean();
    
    // Auto-seed default categories if empty
    if (categories.length === 0) {
      const defaults = [
        { name: '2 piece', slug: '2-piece', description: 'Two piece suits and outfits' },
        { name: '3 piece', slug: '3-piece', description: 'Three piece suits and matching sets' }
      ];
      
      await Category.insertMany(defaults);
      categories = await Category.find({}).sort({ name: 1 }).lean();
    }
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDb();
    const body = await request.json();
    
    const validatedData = createCategorySchema.parse(body);
    const slug = makeSlug(validatedData.name);
    
    // Check if category with slug already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Category already exists' },
        { status: 400 }
      );
    }
    
    const category = await Category.create({
      ...validatedData,
      slug,
    });
    
    return NextResponse.json(
      { success: true, data: category, message: 'Category created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
