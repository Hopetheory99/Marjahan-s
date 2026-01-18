export interface PaymentData {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName?: string;
  paymentMethod: 'bkash' | 'nagad' | 'card' | 'bank';
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  error?: string;
  redirectUrl?: string;
}

import { logger } from './logger';

export const paymentService = {
  // Process payment with bKash (mock implementation)
  async processBkashPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      logger.info('Processing bKash payment', {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        service: 'payment',
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Production: This should call the real bKash API
      // Development: Simulate a successful initiation of a manual payment flow
      const transactionId = `BKASH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        transactionId,
        paymentId: transactionId,
        // In a real app, we might redirect to bKash gateway here
      };
    } catch (error) {
      logger.error('bKash payment error', error as Error, {
        orderId: paymentData.orderId,
        service: 'payment',
      });
      return {
        success: false,
        error: 'Payment service temporarily unavailable.',
      };
    }
  },

  // Process payment with Nagad (mock implementation)
  async processNagadPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      logger.info('Processing Nagad payment', {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        service: 'payment',
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Production: This should call the real Nagad API
      // Development: Simulate a successful initiation
      const transactionId = `NAGAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        transactionId,
        paymentId: transactionId,
      };
    } catch (error) {
      logger.error('Nagad payment error', error as Error, {
        orderId: paymentData.orderId,
        service: 'payment',
      });
      return {
        success: false,
        error: 'Payment service temporarily unavailable.',
      };
    }
  },

  // Process payment with card (Deprecated - Use stripeService directly)
  async processCardPayment(): Promise<PaymentResult> {
    logger.warn(
      'paymentService.processCardPayment is deprecated. Use stripeService.createPaymentIntent instead.',
      { service: 'payment' },
    );
    return {
      success: false,
      error: 'Please use the secure Stripe checkout.',
    };
  },

  // Process payment with bank transfer (mock implementation)
  async processBankPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      logger.info('Processing bank payment', {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        service: 'payment',
      });

      // Bank transfers are usually manual, so we create a pending payment
      const transactionId = `BANK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        transactionId,
        paymentId: transactionId,
        redirectUrl: `/payment/bank-instructions?orderId=${paymentData.orderId}`,
      };
    } catch (error) {
      logger.error('Bank payment error', error as Error, {
        orderId: paymentData.orderId,
        service: 'payment',
      });
      return {
        success: false,
        error: 'Unable to initiate bank transfer. Please try again.',
      };
    }
  },

  // Main payment processing method
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    switch (paymentData.paymentMethod) {
      case 'bkash':
        return this.processBkashPayment(paymentData);
      case 'nagad':
        return this.processNagadPayment(paymentData);
      case 'card':
        return this.processCardPayment();
      case 'bank':
        return this.processBankPayment(paymentData);
      default:
        return {
          success: false,
          error: 'Unsupported payment method.',
        };
    }
  },

  // Validate payment amount
  validatePaymentAmount(amount: number): { valid: boolean; error?: string } {
    if (amount <= 0) {
      return { valid: false, error: 'Payment amount must be greater than 0.' };
    }
    if (amount > 1000000) {
      // 1 million BDT limit
      return { valid: false, error: 'Payment amount exceeds maximum limit.' };
    }
    return { valid: true };
  },

  // Get payment method display name
  getPaymentMethodName(method: string): string {
    switch (method) {
      case 'bkash':
        return 'bKash';
      case 'nagad':
        return 'Nagad';
      case 'card':
        return 'Credit/Debit Card';
      case 'bank':
        return 'Bank Transfer';
      default:
        return method;
    }
  },

  // Get supported payment methods
  getSupportedMethods(): Array<{ value: string; label: string; description: string }> {
    return [
      {
        value: 'bkash',
        label: 'bKash',
        description: 'Pay with your bKash mobile wallet',
      },
      {
        value: 'nagad',
        label: 'Nagad',
        description: 'Pay with your Nagad mobile wallet',
      },
      {
        value: 'card',
        label: 'Credit/Debit Card',
        description: 'Pay with Visa, Mastercard, or other cards',
      },
      {
        value: 'bank',
        label: 'Bank Transfer',
        description: 'Direct bank transfer (manual processing)',
      },
    ];
  },
};
