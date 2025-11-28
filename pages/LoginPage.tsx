import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // @ts-ignore - 'state' might not exist on location, handled by optional chaining/fallback
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      addToast('Welcome back, Admin.', 'success');
      navigate(from, { replace: true });
    } else {
      addToast('Invalid credentials. Hint: admin123', 'error');
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 flex flex-col items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <h1 className="text-3xl font-serif text-center mb-6 text-brand-dark">Admin Access</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Please enter your credentials to continue.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              placeholder="Enter admin password"
            />
          </div>
          
          <Button type="submit" fullWidth>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;