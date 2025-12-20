import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// NOTE: This provider is intentionally minimal. DO NOT use this implementation
// as a production authentication mechanism. It is a demo-only local auth
// helper. Production must implement server-backed authentication with
// httpOnly cookies or a secure token flow.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isProd = import.meta.env.MODE === 'production';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (isProd) return false; // never restore auth from client storage in prod
    try {
      return sessionStorage.getItem('isAdminAuthenticated') === 'true';
    } catch {
      return false;
    }
  });

  const login = (password: string) => {
    // Try server-backed login when API is configured
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (apiBase) {
      try {
        // Call the dev server endpoint; server returns a simple token for dev
        const res = window.fetch(`${apiBase.replace(/\/$/, '')}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        // Keep logic simple: if the endpoint returns ok, treat as authenticated
        return res.then(r => r.ok).then(ok => {
          if (ok) {
            setIsAuthenticated(true);
            try { sessionStorage.setItem('isAdminAuthenticated', 'true'); } catch {}
            return true;
          }
          return false;
        }).catch(() => false);
      } catch (err) {
        console.warn('Auth server unreachable, falling back to local dev method');
      }
    }

    // Fallback: Expect a dev-only password supplied via Vite env var: VITE_ADMIN_PASSWORD
    if (isProd) {
      console.error('Client-side admin login is disabled in production.');
      return false;
    }
    const devPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!devPassword) {
      console.warn('VITE_ADMIN_PASSWORD is not set. Admin login not available.');
      return false;
    }
    if (password === devPassword) {
      setIsAuthenticated(true);
      try { sessionStorage.setItem('isAdminAuthenticated', 'true'); } catch {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try { sessionStorage.removeItem('isAdminAuthenticated'); } catch {}
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};