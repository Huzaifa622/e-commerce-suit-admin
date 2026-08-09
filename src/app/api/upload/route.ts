import { NextResponse } from 'next/server';
import { generateUploadSignature } from '@/lib/cloudinary/upload-image';

export async function POST() {
  try {
    const { timestamp, signature } = generateUploadSignature();
    
    return NextResponse.json({
      success: true,
      data: {
        timestamp,
        signature,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
      }
    });
  } catch (error) {
    console.error('Error generating upload signature:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
