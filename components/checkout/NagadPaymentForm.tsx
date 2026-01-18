import React, { useState } from 'react';
import Button from '../Button';
import { useToast } from '../../context/ToastContext';
import { logger } from '../../services/logger';

interface NagadPaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const NagadPaymentForm: React.FC<NagadPaymentFormProps> = ({ amount, onSuccess, onCancel }) => {
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
      setErrorMessage('Please enter a valid 11-digit Nagad number');
      return;
    }
    setErrorMessage(null);
    setStep('otp');
    // Simulate sending OTP
    addToast('OTP sent to your Nagad number', 'info');
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
    if (!pin || pin.length !== 4) {
      setErrorMessage('Please enter your 4-digit Nagad PIN');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Simulate Nagad payment processing
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Simulate success (95% success rate for demo)
      if (Math.random() > 0.05) {
        addToast(`Payment of ৳${amount.toLocaleString()} successful via Nagad!`, 'success');
        onSuccess();
      } else {
        throw new Error('Payment failed. Insufficient balance or network error.');
      }
    } catch (error) {
      logger.error('Nagad payment error', error as Error, { service: 'checkout' });
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
      {/* Nagad Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <h3 className="text-xl font-serif text-brand-charcoal dark:text-dark-text mb-2">
          Pay with Nagad
        </h3>
        <p className="text-brand-warm-gray dark:text-dark-text-secondary">
          Digital financial service by Bangladesh Post
        </p>
      </div>

      {/* Amount Display */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
        <div className="text-center">
          <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Payment Amount</p>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
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
                    ? 'bg-orange-500 text-white'
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
              htmlFor="nagad-phone"
              className="block text-sm font-medium text-brand-charcoal dark:text-dark-text mb-2"
            >
              Nagad Account Number
            </label>
            <div className="relative">
              <input
                id="nagad-phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="01XXXXXXXXX"
                className="input-modern w-full pl-4 pr-12"
                maxLength={11}
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-warm-gray dark:text-dark-text-secondary mt-1">
              Enter your registered Nagad mobile number
            </p>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-800">
              {errorMessage}
            </div>
          )}

          <Button type="submit" fullWidth className="bg-orange-500 hover:bg-orange-600">
            Send OTP
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nagad-otp"
              className="block text-sm font-medium text-brand-charcoal dark:text-dark-text mb-2"
            >
              Enter OTP
            </label>
            <input
              id="nagad-otp"
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
            <Button type="submit" fullWidth className="flex-1 bg-orange-500 hover:bg-orange-600">
              Verify OTP
            </Button>
          </div>
        </form>
      )}

      {step === 'pin' && (
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nagad-pin"
              className="block text-sm font-medium text-brand-charcoal dark:text-dark-text mb-2"
            >
              Enter Nagad PIN
            </label>
            <input
              id="nagad-pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              className="input-modern w-full text-center text-2xl tracking-widest"
              maxLength={4}
              required
            />
            <p className="text-xs text-brand-warm-gray dark:text-dark-text-secondary mt-1 text-center">
              Enter your 4-digit Nagad PIN to confirm payment
            </p>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-800">
              {errorMessage}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-blue-600 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Transaction Fee
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Nagad charges ৳1.50 for transactions above ৳100. Fee will be deducted from your
                  account.
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
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {isProcessing ? 'Processing...' : `Pay ${formatAmountBDT(amount)}`}
            </Button>
          </div>
        </form>
      )}

      {step === 'processing' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-charcoal dark:text-dark-text font-medium">
            Processing your Nagad payment...
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
        🔒 Secured by Nagad. Your payment information is protected.
      </p>
    </div>
  );
};

export default NagadPaymentForm;
