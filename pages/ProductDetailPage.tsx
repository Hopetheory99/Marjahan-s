
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { useProductDetail } from '../hooks/useProducts';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  
  const { product, loading, error } = useProductDetail(id);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  
  // Set page title once product is loaded
  useDocumentTitle(product ? product.name : 'Loading...');

  // Update local state when product data arrives
  useEffect(() => {
    if (product) {
        setSelectedImage(product.images[0]);
        if (product.sizes) {
            setSelectedSize(product.sizes[0]);
        }
    }
  }, [product]);

  // Redirect on error
  useEffect(() => {
      if (error) {
          navigate('/products');
      }
  }, [error, navigate]);

  if (loading) {
    return (
        <div className="container mx-auto px-6 py-12 animate-pulse">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="bg-gray-200 h-96 rounded-lg"></div>
                 <div className="space-y-4">
                     <div className="bg-gray-200 h-10 w-3/4"></div>
                     <div className="bg-gray-200 h-8 w-1/4"></div>
                     <div className="bg-gray-200 h-24 w-full"></div>
                 </div>
             </div>
        </div>
    );
  }

  if (!product) return null;
  
  const handleAddToCart = () => {
      if (quantity > product.stock) {
          addToast(`Sorry, we only have ${product.stock} of this item in stock.`, 'error');
          return;
      }
      addToCart(product, quantity, selectedSize);
      addToast(`Added ${quantity} ${product.name} to bag.`, 'success');
  };

  const handleQuantityChange = (val: number) => {
      if (val > product.stock) {
          addToast(`Max stock available is ${product.stock}`, 'info');
          setQuantity(product.stock);
      } else if (val < 1) {
          setQuantity(1);
      } else {
          setQuantity(val);
      }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img src={selectedImage} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg mb-4 transition-all duration-300"/>
          <div className="flex space-x-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                className={`w-24 h-24 object-cover cursor-pointer rounded ${selectedImage === img ? 'border-2 border-brand-gold' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-serif mb-4">{product.name}</h1>
          <p className="text-2xl font-sans text-gray-700 mb-6">${product.price.toLocaleString()}</p>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          
          <div className="flex items-center space-x-4 mb-6">
            <span className="font-semibold">Metal:</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{product.metal}</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
             <span className="font-semibold">Availability:</span>
             <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                 {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
             </span>
          </div>
          
          {product.sizes && (
              <div className="mb-6">
                  <label htmlFor="size" className="font-semibold block mb-2">Select Size:</label>
                  <select 
                    id="size" 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full md:w-auto focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                  >
                      {product.sizes.map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
              </div>
          )}

          <div className="flex items-center space-x-4 mb-8">
            <label htmlFor="quantity" className="font-semibold">Quantity:</label>
            <input 
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                className="w-20 text-center border border-gray-300 p-2 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                min="1"
                max={product.stock}
            />
          </div>
          
          <Button 
            onClick={handleAddToCart} 
            fullWidth 
            className="md:w-auto"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
