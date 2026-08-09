import { NextResponse } from 'next/server';
import connectDb from '@/lib/db/connect-db';
import { Category } from '@/models/category-model';
import { z } from 'zod';

const makeSlug = (str: string) => 
  str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').optional(),
  description: z.string().optional(),
});

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectDb();
    const category = await Category.findById(id).lean();
    
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectDb();
    
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    const updateObj: any = { ...validatedData };
    if (validatedData.name) {
      updateObj.slug = makeSlug(validatedData.name);
      
      // Check if another category with the same slug exists
      const existing = await Category.findOne({ slug: updateObj.slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Category name already exists' },
          { status: 400 }
        );
      }
    }

    const category = await Category.findByIdAndUpdate(id, updateObj, { new: true, runValidators: true });
    
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category, message: 'Category updated successfully' });
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

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    await category.deleteOne();

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
