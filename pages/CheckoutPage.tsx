import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { stripeService, getStripe } from '../services/stripeService';
import Button from '../components/Button';
import { useForm } from '../hooks/useForm';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import StripePaymentForm from '../components/checkout/StripePaymentForm';
import PaymentMethodSelector, { PaymentMethod } from '../components/checkout/PaymentMethodSelector';
import BKashPaymentForm from '../components/checkout/BKashPaymentForm';
import NagadPaymentForm from '../components/checkout/NagadPaymentForm';

interface CheckoutForm extends Record<string, unknown> {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

import ErrorBoundary from '../components/ErrorBoundary';

const CheckoutPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <CheckoutPageContent />
    </ErrorBoundary>
  );
};

const CheckoutPageContent: React.FC = () => {
  useDocumentTitle('Checkout');
  const {
    cartItems,
    cartTotal,
    finalTotal,
    discountAmount,
    applyCoupon,
    removeCoupon,
    coupon,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('bkash');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { values, errors, handleChange, isValid } = useForm<CheckoutForm>(
    {
      email: user?.email || '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      country: '',
      zip: '',
    },
    {
      email: { required: true, pattern: /^\S+@\S+\.\S+$/ },
      firstName: { required: true },
      lastName: { required: true },
      address: { required: true },
      city: { required: true },
      country: { required: true },
      zip: { required: true },
    },
  );

  useEffect(() => {
    if (
      step === 'payment' &&
      selectedPaymentMethod === 'stripe' &&
      !clientSecret &&
      cartItems.length > 0
    ) {
      const initStripe = async () => {
        try {
          const response = await stripeService.createPaymentIntent(cartItems);
          setClientSecret(response.clientSecret);
        } catch (error) {
          console.error('Failed to init payment:', error);
          addToast('Could not initialize payment. Please try again.', 'error');
        }
      };
      initStripe();
    }
  }, [step, selectedPaymentMethod, clientSecret, cartItems, addToast]);

  const handleNextToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) {
      if (!user) {
        addToast('Please login to continue', 'error');
        navigate('/login');
        return;
      }

      setStep('payment');
      window.scrollTo(0, 0);
    } else {
      addToast('Please fill in all shipping details.', 'error');
    }
  };

  const handlePaymentSuccess = async () => {
    // Order was already created server-side in create-payment-intent function
    // Payment webhook will update status to 'paid'
    // Just clear cart and redirect
    clearCart();
    addToast('Payment successful! Order placed.', 'success');
    navigate('/confirmation');
  };

  if (cartItems.length === 0 && step === 'shipping') {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-serif">Your Cart is Empty</h1>
        <p className="mt-4 text-gray-600">
          Explore our luxury collection to find something special.
        </p>
        <Button variant="secondary" className="mt-8" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  const InputClass = (error?: string) =>
    `w-full p-3 border rounded transition-all duration-200 focus:outline-none focus:ring-2 ${
      error
        ? 'border-red-500 focus:ring-red-200'
        : 'border-gray-300 focus:border-brand-gold focus:ring-brand-gold/20'
    }`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${step === 'shipping' ? 'text-brand-gold font-bold' : 'text-green-600'}`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'shipping' ? 'border-brand-gold' : 'border-green-600 bg-green-50'}`}
              >
                {step === 'payment' ? '✓' : '1'}
              </span>
              <span>Shipping</span>
            </div>
            <div className="w-12 h-[2px] bg-gray-300"></div>
            <div
              className={`flex items-center gap-2 ${step === 'payment' ? 'text-brand-gold font-bold' : 'text-gray-400'}`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'payment' ? 'border-brand-gold' : 'border-gray-300'}`}
              >
                2
              </span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Checkout area */}
          <div className="lg:col-span-2">
            {step === 'shipping' ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-serif mb-6">Delivery Information</h2>
                <form onSubmit={handleNextToPayment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={values.firstName}
                        onChange={handleChange}
                        className={InputClass(errors.firstName)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={values.lastName}
                        onChange={handleChange}
                        className={InputClass(errors.lastName)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={values.email}
                      onChange={handleChange}
                      className={InputClass(errors.email)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Shipping Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Luxury Lane"
                      value={values.address}
                      onChange={handleChange}
                      className={InputClass(errors.address)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="New York"
                        value={values.city}
                        onChange={handleChange}
                        className={InputClass(errors.city)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Country
                      </label>
                      <input
                        id="country"
                        name="country"
                        type="text"
                        placeholder="USA"
                        value={values.country}
                        onChange={handleChange}
                        className={InputClass(errors.country)}
                      />
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        id="zip"
                        name="zip"
                        type="text"
                        placeholder="10001"
                        value={values.zip}
                        onChange={handleChange}
                        className={InputClass(errors.zip)}
                      />
                    </div>
                  </div>

                  <Button type="submit" fullWidth className="mt-8 h-12 text-lg">
                    Continue to Payment
                  </Button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Payment Method Selector */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <PaymentMethodSelector
                    selectedMethod={selectedPaymentMethod}
                    onMethodChange={setSelectedPaymentMethod}
                  />
                </div>

                {/* Payment Form */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-serif mb-2">Complete Payment</h2>
                  <p className="text-gray-500 mb-8 text-sm">
                    Review your order total and complete your payment securely.
                  </p>

                  {selectedPaymentMethod === 'stripe' && clientSecret && (
                    <Elements
                      stripe={getStripe()}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            colorPrimary: '#D4AF37', // Match brand gold
                          },
                        },
                      }}
                    >
                      <StripePaymentForm
                        amount={cartTotal}
                        onSuccess={handlePaymentSuccess}
                        onCancel={() => setStep('shipping')}
                      />
                    </Elements>
                  )}

                  {selectedPaymentMethod === 'bkash' && (
                    <BKashPaymentForm
                      amount={cartTotal}
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => setStep('shipping')}
                    />
                  )}

                  {selectedPaymentMethod === 'nagad' && (
                    <NagadPaymentForm
                      amount={cartTotal}
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => setStep('shipping')}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-fit lg:sticky lg:top-8">
            <h2 className="text-2xl font-serif mb-6 border-b pb-4">Order Summary</h2>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                      {item.size && (
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                          Size: {item.size}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-sans font-medium text-sm">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t mt-8 pt-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <p>Subtotal</p>
                <p>${cartTotal.toLocaleString()}</p>
              </div>

              {/* Coupon Section */}
              <div className="py-4 border-y border-dashed border-gray-200">
                {!coupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code"
                      className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-gold uppercase"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          applyCoupon(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        applyCoupon(input.value);
                        input.value = '';
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-green-50 p-2 rounded border border-green-100">
                    <div className="text-sm">
                      <p className="text-green-800 font-semibold flex items-center gap-1">
                        <span className="text-xs">🏷️</span> {coupon.code}
                      </p>
                      <p className="text-green-600 text-xs">
                        {coupon.discount_type === 'percent'
                          ? `${coupon.discount_value}% Off`
                          : `$${coupon.discount_value} Off`}
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove coupon"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <p>Discount</p>
                  <p>-${discountAmount.toLocaleString()}</p>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <p>Luxury Shipping</p>
                <p className="text-green-600 font-medium">Complimentary</p>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t mt-4 text-gray-900">
                <p>Total</p>
                <p>${finalTotal.toLocaleString()}</p>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-gray-400 text-center leading-relaxed italic">
              &quot;Excellence is not an act, but a habit.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
