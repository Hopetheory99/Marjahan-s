import React from 'react';
import { Product } from '../../types';

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

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
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

interface AdminProductsTableProps {
  products: Product[];
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const AdminProductsTable: React.FC<AdminProductsTableProps> = ({
  products,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <TableHeader
              label="Product Name"
              sortKey="name"
              currentSort={sortConfig}
              onSort={onSort}
            />
            <TableHeader label="Price" sortKey="price" currentSort={sortConfig} onSort={onSort} />
            <TableHeader label="Stock" sortKey="stock" currentSort={sortConfig} onSort={onSort} />
            <TableHeader
              label="Category"
              sortKey="category"
              currentSort={sortConfig}
              onSort={onSort}
            />
            <th className="py-4 px-4 font-semibold text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-gray-50 transition-colors duration-150 group cursor-default"
            >
              <td className="py-4 px-4 font-medium text-brand-dark">{product.name}</td>
              <td className="py-4 px-4 text-gray-600">${product.price.toLocaleString()}</td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-600">{product.category}</td>
              <td className="py-4 px-4 text-right">
                <div className="flex justify-end space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-1 text-gray-400 hover:text-brand-gold transition-colors"
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
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
  );
};

export default AdminProductsTable;
