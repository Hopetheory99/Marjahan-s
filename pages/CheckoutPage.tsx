import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
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

const CheckoutPage: React.FC = () => {
  useDocumentTitle('Checkout');
  const { cartItems, cartTotal, clearCart } = useCart();
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

  const handleNextToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) {
      if (!user) {
        addToast('Please login to continue', 'error');
        navigate('/login');
        return;
      }

      // Only initialize Stripe if Stripe is selected
      if (selectedPaymentMethod === 'stripe') {
        try {
          const response = await stripeService.createPaymentIntent(cartTotal);
          setClientSecret(response.clientSecret);
        } catch (error) {
          console.error('Failed to init payment:', error);
          addToast('Could not initialize payment. Please try again.', 'error');
          return;
        }
      }

      setStep('payment');
      window.scrollTo(0, 0);
    } else {
      addToast('Please fill in all shipping details.', 'error');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await orderService.createOrder(user!.id, cartItems, cartTotal);
      clearCart();
      addToast('Payment successful! Order placed.', 'success');
      navigate('/confirmation');
    } catch (error) {
      console.error('Order creation error:', error);
      addToast('Order recorded with payment, but redirecting to support.', 'info');
      navigate('/confirmation');
    }
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={values.firstName}
                        onChange={handleChange}
                        className={InputClass(errors.firstName)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={values.email}
                      onChange={handleChange}
                      className={InputClass(errors.email)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Address
                    </label>
                    <input
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        name="city"
                        type="text"
                        placeholder="New York"
                        value={values.city}
                        onChange={handleChange}
                        className={InputClass(errors.city)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        name="country"
                        type="text"
                        placeholder="USA"
                        value={values.country}
                        onChange={handleChange}
                        className={InputClass(errors.country)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
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
              <div className="flex justify-between text-gray-600">
                <p>Luxury Shipping</p>
                <p className="text-green-600 font-medium">Complimentary</p>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t mt-4 text-gray-900">
                <p>Total</p>
                <p>${cartTotal.toLocaleString()}</p>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-gray-400 text-center leading-relaxed italic">
              "Excellence is not an act, but a habit."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
