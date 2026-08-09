import cloudinary from './cloudinary-config';

/**
 * Generates a signature for client-side upload to Cloudinary.
 * The client uses this signature to post directly to the Cloudinary API.
 */
export const generateUploadSignature = () => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: 'ecommerce_admin',
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return { timestamp, signature };
};

/**
 * Server-side upload method if needed
 */
export const uploadImage = async (fileStr: string) => {
  try {
    const response = await cloudinary.uploader.upload(fileStr, {
      folder: 'ecommerce_admin',
    });
    return response;
  } catch (error) {
    console.error('Error uploading to cloudinary', error);
    throw error;
  }
};
