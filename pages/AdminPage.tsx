import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { Product, Order, OrderStatus } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { z } from 'zod';

// Modular Components
import AdminProductsTable from '../components/admin/AdminProductsTable';
import AdminOrdersTable from '../components/admin/AdminOrdersTable';
import AdminProductForm from '../components/admin/AdminProductForm';
import AdminFacebookSync from '../components/admin/AdminFacebookSync';
import { sortData, SortConfig } from '../utils/sortUtils';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int('Stock must be an integer').min(0, 'Stock must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  metal: z.enum(['Gold', 'Silver', 'Platinum']),
  category: z.enum(['Rings', 'Necklaces', 'Earrings', 'Bracelets']),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
});

type AdminTab = 'products' | 'orders' | 'sync';

const AdminPage: React.FC = () => {
  useDocumentTitle('Admin Dashboard');
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting State
  const [productSort, setProductSort] = useState<SortConfig | null>(null);
  const [orderSort, setOrderSort] = useState<SortConfig | null>(null);

  // Modal / Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    metal: 'Gold',
    category: 'Rings',
    images: [''],
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsData, ordersData] = await Promise.all([
        productService.getAll(),
        orderService.getAll(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sorting Handlers
  const handleProductSort = (key: string) => {
    setProductSort((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleOrderSort = (key: string) => {
    setOrderSort((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedProducts = useMemo(() => sortData(products, productSort), [products, productSort]);
  const sortedOrders = useMemo(() => sortData(orders, orderSort), [orders, orderSort]);

  // Order Handlers
  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateStatus(id, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
      addToast(`Order ${id} updated to ${newStatus}`, 'success');
    } catch (e) {
      addToast('Failed to update status', 'error');
    }
  };

  // Product CRUD Handlers
  const handleSeedClick = async () => {
    if (window.confirm('This will seed the database with initial products. Continue?')) {
      try {
        await productService.seedProducts();
        addToast('Database seeded successfully', 'success');
        fetchData();
      } catch (e) {
        addToast('Failed to seed database', 'error');
      }
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      stock: 10,
      description: '',
      metal: 'Gold',
      category: 'Rings',
      images: ['https://picsum.photos/800/800'],
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        addToast('Product deleted successfully', 'success');
        fetchData();
      } catch (e) {
        addToast('Failed to delete product', 'error');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = productSchema.safeParse(formData);
    if (!result.success) {
      const errorMsg = result.error.errors.map((err) => err.message).join('. ');
      addToast(errorMsg, 'error');
      return;
    }

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        addToast('Product updated successfully', 'success');
      } else {
        await productService.addProduct(formData as Product);
        addToast('Product added successfully', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      addToast('Operation failed', 'error');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, images: [value] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'price' || name === 'stock' ? Number(value) : value,
      }));
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif text-brand-dark">Dashboard</h1>
        {activeTab === 'products' && (
          <div className="flex gap-3">
            <Button onClick={handleSeedClick} variant="secondary">
              Seed DB
            </Button>
            <Button
              onClick={handleAddClick}
              className="shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              + Add Product
            </Button>
          </div>
        )}
      </div>

      <div className="flex border-b mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-6 text-sm font-semibold tracking-wide uppercase transition-colors ${activeTab === 'products' ? 'border-b-2 border-brand-dark text-brand-dark' : 'text-gray-400 hover:text-brand-gold'}`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-6 text-sm font-semibold tracking-wide uppercase transition-colors ${activeTab === 'orders' ? 'border-b-2 border-brand-dark text-brand-dark' : 'text-gray-400 hover:text-brand-gold'}`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('sync')}
          className={`py-3 px-6 text-sm font-semibold tracking-wide uppercase transition-colors ${activeTab === 'sync' ? 'border-b-2 border-brand-dark text-brand-dark' : 'text-gray-400 hover:text-brand-gold'}`}
        >
          Social Sync
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-gold rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'products' ? (
              <AdminProductsTable
                products={sortedProducts}
                sortConfig={productSort}
                onSort={handleProductSort}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ) : activeTab === 'orders' ? (
              <AdminOrdersTable
                orders={sortedOrders}
                sortConfig={orderSort}
                onSort={handleOrderSort}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <AdminFacebookSync onSyncComplete={fetchData} />
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <AdminProductForm
          formData={formData}
          isEditing={!!editingProduct}
          onInputChange={handleInputChange}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AdminPage;
