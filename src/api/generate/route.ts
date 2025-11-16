/**
 * Studio Nexora - AI Photo Generation API
 * POST /api/generate
 * Handles photo generation with Google AI Studio (Gemini 1.5 Pro)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { generatePhoto } from '@/lib/ai/google-ai-studio';
import { uploadToR2, generateSignedUrl } from '@/lib/storage/r2-client';
import { addWatermark } from '@/lib/watermark/processor';
import { sendGenerationComplete } from '@/lib/notifications/email-sender';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Authenticate with Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      orderId,
      imageBase64,
      category, // 'hombre' | 'mujer' | 'niño' | 'niña' | 'perrito' | 'perrita' | 'familia' | 'equipos'
      style, // 'profesional' | 'casual' | 'artistico' | etc.
      count = 1, // Number of variations
    } = body;

    // Validate required fields
    if (!orderId || !imageBase64 || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, imageBase64, category' },
        { status: 400 }
      );
    }

    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, users(*)')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found or unauthorized' },
        { status: 404 }
      );
    }

    // Check if order is already processed
    if (order.status === 'completed') {
      return NextResponse.json(
        { error: 'Order already processed' },
        { status: 400 }
      );
    }

    // Update order status to processing
    await supabase
      .from('orders')
      .update({ status: 'processing', processing_started_at: new Date().toISOString() })
      .eq('id', orderId);

    // Generate photos with Google AI Studio
    console.log(`[Generate] Starting generation for order ${orderId}, category: ${category}`);
    
    const generationResults = [];
    
    for (let i = 0; i < count; i++) {
      try {
        // Call Google AI to generate photo
        const aiResult = await generatePhoto({
          imageBase64,
          category,
          style: style || 'profesional',
          prompt: body.customPrompt,
        });

        if (!aiResult.success || !aiResult.imageUrl) {
          console.error(`[Generate] Failed to generate photo ${i + 1}:`, aiResult.error);
          continue;
        }

        // Download generated image
        const imageResponse = await fetch(aiResult.imageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        // Add watermark (will be removed after payment)
        const watermarkedBuffer = await addWatermark(imageBuffer, {
          text: 'STUDIO NEXORA',
          opacity: 0.3,
        });

        // Upload to Cloudflare R2
        const filename = `orders/${orderId}/generated_${i + 1}_${Date.now()}.jpg`;
        const uploadResult = await uploadToR2(watermarkedBuffer, filename, 'image/jpeg');

        if (!uploadResult.success) {
          console.error(`[Generate] Failed to upload photo ${i + 1}:`, uploadResult.error);
          continue;
        }

        // Generate signed URL (valid for 30 days)
        const signedUrl = await generateSignedUrl(filename, 30 * 24 * 60 * 60);

        // Save to database
        const { data: generatedPhoto, error: photoError } = await supabase
          .from('generated_photos')
          .insert({
            order_id: orderId,
            user_id: userId,
            filename,
            url: signedUrl,
            category,
            style,
            has_watermark: true,
            ai_prompt: aiResult.prompt,
            ai_model: 'gemini-1.5-pro',
          })
          .select()
          .single();

        if (photoError) {
          console.error(`[Generate] Failed to save photo ${i + 1} to database:`, photoError);
          continue;
        }

        generationResults.push({
          id: generatedPhoto.id,
          url: signedUrl,
          filename,
        });

        console.log(`[Generate] Successfully generated photo ${i + 1}/${count}`);
      } catch (error) {
        console.error(`[Generate] Error generating photo ${i + 1}:`, error);
      }
    }

    if (generationResults.length === 0) {
      // All generations failed
      await supabase
        .from('orders')
        .update({ 
          status: 'failed',
          error_message: 'Failed to generate any photos',
          processing_completed_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      return NextResponse.json(
        { error: 'Failed to generate photos' },
        { status: 500 }
      );
    }

    // Update order status to completed
    await supabase
      .from('orders')
      .update({ 
        status: 'completed',
        photos_generated: generationResults.length,
        processing_completed_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    // Send email notification
    try {
      await sendGenerationComplete({
        orderId,
        customerName: order.users.name || order.users.email,
        customerEmail: order.users.email,
        imageUrl: generationResults[0].url,
        downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`,
      });
    } catch (emailError) {
      console.error('[Generate] Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    console.log(`[Generate] Order ${orderId} completed successfully. Generated ${generationResults.length} photos.`);

    return NextResponse.json({
      success: true,
      orderId,
      photos: generationResults,
      count: generationResults.length,
    });

  } catch (error) {
    console.error('[Generate] Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check generation status
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId parameter' },
        { status: 400 }
      );
    }

    // Get order status
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, status, photos_generated, error_message')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      photosGenerated: order.photos_generated,
      errorMessage: order.error_message,
    });

  } catch (error) {
    console.error('[Generate GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
