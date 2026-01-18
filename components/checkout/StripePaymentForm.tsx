import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../Button';
import { logger } from '../../services/logger';
import { useToast } from '../../context/ToastContext';
import { useState } from 'react'; // Added missing import for useState

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

/* eslint-disable react/prop-types */
const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
        addToast(error.message || 'Payment failed', 'error');
        setIsProcessing(false);
      } else {
        // The customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
        logger.info('Payment confirmed successfully via Stripe', { service: 'checkout' });
        onSuccess();
      }
    } catch (err) {
      logger.error('Payment confirmation error', err as Error, { service: 'checkout' });
      setErrorMessage('An unexpected error occurred during payment processing.');
      addToast('Payment processing failed', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-100">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing} className="flex-1">
          {isProcessing ? 'Processing...' : `Pay $${amount.toLocaleString()}`}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        🔒 Secured by Stripe. No card details are stored on our servers.
      </p>
    </form>
  );
};

export default StripePaymentForm;
