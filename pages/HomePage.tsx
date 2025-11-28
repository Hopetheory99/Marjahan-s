
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { useFeaturedProducts } from '../hooks/useProducts';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const Hero: React.FC = () => (
    <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/id/1074/1800/1200')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-wider">MARJAHAN'S</h1>
            <p className="mt-4 text-xl md:text-2xl font-sans font-light tracking-widest uppercase">Where Luxury Meets Affordability</p>
            <Link to="/products" className="mt-8">
                <Button variant="secondary" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
                    Shop The Collection
                </Button>
            </Link>
        </div>
    </div>
);

const FeaturedProducts: React.FC = () => {
    const { products, loading } = useFeaturedProducts();

    return (
        <div className="bg-white py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-serif text-center mb-2">Featured Collection</h2>
                <p className="text-center text-gray-600 mb-12">Handpicked pieces, curated for timeless elegance.</p>
                
                {loading ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                       {[1, 2, 3, 4].map(i => (
                           <div key={i} className="animate-pulse">
                               <div className="bg-gray-200 h-80 w-full mb-4"></div>
                               <div className="h-4 bg-gray-200 w-3/4 mx-auto mb-2"></div>
                               <div className="h-4 bg-gray-200 w-1/4 mx-auto"></div>
                           </div>
                       ))}
                   </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                 <div className="text-center mt-12">
                    <Link to="/products">
                        <Button variant="secondary">View All Products</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const HomePage: React.FC = () => {
    useDocumentTitle('Home');
    return (
        <div>
            <Hero />
            <FeaturedProducts />
        </div>
    );
};

export default HomePage;
