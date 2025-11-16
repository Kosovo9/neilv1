/**
 * Studio Nexora - Email Sender Service
 * Resend integration for transactional emails
 */

import { Resend } from 'resend';
import { logger } from '../utils/logger';

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Studio Nexora <notifications@studionexora.com>';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  amount: number;
  currency: string;
  referralDiscount?: number;
  createdAt: string;
}

export interface GenerationCompleteData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  imageUrl: string;
  downloadUrl: string;
}

/**
 * Send a generic email
 */
export async function sendEmail(
  options: EmailOptions
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
      tags: options.tags,
    });

    if (error) {
      logger.error('Resend error:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    logger.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  data: OrderConfirmationData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const discountText = data.referralDiscount
    ? `<p><strong>Descuento por referido:</strong> -$${data.referralDiscount} ${data.currency}</p>`
    : '';

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pedido</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Gracias por tu pedido!</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${data.customerName}</strong>,</p>
          <p>Hemos recibido tu pedido y lo estamos procesando. Pronto recibirás tus fotos generadas por IA.</p>
          
          <div class="details">
            <h2>Detalles del pedido</h2>
            <p><strong>ID de pedido:</strong> ${data.orderId}</p>
            <p><strong>Paquete:</strong> ${data.packageName}</p>
            <p><strong>Fecha:</strong> ${new Date(data.createdAt).toLocaleDateString('es-MX', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <hr>
            ${discountText}
            <p><strong>Total:</strong> $${data.amount} ${data.currency}</p>
          </div>

          <p>Estamos generando tus fotos con inteligencia artificial. El proceso puede tardar entre 5 y 15 minutos dependiendo de la complejidad.</p>
          <p>Te enviaremos otro correo cuando tus fotos estén listas para descargar.</p>

          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
        <div class="footer">
          <p>© 2025 Studio Nexora. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `Confirmación de pedido #${data.orderId.slice(-8)} - Studio Nexora`,
    html,
    tags: [
      { name: 'type', value: 'order_confirmation' },
      { name: 'order_id', value: data.orderId },
    ],
  });
}

/**
 * Send generation complete email
 */
export async function sendGenerationComplete(
  data: GenerationCompleteData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tus fotos están listas</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .preview { text-align: center; margin: 30px 0; }
        .preview img { max-width: 100%; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ¡Tus fotos están listas!</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${data.customerName}</strong>,</p>
          <p>¡Buenas noticias! Tus fotos generadas por IA están listas para descargar.</p>
          
          <div class="preview">
            <img src="${data.imageUrl}" alt="Vista previa de tu foto" />
          </div>

          <p style="text-align: center;">
            <a href="${data.downloadUrl}" class="button">Descargar mis fotos</a>
          </p>

          <p><strong>ID de pedido:</strong> ${data.orderId}</p>
          
          <p>Tu descarga estará disponible durante 30 días. Asegúrate de guardar tus fotos en un lugar seguro.</p>

          <p>Si estás satisfecho con el resultado, ¡compártelo en redes sociales y etiquétanos!</p>

          <p>Gracias por confiar en Studio Nexora.</p>
        </div>
        <div class="footer">
          <p>© 2025 Studio Nexora. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `¡Tus fotos están listas! - Pedido #${data.orderId.slice(-8)}`,
    html,
    tags: [
      { name: 'type', value: 'generation_complete' },
      { name: 'order_id', value: data.orderId },
    ],
  });
}

/**
 * Send affiliate commission notification
 */
export async function sendAffiliateCommissionNotification(
  affiliateEmail: string,
  affiliateName: string,
  commission: number,
  orderAmount: number,
  orderId: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva comisión de afiliado</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>💰 ¡Nueva comisión!</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hola <strong>${affiliateName}</strong>,</p>
          <p>¡Buenas noticias! Has generado una nueva comisión a través de tu enlace de afiliado.</p>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2>Detalles de la comisión</h2>
            <p><strong>Monto del pedido:</strong> $${orderAmount} MXN</p>
            <p><strong>Tu comisión (40%):</strong> $${commission} MXN</p>
            <p><strong>ID de pedido:</strong> ${orderId}</p>
          </div>

          <p>Las comisiones se procesan cada 15 días. Puedes ver todas tus comisiones en tu panel de afiliado.</p>
          
          <p>¡Sigue compartiendo y ganando!</p>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>© 2025 Studio Nexora. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: affiliateEmail,
    subject: `Nueva comisión: $${commission} MXN - Studio Nexora`,
    html,
    tags: [
      { name: 'type', value: 'affiliate_commission' },
      { name: 'order_id', value: orderId },
    ],
  });
}
