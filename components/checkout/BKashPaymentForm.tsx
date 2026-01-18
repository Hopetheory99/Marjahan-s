import React, { useState } from 'react';
import Button from '../Button';
import { useToast } from '../../context/ToastContext';
import { logger } from '../../services/logger';

interface BKashPaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const BKashPaymentForm: React.FC<BKashPaymentFormProps> = ({ amount, onSuccess, onCancel }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'pin' | 'processing'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addToast } = useToast();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length !== 11) {
      setErrorMessage('Please enter a valid 11-digit bKash number');
      return;
    }
    setErrorMessage(null);
    setStep('otp');
    // Simulate sending OTP
    addToast('OTP sent to your bKash number', 'info');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      return;
    }
    setErrorMessage(null);
    setStep('pin');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length !== 5) {
      setErrorMessage('Please enter your 5-digit bKash PIN');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Simulate bKash payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate success (90% success rate for demo)
      if (Math.random() > 0.1) {
        addToast(`Payment of ৳${amount.toLocaleString()} successful via bKash!`, 'success');
        onSuccess();
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error) {
      logger.error('bKash payment error', error as Error, { service: 'checkout' });
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      addToast('Payment failed', 'error');
      setIsProcessing(false);
    }
  };

  const formatAmountBDT = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* bKash Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 rounded-2xl mb-4">
          <span className="text-white font-bold text-xl">bK</span>
        </div>
        <h3 className="text-xl font-serif text-brand-charcoal dark:text-dark-text mb-2">
          Pay with bKash
        </h3>
        <p className="text-brand-warm-gray dark:text-dark-text-secondary">
          Secure mobile payment for Bangladesh
        </p>
      </div>

      {/* Amount Display */}
      <div className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-4 rounded-xl border border-pink-200 dark:border-pink-800">
        <div className="text-center">
          <p className="text-sm text-pink-600 dark:text-pink-400 mb-1">Payment Amount</p>
          <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">
            {formatAmountBDT(amount)}
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          {['phone', 'otp', 'pin'].map((stepName, index) => (
            <React.Fragment key={stepName}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step === stepName
                    ? 'bg-pink-500 text-white'
                    : ['phone', 'otp', 'pin'].indexOf(step) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              {index < 2 && (
                <div
                  className={`w-8 h-0.5 transition-colors ${
                    ['phone', 'otp', 'pin'].indexOf(step) > index
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Forms */}
      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bkash-phone"
              className="block text-sm font-medium text-brand-charcoal dark:text-dark-text mb-2"
            >
              bKash Account Number
            </label>
            <div className="relative">
              <input
                id="bkash-phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="01XXXXXXXXX"
                className="input-modern w-full pl-4 pr-12"
                maxLength={11}
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-warm-gray dark:text-dark-text-secondary mt-1">
              Enter your registered bKash mobile number
            </p>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-800">
              {errorMessage}
            </div>
          )}

          <Button type="submit" fullWidth className="bg-pink-500 hover:bg-pink-600">
            Send OTP
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bkash-otp"
              className="block text-sm font-medium text-brand-charcoal dark:text-dark-text mb-2"
            >
              Enter OTP
            </label>
            <input
              id="bkash-otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="input-modern w-full text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
            <p className="text-xs text-brand-warm-gray dark:text-dark-text-secondary mt-1 text-center">
              Enter the 6-digit code sent to {phoneNumber}
            </p>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-800">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep('phone')}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" fullWidth className="flex-1 bg-pink-500 hover:bg-pink-600">
              Verify OTP
            </Button>
          </div>
        </form>
      )}

      {step === 'pin' && (
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bkash-pin"
              className="block text-sm font-medium text-brand-charcoal dark:text-dark-text mb-2"
            >
              Enter bKash PIN
            </label>
            <input
              id="bkash-pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="•••••"
              className="input-modern w-full text-center text-2xl tracking-widest"
              maxLength={5}
              required
            />
            <p className="text-xs text-brand-warm-gray dark:text-dark-text-secondary mt-1 text-center">
              Enter your 5-digit bKash PIN to confirm payment
            </p>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-800">
              {errorMessage}
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-yellow-600 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Payment Confirmation
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  You will receive a confirmation SMS after successful payment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep('otp')}
              disabled={isProcessing}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-pink-500 hover:bg-pink-600"
            >
              {isProcessing ? 'Processing...' : `Pay ${formatAmountBDT(amount)}`}
            </Button>
          </div>
        </form>
      )}

      {step === 'processing' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-charcoal dark:text-dark-text font-medium">
            Processing your bKash payment...
          </p>
          <p className="text-sm text-brand-warm-gray dark:text-dark-text-secondary mt-2">
            Please wait while we confirm your payment
          </p>
        </div>
      )}

      {/* Cancel Button */}
      <div className="pt-4 border-t border-brand-cream dark:border-dark-border">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isProcessing}
          fullWidth
        >
          Cancel Payment
        </Button>
      </div>

      {/* Security Notice */}
      <p className="text-xs text-brand-warm-gray dark:text-dark-text-secondary text-center">
        🔒 Secured by bKash. Your payment information is protected.
      </p>
    </div>
  );
};

export default BKashPaymentForm;
