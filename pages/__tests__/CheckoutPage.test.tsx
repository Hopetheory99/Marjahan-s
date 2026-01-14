import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CheckoutPage from '../CheckoutPage';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { stripeService } from '../../services/stripeService';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('../../context/CartContext');
vi.mock('../../context/AuthContext');
vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));
vi.mock('../../services/stripeService');
vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));
// Mock Stripe Elements to avoid complex DOM testing
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: any) => <div data-testid="stripe-elements">{children}</div>,
  useStripe: () => ({}),
  useElements: () => ({}),
}));
vi.mock('../../components/checkout/StripePaymentForm', () => ({
  default: () => <div data-testid="stripe-payment-form">Stripe Form</div>,
}));

describe('CheckoutPage', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useNavigate
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    // Default mock values
    (useCart as any).mockReturnValue({
      cartItems: [{ id: '1', name: 'Ring', price: 1000, quantity: 1, image: 'img.jpg' }],
      cartTotal: 1000,
      clearCart: vi.fn(),
    });

    (useAuth as any).mockReturnValue({
      user: { email: 'test@example.com' },
    });
  });

  it('redirects if cart is empty', () => {
    (useCart as any).mockReturnValue({
      cartItems: [],
      cartTotal: 0,
    });

    render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>,
    );

    expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
  });

  it('renders shipping form with user email', () => {
    render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>,
    );

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Delivery Information')).toBeInTheDocument();
  });

  it('validates form before proceeding', async () => {
    render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>,
    );

    const continueBtn = screen.getByText('Continue to Payment');
    fireEvent.click(continueBtn);

    // Should show validation error (browser validation or custom)
    // Since we mock addToast, we can check if navigate was NOT called
    // or check for error styles if strictly tested.
    // simpler check: ensure we didn't call createPaymentIntent
    expect(stripeService.createPaymentIntent).not.toHaveBeenCalled();
  });

  it('proceeds to payment when form is valid', async () => {
    const mockCreatePaymentIntent = vi.fn().mockResolvedValue({ clientSecret: 'secret_123' });
    (stripeService.createPaymentIntent as any) = mockCreatePaymentIntent;

    render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>,
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('123 Luxury Lane'), {
      target: { value: '123 St' },
    });
    fireEvent.change(screen.getByPlaceholderText('New York'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('USA'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('10001'), { target: { value: '10001' } });

    const continueBtn = screen.getByText('Continue to Payment');
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(mockCreatePaymentIntent).toHaveBeenCalled();
    });

    // Should now be on payment step
    expect(screen.getByText('Complete Payment')).toBeInTheDocument();
  });

  it('redirects to login if user not logged in', async () => {
    (useAuth as any).mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>,
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), {
      target: { value: 'test@test.com' },
    }); // Manually enter email
    fireEvent.change(screen.getByPlaceholderText('123 Luxury Lane'), {
      target: { value: '123 St' },
    });
    fireEvent.change(screen.getByPlaceholderText('New York'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('USA'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('10001'), { target: { value: '10001' } });

    const continueBtn = screen.getByText('Continue to Payment');
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
