import { NextResponse } from 'next/server';
import connectDb from '@/lib/db/connect-db';
import { Order } from '@/models/order-model';
import { updateOrderStatusSchema } from '@/lib/validators/order-schema';
import { z } from 'zod';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const { id } = await params;
    
    // We assume the items.product reference is to the Product model.
    const order = await Order.findById(id).populate('items.product').lean();
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const { id } = await params;
    const body = await request.json();
    
    // Validate request body
    const validatedData = updateOrderStatusSchema.parse(body);

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { status: validatedData.status } },
      { new: true, runValidators: true }
    ).populate('items.product');

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    console.error('Error updating order:', error);
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
