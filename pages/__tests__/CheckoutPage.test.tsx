import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CheckoutPage from '../CheckoutPage';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { stripeService } from '../../services/stripeService';

// Mock dependencies
vi.mock('../../context/CartContext', async () => {
  const actual = await vi.importActual<any>('../../context/CartContext');
  return {
    ...actual,
    useCart: vi.fn(),
  };
});
vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual<any>('../../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});
vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ addToast: vi.fn() }),
  ToastProvider: ({ children }: any) => children,
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

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock values
    (useCart as any).mockReturnValue({
      cartItems: [{ id: '1', name: 'Ring', price: 1000, quantity: 1, image: 'img.jpg' }],
      cartTotal: 1000,
      finalTotal: 1000,
      discountAmount: 0,
      coupon: null,
      applyCoupon: vi.fn(),
      removeCoupon: vi.fn(),
      clearCart: vi.fn(),
      cartCount: 1,
      isCartOpen: false,
      openCart: vi.fn(),
      closeCart: vi.fn(),
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
    });

    (useAuth as any).mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
    });
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it('redirects if cart is empty', () => {
    (useCart as any).mockReturnValue({
      cartItems: [],
      cartTotal: 0,
      finalTotal: 0,
      discountAmount: 0,
      coupon: null,
    });

    renderWithRouter(<CheckoutPage />);

    expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
  });

  it('renders shipping form with user email', () => {
    renderWithRouter(<CheckoutPage />);

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Delivery Information')).toBeInTheDocument();
  });

  it('validates form before proceeding', async () => {
    renderWithRouter(<CheckoutPage />);

    const continueBtn = screen.getByText('Continue to Payment');
    fireEvent.click(continueBtn);

    expect(stripeService.createPaymentIntent).not.toHaveBeenCalled();
  });

  it('proceeds to payment when form is valid', async () => {
    const mockCreatePaymentIntent = vi.fn().mockResolvedValue({ clientSecret: 'secret_123' });
    (stripeService.createPaymentIntent as any) = mockCreatePaymentIntent;

    renderWithRouter(<CheckoutPage />);

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

    // Switch to Stripe (default is usually bkash)
    const stripeOption = screen.getByText('Credit/Debit Card');
    fireEvent.click(stripeOption);

    await waitFor(() => {
      expect(mockCreatePaymentIntent).toHaveBeenCalled();
    });

    expect(screen.getByText('Complete Payment')).toBeInTheDocument();
  });

  it('redirects to login if user not logged in', async () => {
    (useAuth as any).mockReturnValue({ user: null });
    (useCart as any).mockReturnValue({
      cartItems: [{ id: '1', name: 'Ring', price: 1000, quantity: 1, image: 'img.jpg' }],
      cartTotal: 1000,
      finalTotal: 1000,
      discountAmount: 0,
      coupon: null,
      applyCoupon: vi.fn(),
      removeCoupon: vi.fn(),
    });

    renderWithRouter(<CheckoutPage />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('123 Luxury Lane'), {
      target: { value: '123 St' },
    });
    fireEvent.change(screen.getByPlaceholderText('New York'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('USA'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText('10001'), { target: { value: '10001' } });

    const continueBtn = screen.getByText('Continue to Payment');
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith('/login');
    });
  });
});
