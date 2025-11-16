/** 🎨 WATERMARK PROCESSOR */
import sharp from 'sharp';
import { uploadToR2 } from '../storage/r2-client';
import { supabase } from '../supabase';

export class WatermarkProcessor {
  async addWatermark(imageUrl: string, orderId: string): Promise<string> {
    const response = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const watermarkBuffer = await sharp('./public/watermarks/logo.png').resize(200).toBuffer();
    const processed = await sharp(imageBuffer).composite([{ input: watermarkBuffer, gravity: 'center' }]).jpeg({ quality: 85 }).toBuffer();
    const result = await uploadToR2(processed, `watermarked/${orderId}.jpg`);
    return result.url || result.error || '';
  }
  async removeWatermark(orderId: string): Promise<string> {
    const { data } = await supabase.from('orders').select('original_url').eq('id', orderId).eq('status', 'paid').single();
    if (!data) throw new Error('Not paid');
    return data.original_url;
  }
}

export const watermarkService = new WatermarkProcessor();

/**
 * Add watermark to image buffer
 * Standalone function for use in API routes
 * 
 * @param imageBuffer - Image buffer to watermark
 * @param options - Watermark options (text, opacity)
 * @returns Watermarked image buffer
 */
export async function addWatermark(
  imageBuffer: Buffer,
  options: { text?: string; opacity?: number } = {}
): Promise<Buffer> {
  const opacity = options.opacity ?? 0.3;
  // Create text watermark if provided
  if (options.text) {
    const textSvg = `
      <svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="40" font-weight="bold" 
              fill="rgba(255,255,255,${opacity})" text-anchor="middle" dominant-baseline="middle">
          ${options.text}
        </text>
      </svg>
    `;
    const watermarkBuffer = Buffer.from(textSvg);
    return await sharp(imageBuffer)
      .composite([{ input: watermarkBuffer, gravity: 'center' }])
      .jpeg({ quality: 85 })
      .toBuffer();
  }
  // Use logo watermark if no text provided
  try {
    const watermarkBuffer = await sharp('./public/watermarks/logo.png').resize(200).toBuffer();
    return await sharp(imageBuffer)
      .composite([{ input: watermarkBuffer, gravity: 'center', blend: 'over' }])
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch (error) {
    // If logo not found, return original buffer
    return imageBuffer;
  }
}
