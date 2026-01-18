/**
 * Image optimization utilities
 */

/**
 * Convert an image file to WebP format
 */
export async function convertToWebP(file: File, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to draw and convert image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not convert image to WebP'));
            }
          },
          'image/webp',
          quality,
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Resize image if it exceeds max dimensions
 */
export async function resizeImage(file: File, maxWidth: number = 1920, maxHeight: number = 1920): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Create canvas with new dimensions
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not convert image'));
            }
          },
          'image/webp',
          0.85,
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload image to Supabase Storage
 * @param blob - Image blob to upload
 * @param fileName - Original filename (for cover images, used to generate unique name)
 * @param fixedPath - If provided, use this exact path (overwrites existing)
 */
export async function uploadImageToSupabase(blob: Blob, fileName: string, fixedPath?: string): Promise<string> {
  const { supabase } = useSupabase();

  // Use fixed path for overwrites, or generate unique filename
  let filePath: string;
  if (fixedPath) {
    filePath = fixedPath;
  } else {
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName.replace(/\.[^/.]+$/, '')}.webp`;
    filePath = `images/${uniqueFileName}`;
  }

  // Upload to Supabase Storage with upsert:true to overwrite existing
  const { data, error } = await supabase.storage.from('uploads').upload(filePath, blob, {
    contentType: 'image/webp',
    upsert: true, // This will overwrite if file exists
  });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL with cache buster to prevent caching issues
  const {
    data: { publicUrl },
  } = supabase.storage.from('uploads').getPublicUrl(filePath);

  // Add cache buster to URL
  return `${publicUrl}?t=${Date.now()}`;
}

/**
 * Delete image from Supabase Storage by URL
 */
export async function deleteImageFromSupabase(imageUrl: string): Promise<void> {
  const { supabase } = useSupabase();

  // Extract file path from URL
  // URL format: https://[project].supabase.co/storage/v1/object/public/uploads/images/[filename].webp
  const urlParts = imageUrl.split('/uploads/');
  if (urlParts.length < 2 || !urlParts[1]) {
    console.warn('Invalid image URL format, cannot delete:', imageUrl);
    return;
  }

  const filePath = urlParts[1];

  // Delete from Supabase Storage
  const { error } = await supabase.storage.from('uploads').remove([filePath]);

  if (error) {
    console.error('Failed to delete image:', error.message);
    // Don't throw error - just log it, so upload can continue
  }
}

/**
 * Process and upload image (resize + convert to WebP + upload)
 */
export async function processAndUploadImage(file: File): Promise<string> {
  try {
    // Resize and convert to WebP
    const webpBlob = await resizeImage(file, 1920, 1920);

    // Upload to Supabase
    const publicUrl = await uploadImageToSupabase(webpBlob, file.name);

    return publicUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

/**
 * Upload background image - uses fixed path so it always overwrites
 * This ensures only ONE background image exists at a time
 */
export async function uploadBackgroundImage(file: File): Promise<string> {
  try {
    // Resize and convert to WebP
    const webpBlob = await resizeImage(file, 1920, 1920);

    // Upload to fixed path - will OVERWRITE existing background
    const publicUrl = await uploadImageToSupabase(webpBlob, file.name, 'background.webp');

    return publicUrl;
  } catch (error) {
    console.error('Error uploading background image:', error);
    throw error;
  }
}
