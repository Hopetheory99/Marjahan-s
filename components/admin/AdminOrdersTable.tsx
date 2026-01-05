import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import Image from '../Image';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface TableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: SortConfig | null;
  onSort: (key: string) => void;
}

const SortIcon = ({ direction }: { direction?: SortDirection }) => {
  if (!direction) return <span className="ml-1 text-gray-300">↕</span>;
  return <span className="ml-1 text-brand-gold">{direction === 'asc' ? '↑' : '↓'}</span>;
};

const ChevronDownIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const TableHeader: React.FC<TableHeaderProps> = ({ label, sortKey, currentSort, onSort }) => (
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

const StatusSelect: React.FC<{ status: OrderStatus; onChange: (s: OrderStatus) => void }> = ({
  status,
  onChange,
}) => {
  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Shipped: 'bg-blue-100 text-blue-800 border-blue-200',
    Delivered: 'bg-green-100 text-green-800 border-green-200',
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
        <svg
          className="fill-current h-3 w-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

interface AdminOrdersTableProps {
  orders: Order[];
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
  orders,
  sortConfig,
  onSort,
  onStatusChange,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderDetails = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <TableHeader label="Order ID" sortKey="id" currentSort={sortConfig} onSort={onSort} />
            <TableHeader
              label="Customer"
              sortKey="customerName"
              currentSort={sortConfig}
              onSort={onSort}
            />
            <TableHeader label="Date" sortKey="date" currentSort={sortConfig} onSort={onSort} />
            <TableHeader label="Total" sortKey="total" currentSort={sortConfig} onSort={onSort} />
            <TableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={onSort} />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <tr
                onClick={() => toggleOrderDetails(order.id)}
                className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${expandedOrderId === order.id ? 'bg-gray-50' : ''}`}
              >
                <td className="py-4 px-4 font-mono text-xs text-gray-500 flex items-center">
                  <span
                    className={`transform transition-transform duration-200 mr-2 ${expandedOrderId === order.id ? 'rotate-180' : ''}`}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                  {order.id}
                </td>
                <td className="py-4 px-4 font-medium text-brand-dark">{order.customerName}</td>
                <td className="py-4 px-4 text-gray-600 text-sm">{order.date}</td>
                <td className="py-4 px-4 font-medium">${order.total.toLocaleString()}</td>
                <td className="py-4 px-4">
                  <StatusSelect
                    status={order.status}
                    onChange={(s) => onStatusChange(order.id, s)}
                  />
                </td>
              </tr>
              {expandedOrderId === order.id && (
                <tr className="bg-gray-50/50 animate-fade-in">
                  <td colSpan={5} className="p-0">
                    <div className="px-6 pb-6 pt-2">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Order Items
                      </h4>
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
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded bg-gray-100"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    {item.size && (
                                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-gray-600">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-600">
                                  ${item.price.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right font-medium text-gray-900">
                                  ${(item.price * item.quantity).toLocaleString()}
                                </td>
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
  );
};

export default AdminOrdersTable;
