import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '../../context/AuthContext';
import React from 'react';

// Mock fetch globally
global.fetch = vi.fn();

const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;

describe('AuthContext', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('initializes with unauthenticated state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthProvider, null, children);
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.accessToken).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('successfully logs in with correct password', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: 'test-token-123',
        role: 'admin',
      }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthProvider, null, children);
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginSuccess = false;
    await act(async () => {
      loginSuccess = await result.current.login('correct-password');
    });

    expect(loginSuccess).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.accessToken).toBe('test-token-123');
  });

  it('fails login with incorrect password', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthProvider, null, children);
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginSuccess = false;
    await act(async () => {
      loginSuccess = await result.current.login('wrong-password');
    });

    expect(loginSuccess).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('logs out successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: 'test-token-123',
        role: 'admin',
      }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthProvider, null, children);
    const { result } = renderHook(() => useAuth(), { wrapper });

    // First login
    await act(async () => {
      await result.current.login('correct-password');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Mock logout endpoint
    mockFetch.mockResolvedValueOnce({ ok: true });

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.accessToken).toBe(null);
  });

  it('handles network errors during login', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthProvider, null, children);
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginSuccess = false;
    await act(async () => {
      loginSuccess = await result.current.login('password');
    });

    expect(loginSuccess).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('refreshes access token when provided new refresh token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: 'new-access-token',
        role: 'admin',
      }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthProvider, null, children);
    const { result } = renderHook(() => useAuth(), { wrapper });

    let refreshSuccess = false;
    await act(async () => {
      refreshSuccess = await result.current.refreshToken();
    });

    expect(refreshSuccess).toBe(true);
    expect(result.current.accessToken).toBe('new-access-token');
  });
});
