import React, { useMemo } from 'react';
import { Product, Order } from '../../types';
import StatCard from './StatCard';
import Button from '../Button';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onTabChange: (tab: 'products' | 'orders' | 'coupons' | 'sync') => void;
  onEditProduct: (product: Product) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onTabChange,
  onEditProduct,
}) => {
  // Calculations
  const metrics = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter(
      (o) => o.status === 'pending' || o.status === 'processing',
    ).length;
    const lowStockItems = products.filter((p) => p.stock < 5);
    const totalProducts = products.length;

    return {
      totalRevenue,
      pendingOrders,
      lowStockItems,
      totalProducts,
    };
  }, [products, orders]);

  return (
    <div className="p-6 space-y-8 animate-fade-in-up">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon="💰"
          variant="gold"
          subtitle="All-time sales (excl. cancelled)"
        />
        <StatCard
          title="Pending Orders"
          value={metrics.pendingOrders}
          icon="📦"
          variant="burgundy"
          subtitle="Needs attention"
        />
        <StatCard
          title="Total Inventory"
          value={metrics.totalProducts}
          icon="💎"
          subtitle="Unique products in store"
        />
        <StatCard
          title="Low Stock"
          value={metrics.lowStockItems.length}
          icon="⚠️"
          variant={metrics.lowStockItems.length > 0 ? 'burgundy' : 'ivory'}
          subtitle="Items with stock < 5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Low Stock Alerts Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-luxury border border-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif text-brand-dark">Low Stock Alerts</h3>
            <span className="text-xs font-bold px-3 py-1 bg-brand-burgundy/10 text-brand-burgundy rounded-full uppercase tracking-widest">
              Critical Level: 5
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-brand-warm-gray border-b border-gray-50">
                  <th className="pb-4 font-semibold uppercase tracking-wider">Product</th>
                  <th className="pb-4 font-semibold uppercase tracking-wider">Category</th>
                  <th className="pb-4 font-semibold uppercase tracking-wider">Current Stock</th>
                  <th className="pb-4 font-semibold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {metrics.lowStockItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400 italic">
                      All products are well stocked. Perfect! ✨
                    </td>
                  </tr>
                ) : (
                  metrics.lowStockItems.slice(0, 5).map((product) => (
                    <tr key={product.id} className="group hover:bg-surface-2 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                            />
                          )}
                          <span className="font-medium text-brand-dark">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-brand-warm-gray">{product.category}</td>
                      <td className="py-4">
                        <span
                          className={`font-bold ${product.stock === 0 ? 'text-red-500' : 'text-brand-burgundy'}`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => onEditProduct(product)}
                          className="text-brand-gold hover:text-brand-burgundy font-medium text-sm transition-colors"
                        >
                          Restock →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {metrics.lowStockItems.length > 5 && (
            <div className="mt-6 pt-6 border-t border-gray-50 text-center">
              <button
                onClick={() => onTabChange('products')}
                className="text-sm text-brand-warm-gray hover:text-brand-dark font-medium underline underline-offset-4"
              >
                View all {metrics.lowStockItems.length} low stock items
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-surface-2 rounded-3xl p-8 shadow-luxury border border-transparent">
          <h3 className="text-xl font-serif text-brand-dark mb-6">Quick Hub</h3>
          <div className="grid grid-cols-1 gap-4">
            <Button
              fullWidth
              onClick={() => onTabChange('products')}
              variant="secondary"
              className="justify-start gap-4 px-6 hover:translate-x-1 transition-transform"
            >
              💎 Manage Inventory
            </Button>
            <Button
              fullWidth
              onClick={() => onTabChange('orders')}
              variant="secondary"
              className="justify-start gap-4 px-6 hover:translate-x-1 transition-transform"
            >
              📦 Process Orders
            </Button>
            <Button
              fullWidth
              onClick={() => onTabChange('coupons')}
              variant="secondary"
              className="justify-start gap-4 px-6 hover:translate-x-1 transition-transform"
            >
              🏷️ Create Discounts
            </Button>
            <Button
              fullWidth
              onClick={() => onTabChange('sync')}
              variant="secondary"
              className="justify-start gap-4 px-6 hover:translate-x-1 transition-transform"
            >
              🔄 Sync Social Data
            </Button>
          </div>

          <div className="mt-8 p-6 bg-brand-burgundy/5 rounded-2xl border border-brand-burgundy/10">
            <p className="text-xs text-brand-burgundy font-bold uppercase tracking-widest mb-2">
              Store Health
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div
                className="bg-brand-burgundy h-1.5 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.max(0, 100 - (metrics.lowStockItems.length / (metrics.totalProducts || 1)) * 100)}%`,
                }}
              />
            </div>
            <p className="text-sm text-brand-warm-gray">
              {metrics.lowStockItems.length === 0
                ? 'Perfect inventory health.'
                : `${metrics.lowStockItems.length} products need attention.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
