import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-serif font-bold text-brand-dark mb-6">My Account</h1>

        <div className="space-y-4 mb-8">
          <div>
            <p className="block text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg text-gray-900">{user.email}</p>
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-500">Member Since</p>
            <p className="text-lg text-gray-900">
              {new Date(user.created_at || '').toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-500">Role</p>
            <p className="text-lg text-gray-900 capitalize">{profile?.role || 'Customer'}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
