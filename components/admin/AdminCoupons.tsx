import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Coupon } from '../../types';
import { useToast } from '../../context/ToastContext';
import { logger } from '../../services/logger';
import Button from '../Button';
import Modal from '../Modal';

const AdminCoupons: React.FC = () => {
  const { addToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discount_type: 'percent',
    discount_value: 0,
    min_order_value: 0,
    max_discount_amount: null,
    is_active: true,
    expires_at: null,
    usage_limit: null,
  });

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      logger.error('Error fetching coupons', error as Error, { service: 'admin' });
      addToast('Failed to load coupons', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      addToast('Coupon deleted successfully', 'success');
    } catch (error) {
      logger.error('Failed to delete coupon', error as Error, { couponId: id, service: 'admin' });
      addToast('Failed to delete coupon', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('coupons').insert([formData]).select().single();

      if (error) throw error;

      setCoupons((prev) => [data, ...prev]);
      addToast('Coupon created successfully', 'success');
      setIsModalOpen(false);
      setFormData({
        code: '',
        discount_type: 'percent',
        discount_value: 0,
        min_order_value: 0,
        max_discount_amount: null,
        is_active: true,
        expires_at: null,
        usage_limit: null,
      });
    } catch (error) {
      logger.error('Coupon operation failed', error as Error, { service: 'admin' });
      addToast('Failed to create coupon', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'code' || name === 'expires_at' || name === 'discount_type'
          ? value
          : value === ''
            ? null
            : Number(value),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-gray-800">Coupon Management</h2>
        <Button onClick={() => setIsModalOpen(true)}>+ New Coupon</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Code</th>
                <th className="p-4 font-semibold text-gray-600">Type</th>
                <th className="p-4 font-semibold text-gray-600">Value</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Usage</th>
                <th className="p-4 font-semibold text-gray-600">Expires</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Loading coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No coupons found. Create one to get started.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono font-medium text-brand-dark">{coupon.code}</td>
                    <td className="p-4 capitalize">{coupon.discount_type}</td>
                    <td className="p-4 font-medium">
                      {coupon.discount_type === 'percent'
                        ? `${coupon.discount_value}%`
                        : `$${coupon.discount_value}`}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {coupon.times_used} / {coupon.usage_limit || '∞'}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {coupon.expires_at
                        ? new Date(coupon.expires_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Coupon">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="coupon-code" className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code
            </label>
            <input
              id="coupon-code"
              name="code"
              type="text"
              required
              placeholder="SUMMER2025"
              className="w-full p-2 border border-gray-300 rounded uppercase"
              value={formData.code}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="discount-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Type
              </label>
              <select
                id="discount-type"
                name="discount_type"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.discount_type}
                onChange={handleInputChange}
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="discount-value"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Value
              </label>
              <input
                id="discount-value"
                name="discount_value"
                type="number"
                min="0"
                required
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.discount_value}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="min-order-value"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Min Order ($)
              </label>
              <input
                id="min-order-value"
                name="min_order_value"
                type="number"
                min="0"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.min_order_value || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="usage-limit" className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit
              </label>
              <input
                id="usage-limit"
                name="usage_limit"
                type="number"
                min="0"
                placeholder="Unlimited"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.usage_limit || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="expires-at" className="block text-sm font-medium text-gray-700 mb-1">
              Expires At (Optional)
            </label>
            <input
              id="expires-at"
              name="expires_at"
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.expires_at || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" fullWidth>
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCoupons;
