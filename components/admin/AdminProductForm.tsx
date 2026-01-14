import React from 'react';
import { Product } from '../../types';
import Button from '../Button';

interface AdminProductFormProps {
  formData: Partial<Product>;
  isEditing: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({
  formData,
  isEditing,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
        <input
          name="name"
          type="text"
          required
          value={formData.name || ''}
          onChange={onInputChange}
          className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
          <input
            name="price"
            type="number"
            min="0"
            required
            value={formData.price || 0}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Qty</label>
          <input
            name="stock"
            type="number"
            min="0"
            required
            value={formData.stock || 0}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category || 'Rings'}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          >
            <option value="Rings">Rings</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Earrings">Earrings</option>
            <option value="Bracelets">Bracelets</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Metal</label>
          <select
            name="metal"
            value={formData.metal || 'Gold'}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
          >
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          required
          rows={3}
          value={formData.description || ''}
          onChange={onInputChange}
          className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Main Image URL</label>
        <input
          name="image"
          type="text"
          value={formData.images?.[0] || ''}
          onChange={onInputChange}
          placeholder="https://example.com/image.jpg"
          className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
        />
      </div>
      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          Cancel
        </button>
        <Button type="submit">{isEditing ? 'Save Changes' : 'Create Product'}</Button>
      </div>
    </form>
  );
};

export default AdminProductForm;
