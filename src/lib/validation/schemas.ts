/**
 * Validation Schemas using Zod
 * Robust input validation for forms, files, and API data
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email is too long')
  .toLowerCase()
  .trim();

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Full name validation schema
 */
export const fullNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Name can only contain letters and spaces')
  .trim();

/**
 * File validation schema
 */
export const imageFileSchema = z
  .instanceof(File, { message: 'Must be a file' })
  .refine(
    (file) => file.size <= 10 * 1024 * 1024,
    'File size must be less than 10MB'
  )
  .refine(
    (file) => {
      const validMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
      ];
      return validMimeTypes.includes(file.type);
    },
    'File must be a valid image (JPEG, PNG, WEBP, or GIF)'
  )
  .refine(
    (file) => {
      // Validate file extension matches MIME type
      const extension = file.name.split('.').pop()?.toLowerCase();
      const mimeExtensionMap: Record<string, string[]> = {
        'image/jpeg': ['jpg', 'jpeg'],
        'image/jpg': ['jpg', 'jpeg'],
        'image/png': ['png'],
        'image/webp': ['webp'],
        'image/gif': ['gif'],
      };
      const validExtensions = mimeExtensionMap[file.type] || [];
      return extension ? validExtensions.includes(extension) : false;
    },
    'File extension does not match file type'
  );

/**
 * Multiple image files validation
 */
export const imageFilesSchema = z
  .array(imageFileSchema)
  .min(1, 'At least one image is required')
  .max(10, 'Maximum 10 images allowed');

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Register form schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: fullNameSchema.optional(),
});

/**
 * Photo upload validation schema
 */
export const photoUploadSchema = z.object({
  files: imageFilesSchema,
  maxPhotos: z.number().int().positive().max(10),
});

/**
 * Order creation schema
 */
export const orderSchema = z.object({
  packageType: z.enum(['1_photo', '2_photos', '3_photos', 'pet', 'family', 'christmas']),
  paymentProvider: z.enum(['stripe', 'lemonsqueezy', 'mercadopago']).optional(),
  discountCode: z.string().optional(),
});

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
    message: 'URL must start with http:// or https://',
  });

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Invalid UUID format');

/**
 * Helper function to validate file MIME type by reading first bytes
 */
export async function validateImageMimeType(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer.slice(0, 4));
      
      // Check magic numbers for image formats
      const magicNumbers: Record<string, number[]> = {
        'image/jpeg': [0xff, 0xd8, 0xff],
        'image/png': [0x89, 0x50, 0x4e, 0x47],
        'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
        'image/gif': [0x47, 0x49, 0x46, 0x38], // GIF8
      };

      const fileType = file.type;
      const expectedBytes = magicNumbers[fileType];
      
      if (!expectedBytes) {
        resolve(false);
        return;
      }

      // Check if first bytes match
      const matches = expectedBytes.every((byte, index) => bytes[index] === byte);
      resolve(matches);
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
}

/**
 * Enhanced image file validation with MIME type verification
 */
export const enhancedImageFileSchema = imageFileSchema.refine(
  async (file) => {
    const isValidMime = await validateImageMimeType(file);
    return isValidMime;
  },
  {
    message: 'File type does not match actual file content. File may be corrupted or mislabeled.',
  }
);

