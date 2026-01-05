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

export const paymentService = {
  // Process payment with bKash (mock implementation)
  async processBkashPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      console.log('💳 Processing bKash payment:', paymentData);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const transactionId = `BKASH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          success: true,
          transactionId,
          paymentId: transactionId,
        };
      } else {
        return {
          success: false,
          error: 'Payment failed. Please try again or contact bKash support.',
        };
      }
    } catch (error) {
      console.error('bKash payment error:', error);
      return {
        success: false,
        error: 'Payment service temporarily unavailable.',
      };
    }
  },

  // Process payment with Nagad (mock implementation)
  async processNagadPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      console.log('💳 Processing Nagad payment:', paymentData);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock success/failure (95% success rate)
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        const transactionId = `NAGAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          success: true,
          transactionId,
          paymentId: transactionId,
        };
      } else {
        return {
          success: false,
          error: 'Payment failed. Please check your Nagad balance and try again.',
        };
      }
    } catch (error) {
      console.error('Nagad payment error:', error);
      return {
        success: false,
        error: 'Payment service temporarily unavailable.',
      };
    }
  },

  // Process payment with card (mock Stripe-like implementation)
  async processCardPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      console.log('💳 Processing card payment:', paymentData);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock success/failure (85% success rate)
      const isSuccess = Math.random() > 0.15;

      if (isSuccess) {
        const transactionId = `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          success: true,
          transactionId,
          paymentId: transactionId,
        };
      } else {
        return {
          success: false,
          error: 'Card payment declined. Please try a different card or contact your bank.',
        };
      }
    } catch (error) {
      console.error('Card payment error:', error);
      return {
        success: false,
        error: 'Payment processing error. Please try again.',
      };
    }
  },

  // Process payment with bank transfer (mock implementation)
  async processBankPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      console.log('💳 Processing bank payment:', paymentData);

      // Bank transfers are usually manual, so we create a pending payment
      const transactionId = `BANK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        transactionId,
        paymentId: transactionId,
        redirectUrl: `/payment/bank-instructions?orderId=${paymentData.orderId}`,
      };
    } catch (error) {
      console.error('Bank payment error:', error);
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
        return this.processCardPayment(paymentData);
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
