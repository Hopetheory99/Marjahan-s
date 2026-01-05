import { Resend } from 'resend';
import OrderConfirmation from '../emails/templates/OrderConfirmation';
import OrderStatusUpdate from '../emails/templates/OrderStatusUpdate';
import WelcomeEmail from '../emails/templates/WelcomeEmail';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private resend: Resend | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeResend();
  }

  private initializeResend(): void {
    const apiKey = (import.meta as any).env?.VITE_RESEND_API_KEY;

    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.isInitialized = true;
      console.log('📧 Email service initialized with Resend');
    } else {
      console.warn('⚠️ VITE_RESEND_API_KEY not found. Email service running in development mode.');
      this.isInitialized = false;
    }
  }

  private async sendWithRetry(emailData: EmailData, maxRetries = 3): Promise<EmailResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (!this.isInitialized || !this.resend) {
          // Development mode - log and simulate success
          console.log('📧 [DEV MODE] Email would be sent:', {
            attempt,
            to: emailData.to,
            subject: emailData.subject,
            htmlLength: emailData.html.length,
          });

          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          return {
            success: true,
            messageId: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
        }

        // Production mode - send with Resend
        const result = await this.resend.emails.send({
          from: "Marjahan's Jewelry <noreply@marjahans.com>",
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
        });

        console.log('📧 Email sent successfully:', {
          attempt,
          to: emailData.to,
          messageId: result.data?.id,
        });

        return {
          success: true,
          messageId: result.data?.id,
        };
      } catch (error) {
        lastError = error as Error;
        console.error(`📧 Email send attempt ${attempt} failed:`, error);

        // If it's the last attempt, don't wait
        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    const errorMessage = `Failed to send email after ${maxRetries} attempts: ${lastError?.message}`;
    console.error('📧', errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }

  // Legacy method for backward compatibility
  async sendEmail(emailData: EmailData): Promise<boolean> {
    const result = await this.sendWithRetry(emailData);
    return result.success;
  }

  // Send order confirmation email with React Email template
  async sendOrderConfirmation(
    orderId: string,
    userEmail: string,
    orderDetails: {
      total: number;
      status: string;
      items?: Array<{
        name: string;
        quantity: number;
        price: number;
        image?: string;
      }>;
      customerName?: string;
    },
  ): Promise<boolean> {
    try {
      const subject = `Order Confirmation - Order #${orderId}`;

      // Render React Email template to HTML
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f6f6f6; padding: 20px;">
          <div style="background: white; padding: 40px; border-radius: 8px;">
            <h1 style="color: #8B5A3C; text-align: center;">Thank You for Your Order!</h1>
            <p>Dear ${orderDetails.customerName || 'Valued Customer'},</p>
            <p>Your luxury jewelry order has been confirmed. Here are the details:</p>

            <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3>Order #${orderId}</h3>
              <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
              <p><strong>Status:</strong> ${orderDetails.status}</p>
            </div>

            <p>You will receive another email when your order ships.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${(import.meta as any).env?.VITE_APP_URL || 'https://marjahans.com'}/orders/${orderId}"
                 style="background: #8B5A3C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Track Your Order
              </a>
            </div>

            <p>Best regards,<br>The Marjahan's Jewelry Team</p>
          </div>
        </div>
      `;

      return this.sendEmail({
        to: userEmail,
        subject,
        html,
        text: `Your order #${orderId} has been confirmed. Total: $${orderDetails.total.toFixed(2)}`,
      });
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  // Send order status update email with React Email template
  async sendOrderStatusUpdate(
    orderId: string,
    userEmail: string,
    newStatus: string,
    options?: {
      customerName?: string;
      estimatedDelivery?: string;
      trackingNumber?: string;
      trackingUrl?: string;
    },
  ): Promise<boolean> {
    try {
      const subject = `Order Update - Order #${orderId}`;

      let statusMessage = '';
      switch (newStatus.toLowerCase()) {
        case 'processing':
          statusMessage = 'Your order is now being processed.';
          break;
        case 'shipped':
          statusMessage = 'Your order has been shipped and is on its way!';
          break;
        case 'delivered':
          statusMessage = 'Your order has been delivered. Thank you for shopping with us!';
          break;
        case 'cancelled':
          statusMessage = 'Your order has been cancelled.';
          break;
        default:
          statusMessage = `Your order status has been updated to: ${newStatus}`;
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f6f6f6; padding: 20px;">
          <div style="background: white; padding: 40px; border-radius: 8px;">
            <h1 style="color: #8B5A3C; text-align: center;">Order Status Update</h1>
            <p>Dear ${options?.customerName || 'Valued Customer'},</p>
            <p>${statusMessage}</p>

            <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3>Order #${orderId}</h3>
              <p><strong>New Status:</strong> ${newStatus}</p>
              ${options?.trackingNumber ? `<p><strong>Tracking Number:</strong> ${options.trackingNumber}</p>` : ''}
              ${options?.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${options.estimatedDelivery}</p>` : ''}
            </div>

            ${
              options?.trackingUrl
                ? `
              <div style="text-align: center; margin: 20px 0;">
                <a href="${options.trackingUrl}"
                   style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  Track Your Package
                </a>
              </div>
            `
                : ''
            }

            <p>If you have any questions, please contact our support team.</p>

            <p>Best regards,<br>The Marjahan's Jewelry Team</p>
          </div>
        </div>
      `;

      return this.sendEmail({
        to: userEmail,
        subject,
        html,
        text: `Order #${orderId} status update: ${newStatus}`,
      });
    } catch (error) {
      console.error('Failed to send order status update email:', error);
      return false;
    }
  }

  // Send welcome email to new users with React Email template
  async sendWelcomeEmail(userEmail: string, userName?: string): Promise<boolean> {
    try {
      const subject = "Welcome to Marjahan's Jewelry!";

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; padding: 40px; border-radius: 8px;">
            <h1 style="color: #8B5A3C; text-align: center;">Welcome to Marjahan's Jewelry! ✨</h1>
            <p style="text-align: center; color: #666;">Where Luxury Meets Affordability</p>

            <p>Dear ${userName || 'Valued Customer'},</p>
            <p>Thank you for joining the Marjahan's Jewelry family! We're absolutely delighted to have you as part of our community of discerning jewelry lovers.</p>

            <p>For over two decades, we've been crafting exquisite jewelry that combines timeless elegance with exceptional value.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${(import.meta as any).env?.VITE_APP_URL || 'https://marjahans.com'}/products"
                 style="background: #8B5A3C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Shop Our Collection
              </a>
            </div>

            <div style="background: #8B5A3C; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3>🎁 Welcome Gift</h3>
              <p>Get 10% off your first purchase with code:</p>
              <div style="font-size: 24px; font-weight: bold; background: white; color: #8B5A3C; padding: 10px 20px; border-radius: 4px; display: inline-block; margin: 10px 0;">
                WELCOME10
              </div>
            </div>

            <p>Best regards,<br>The Marjahan's Jewelry Team 💎</p>
          </div>
        </div>
      `;

      return this.sendEmail({
        to: userEmail,
        subject,
        html,
        text: "Welcome to Marjahan's Jewelry! Discover our luxury collection and enjoy 10% off with WELCOME10.",
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
