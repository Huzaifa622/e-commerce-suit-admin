import cloudinary from './cloudinary-config';

/**
 * Extracts publicId from Cloudinary URL and deletes it.
 */
export const deleteImage = async (imageUrl: string) => {
  try {
    // A standard Cloudinary URL looks like:
    // https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<public_id>.<extension>
    // A video URL looks like:
    // https://res.cloudinary.com/<cloud_name>/video/upload/v<version>/<folder>/<public_id>.<extension>
    const isVideo = imageUrl.includes('/video/');
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = `ecommerce_admin/${filename.split('.')[0]}`; // Assuming folder is ecommerce_admin
    
    await cloudinary.uploader.destroy(publicId, isVideo ? { resource_type: 'video' } : undefined);
    return true;
  } catch (error) {
    console.error('Error deleting file from cloudinary:', error);
    return false;
  }
};
