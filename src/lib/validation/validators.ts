/**
 * Validation helper functions
 * Wrappers around Zod schemas for easy use in components
 */

import {
  emailSchema,
  passwordSchema,
  fullNameSchema,
  imageFileSchema,
  imageFilesSchema,
  loginSchema,
  registerSchema,
  photoUploadSchema,
  orderSchema,
  urlSchema,
  uuidSchema,
  enhancedImageFileSchema,
} from './schemas';
import { z } from 'zod';

/**
 * Validate email
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  try {
    emailSchema.parse(email);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid email' };
  }
}

/**
 * Validate password
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  try {
    passwordSchema.parse(password);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid password' };
  }
}

/**
 * Validate full name
 */
export function validateFullName(name: string): { valid: boolean; error?: string } {
  try {
    fullNameSchema.parse(name);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid name' };
  }
}

/**
 * Validate single image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  try {
    imageFileSchema.parse(file);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid file' };
  }
}

/**
 * Validate image file with enhanced MIME type checking
 */
export async function validateImageFileEnhanced(
  file: File
): Promise<{ valid: boolean; error?: string }> {
  try {
    await enhancedImageFileSchema.parseAsync(file);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid file' };
  }
}

/**
 * Validate multiple image files
 */
export function validateImageFiles(
  files: File[],
  maxFiles: number = 10
): { valid: boolean; error?: string; validFiles?: File[] } {
  try {
    const schema = z.array(imageFileSchema).max(maxFiles, `Maximum ${maxFiles} files allowed`);
    schema.parse(files);
    return { valid: true, validFiles: files };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Try to filter valid files
      const validFiles: File[] = [];
      const errors: string[] = [];
      
      files.forEach((file) => {
        const result = validateImageFile(file);
        if (result.valid) {
          validFiles.push(file);
        } else if (result.error) {
          errors.push(`${file.name}: ${result.error}`);
        }
      });

      return {
        valid: validFiles.length > 0,
        error: errors.join('; ') || error.errors[0].message,
        validFiles,
      };
    }
    return { valid: false, error: 'Invalid files' };
  }
}

/**
 * Validate login form
 */
export function validateLoginForm(data: { email: string; password: string }): {
  valid: boolean;
  error?: string;
  errors?: Record<string, string>;
} {
  try {
    loginSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { valid: false, errors, error: error.errors[0].message };
    }
    return { valid: false, error: 'Validation failed' };
  }
}

/**
 * Validate register form
 */
export function validateRegisterForm(data: {
  email: string;
  password: string;
  fullName?: string;
}): {
  valid: boolean;
  error?: string;
  errors?: Record<string, string>;
} {
  try {
    registerSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { valid: false, errors, error: error.errors[0].message };
    }
    return { valid: false, error: 'Validation failed' };
  }
}

/**
 * Validate photo upload
 */
export function validatePhotoUpload(files: File[], maxPhotos: number): {
  valid: boolean;
  error?: string;
  validFiles?: File[];
} {
  try {
    photoUploadSchema.parse({ files, maxPhotos });
    return { valid: true, validFiles: files };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid upload' };
  }
}

/**
 * Validate order data
 */
export function validateOrder(data: {
  packageType: string;
  paymentProvider?: string;
  discountCode?: string;
}): { valid: boolean; error?: string } {
  try {
    orderSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid order data' };
  }
}

/**
 * Validate URL
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  try {
    urlSchema.parse(url);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid URL' };
  }
}

/**
 * Validate UUID
 */
export function validateUuid(uuid: string): { valid: boolean; error?: string } {
  try {
    uuidSchema.parse(uuid);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid UUID' };
  }
}

