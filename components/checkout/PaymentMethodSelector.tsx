import React from 'react';

export type PaymentMethod = 'stripe' | 'bkash' | 'nagad';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const methods = [
    {
      id: 'stripe' as PaymentMethod,
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="9" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="15" cy="12" r="1" fill="currentColor" />
        </svg>
      ),
      popular: false,
    },
    {
      id: 'bkash' as PaymentMethod,
      name: 'bKash',
      description: "Bangladesh's leading mobile payment",
      icon: (
        <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">bK</span>
        </div>
      ),
      popular: true,
    },
    {
      id: 'nagad' as PaymentMethod,
      name: 'Nagad',
      description: 'Digital financial service by Bangladesh Post',
      icon: (
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
      ),
      popular: true,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-brand-charcoal dark:text-dark-text mb-4">
        Choose Payment Method
      </h3>

      <div className="grid gap-3">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`
              relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300
              ${
                selectedMethod === method.id
                  ? 'border-brand-gold bg-brand-gold/5 shadow-lg'
                  : 'border-brand-cream dark:border-dark-border hover:border-brand-gold/50'
              }
              ${method.popular ? 'ring-1 ring-brand-gold/20' : ''}
            `}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onMethodChange(method.id)}
              className="sr-only"
            />

            <div className="flex items-center flex-1">
              <div
                className={`mr-4 ${selectedMethod === method.id ? 'text-brand-gold' : 'text-brand-warm-gray'}`}
              >
                {method.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${
                      selectedMethod === method.id
                        ? 'text-brand-charcoal dark:text-dark-text'
                        : 'text-brand-charcoal dark:text-dark-text'
                    }`}
                  >
                    {method.name}
                  </span>
                  {method.popular && (
                    <span className="px-2 py-1 text-xs bg-brand-gold/10 text-brand-gold rounded-full font-medium">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-brand-warm-gray dark:text-dark-text-secondary mt-1">
                  {method.description}
                </p>
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedMethod === method.id
                    ? 'border-brand-gold bg-brand-gold'
                    : 'border-brand-cream dark:border-dark-border'
                }`}
              >
                {selectedMethod === method.id && (
                  <div className="w-2 h-2 bg-white rounded-full animate-scale-in"></div>
                )}
              </div>
            </div>

            {/* Selection indicator */}
            {selectedMethod === method.id && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center animate-bounce-in">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Security notice */}
      <div className="mt-6 p-4 bg-brand-ivory/50 dark:bg-dark-surface border border-brand-cream dark:border-dark-border rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 text-green-600 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-brand-charcoal dark:text-dark-text mb-1">
              Secure Payment
            </h4>
            <p className="text-sm text-brand-warm-gray dark:text-dark-text-secondary">
              All transactions are encrypted and secure. Your payment information is protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
