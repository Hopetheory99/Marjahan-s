import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import Image from './Image';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="group block h-full">
      <div className="overflow-hidden bg-gray-100 h-80 relative">
        <Image 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-serif text-lg text-brand-dark group-hover:text-brand-gold transition-colors">{product.name}</h3>
        <p className="mt-1 text-md text-gray-600 font-sans">${product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
});

export default ProductCard;