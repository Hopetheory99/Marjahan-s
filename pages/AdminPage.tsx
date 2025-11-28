
import React, { useState, useEffect, useMemo } from 'react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { Product, Order, OrderStatus } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type AdminTab = 'products' | 'orders';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: string;
  direction: SortDirection;
}

// Helper: Sort Data
const sortData = <T extends Record<string, any>>(data: T[], config: SortConfig | null): T[] => {
  if (!config) return data;
  
  return [...data].sort((a, b) => {
    const aValue = a[config.key];
    const bValue = b[config.key];

    if (aValue < bValue) return config.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return config.direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// --- ICONS ---
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const ChevronDownIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const SortIcon = ({ direction }: { direction?: SortDirection }) => {
    if (!direction) return <span className="ml-1 text-gray-300">↕</span>;
    return <span className="ml-1 text-brand-gold">{direction === 'asc' ? '↑' : '↓'}</span>;
};

// --- COMPONENTS ---

const StatusSelect: React.FC<{ status: OrderStatus, onChange: (s: OrderStatus) => void }> = ({ status, onChange }) => {
    const colors = {
        Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Shipped: 'bg-blue-100 text-blue-800 border-blue-200',
        Delivered: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
            <select 
                value={status}
                onChange={(e) => onChange(e.target.value as OrderStatus)}
                className={`appearance-none cursor-pointer pl-3 pr-8 py-1 rounded-full text-xs font-semibold tracking-wide border focus:outline-none focus:ring-2 focus:ring-brand-gold transition-shadow ${colors[status]}`}
            >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    )
}

const TableHeader: React.FC<{ 
    label: string; 
    sortKey: string; 
    currentSort: SortConfig | null; 
    onSort: (key: string) => void;
}> = ({ label, sortKey, currentSort, onSort }) => (
    <th 
        className="text-left py-4 px-4 uppercase font-semibold text-sm cursor-pointer hover:bg-gray-200 transition-colors select-none group"
        onClick={() => onSort(sortKey)}
    >
        <div className="flex items-center">
            {label}
            <SortIcon direction={currentSort?.key === sortKey ? currentSort.direction : undefined} />
        </div>
    </th>
);

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

    // UI State
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    // Modal / Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '', price: 0, stock: 0, description: '', metal: 'Gold', category: 'Rings', images: ['']
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsData, ordersData] = await Promise.all([
                productService.getAll(),
                orderService.getAll()
            ]);
            setProducts(productsData);
            setOrders(ordersData);
        } catch (error) {
            addToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Sorting Logic
    const handleProductSort = (key: string) => {
        setProductSort(prev => ({
            key,
            direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleOrderSort = (key: string) => {
        setOrderSort(prev => ({
            key,
            direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedProducts = useMemo(() => sortData(products, productSort), [products, productSort]);
    const sortedOrders = useMemo(() => sortData(orders, orderSort), [orders, orderSort]);

    // Order Logic
    const toggleOrderDetails = (id: string) => {
        setExpandedOrderId(prev => prev === id ? null : id);
    };

    const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
        try {
            await orderService.updateStatus(id, newStatus);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            addToast(`Order ${id} updated to ${newStatus}`, 'success');
        } catch (e) {
            addToast('Failed to update status', 'error');
        }
    };

    // Product CRUD Handlers
    const handleAddClick = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: 0, stock: 10, description: '', metal: 'Gold', category: 'Rings', images: ['https://picsum.photos/800/800'] });
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, images: [value] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-serif text-brand-dark">Dashboard</h1>
                {activeTab === 'products' && (
                    <Button onClick={handleAddClick} className="flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                        <span className="text-xl leading-none">+</span> Add Product
                    </Button>
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
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-gold rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                    {activeTab === 'products' && (
                         <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <TableHeader label="Product Name" sortKey="name" currentSort={productSort} onSort={handleProductSort} />
                                        <TableHeader label="Price" sortKey="price" currentSort={productSort} onSort={handleProductSort} />
                                        <TableHeader label="Stock" sortKey="stock" currentSort={productSort} onSort={handleProductSort} />
                                        <TableHeader label="Category" sortKey="category" currentSort={productSort} onSort={handleProductSort} />
                                        <th className="py-4 px-4 font-semibold text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedProducts.map(product => (
                                        <tr 
                                            key={product.id} 
                                            className="hover:bg-gray-50 transition-colors duration-150 group cursor-default"
                                        >
                                            <td className="py-4 px-4 font-medium text-brand-dark">{product.name}</td>
                                            <td className="py-4 px-4 text-gray-600">${product.price.toLocaleString()}</td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">{product.category}</td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex justify-end space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleEditClick(product)}
                                                        className="p-1 text-gray-400 hover:text-brand-gold transition-colors"
                                                        title="Edit"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteClick(product.id)}
                                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <TableHeader label="Order ID" sortKey="id" currentSort={orderSort} onSort={handleOrderSort} />
                                        <TableHeader label="Customer" sortKey="customerName" currentSort={orderSort} onSort={handleOrderSort} />
                                        <TableHeader label="Date" sortKey="date" currentSort={orderSort} onSort={handleOrderSort} />
                                        <TableHeader label="Total" sortKey="total" currentSort={orderSort} onSort={handleOrderSort} />
                                        <TableHeader label="Status" sortKey="status" currentSort={orderSort} onSort={handleOrderSort} />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedOrders.map(order => (
                                        <React.Fragment key={order.id}>
                                            <tr 
                                                onClick={() => toggleOrderDetails(order.id)}
                                                className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${expandedOrderId === order.id ? 'bg-gray-50' : ''}`}
                                            >
                                                <td className="py-4 px-4 font-mono text-xs text-gray-500 flex items-center">
                                                    <span className={`transform transition-transform duration-200 mr-2 ${expandedOrderId === order.id ? 'rotate-180' : ''}`}>
                                                        <ChevronDownIcon className="h-4 w-4" />
                                                    </span>
                                                    {order.id}
                                                </td>
                                                <td className="py-4 px-4 font-medium text-brand-dark">{order.customerName}</td>
                                                <td className="py-4 px-4 text-gray-600 text-sm">{order.date}</td>
                                                <td className="py-4 px-4 font-medium">${order.total.toLocaleString()}</td>
                                                <td className="py-4 px-4">
                                                    <StatusSelect status={order.status} onChange={(s) => handleStatusChange(order.id, s)} />
                                                </td>
                                            </tr>
                                            {/* Expanded Order Details */}
                                            {expandedOrderId === order.id && (
                                                <tr className="bg-gray-50/50 animate-fade-in">
                                                    <td colSpan={5} className="p-0">
                                                        <div className="px-6 pb-6 pt-2">
                                                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Order Items</h4>
                                                            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                                                                <table className="min-w-full text-sm">
                                                                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                                                        <tr>
                                                                            <th className="px-4 py-2 text-left">Product</th>
                                                                            <th className="px-4 py-2 text-center">Qty</th>
                                                                            <th className="px-4 py-2 text-right">Price</th>
                                                                            <th className="px-4 py-2 text-right">Subtotal</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100">
                                                                        {order.items.map((item, idx) => (
                                                                            <tr key={idx}>
                                                                                <td className="px-4 py-3 flex items-center gap-3">
                                                                                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
                                                                                    <div>
                                                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                                                        {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                                                                <td className="px-4 py-3 text-right text-gray-600">${item.price.toLocaleString()}</td>
                                                                                <td className="px-4 py-3 text-right font-medium text-gray-900">${(item.price * item.quantity).toLocaleString()}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    </>
                )}
            </div>

            {/* PRODUCT MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
            >
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                        <input 
                            name="name" type="text" required
                            value={formData.name} onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
                            <input 
                                name="price" type="number" min="0" required
                                value={formData.price} onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Qty</label>
                            <input 
                                name="stock" type="number" min="0" required
                                value={formData.stock} onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                            />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                            <select 
                                name="category" 
                                value={formData.category} onChange={handleInputChange}
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
                                value={formData.metal} onChange={handleInputChange}
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
                             name="description" required rows={3}
                             value={formData.description} onChange={handleInputChange}
                             className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                         />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Main Image URL</label>
                        <input 
                            name="image" type="text"
                            value={formData.images?.[0] || ''} onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full p-2 border border-gray-300 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                        />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button 
                            type="button" onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Cancel
                        </button>
                        <Button type="submit">
                            {editingProduct ? 'Save Changes' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminPage;
