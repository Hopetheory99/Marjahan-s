import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '../../services/supabaseClient';

// Mock Supabase is largely handled in vitest.setup.ts,
// but we might need to spy on specific methods here.

const TestComponent = () => {
  const { user, loading, signInWithEmail, signOut } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No User'}</div>
      <button onClick={() => signInWithEmail('test@example.com')}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides initial state correctly', async () => {
    // Mock getSession to return null session immediately
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // It should start loading, then finish
    // Since we removed the test hack, we rely on the effect to run
    // Using waitFor to handle the state update
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('No User');
    });
  });

  it('calls signInWithOtp when signInWithEmail is called', async () => {
    // Mock successful sign in
    (supabase.auth.signInWithOtp as any).mockResolvedValue({ error: null });
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => screen.getByTestId('user-email'));

    const signInBtn = screen.getByText('Sign In');
    await act(async () => {
      signInBtn.click();
    });

    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'test@example.com',
      options: {
        emailRedirectTo: expect.any(String),
      },
    });
  });

  it('calls signOut when signOut is called', async () => {
    (supabase.auth.signOut as any).mockResolvedValue({ error: null });
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => screen.getByTestId('user-email'));

    const signOutBtn = screen.getByText('Sign Out');
    await act(async () => {
      signOutBtn.click();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
