import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useFeaturedProducts } from '../hooks/useProducts';
import SEO from '../components/SEO';
import Image from '../components/Image';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';

const Hero: React.FC = () => (
  <div
    className="relative h-screen bg-cover bg-center"
    style={{ backgroundImage: "url('/images/hero_jewelry.png')" }}
  >
    {/* Overlay */}
    <div className="hero-overlay" />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
      <div className="gold-accent mb-8" />

      <h1 className="text-hero md:text-hero-lg lg:text-hero-xl font-display text-shadow-luxury">
        MARJAHAN&apos;S
      </h1>

      <p className="mt-6 text-xl md:text-2xl font-light tracking-widest uppercase text-white/90">
        Where Luxury Meets Elegance
      </p>

      <div className="gold-accent mt-8" />

      <Link to="/products" className="mt-12">
        <button className="btn-primary group">
          <span className="flex items-center gap-2">
            Discover Collection
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </button>
      </Link>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
        <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading: loading } = useFeaturedProducts();

  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-black/40 -z-10" />

      <div className="container-luxury">
        <div className="text-center mb-16">
          <p className="text-section-subtitle">Curated with Care</p>
          <h2 className="text-section-title mt-3 text-white">Featured Collection</h2>
          <div className="gold-accent mt-6" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-96 rounded-3xl" />
            ))}
          </div>
        ) : (
          <BentoGrid className="max-w-6xl mx-auto">
            {products?.map((product, i) => (
              <BentoGridItem
                key={product.id}
                className={i === 0 || i === 3 ? 'md:col-span-2' : 'md:col-span-1'}
                header={
                  <ProductCard
                    product={product}
                    className="h-full border-none shadow-none hover:shadow-none translate-y-0 hover:translate-y-0"
                  />
                }
              />
            ))}
          </BentoGrid>
        )}

        <div className="text-center mt-16">
          <Link to="/products">
            <button className="btn-secondary">View All Pieces</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const AboutSection: React.FC = () => (
  <section className="relative py-24 md:py-32">
    <div className="absolute inset-0 bg-black/60 -z-10" />

    <div className="container-luxury">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-[4/5] bg-gray-900 rounded overflow-hidden">
            <Image
              src="/images/diamond_ring.png"
              alt="Craftsmanship"
              className="w-full h-full"
              imgClassName="w-full h-full object-cover opacity-90"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-brand-gold/30 rounded -z-10" />
        </div>

        <div className="lg:pl-8">
          <p className="text-brand-gold text-sm tracking-widest uppercase mb-4">Our Story</p>
          <h2 className="text-section-title text-white leading-tight">
            Crafted with Passion,
            <br />
            Worn with Pride
          </h2>
          <div className="gold-accent my-8" />
          <p className="text-body mb-4">
            Each piece in our collection tells a story of meticulous craftsmanship and timeless
            elegance. From the selection of finest materials to the final polish, we pour our heart
            into every creation.
          </p>
          <p className="text-body">
            At Marjahan&apos;s, we believe luxury should be accessible. Our commitment is to bring
            you extraordinary pieces that celebrate life&apos;s precious moments.
          </p>
          <Link to="/products" className="inline-block mt-8">
            <button className="btn-primary">Explore Collection</button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const CategoriesSection: React.FC = () => {
  const categories = [
    { name: 'Rings', image: '/images/diamond_ring.png', link: '/products?category=Rings' },
    { name: 'Necklaces', image: '/images/gold_necklace.png', link: '/products?category=Necklaces' },
    {
      name: 'Bracelets',
      image: '/images/sapphire_bracelet.png',
      link: '/products?category=Bracelets',
    },
    { name: 'Earrings', image: '/images/pearl_earrings.png', link: '/products?category=Earrings' },
  ];

  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent -z-10" />

      <div className="container-luxury">
        <div className="text-center mb-16">
          <p className="text-section-subtitle">Browse By</p>
          <h2 className="text-section-title text-white mt-3">Collections</h2>
          <div className="gold-accent mt-6" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group relative aspect-square overflow-hidden rounded focus-ring"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                className="w-full h-full img-zoom"
                imgClassName="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span className="text-white font-serif text-xl tracking-wide group-hover:text-brand-gold transition-colors duration-300">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  return (
    <div>
      <SEO
        title="Home"
        description="Discover exquisite handcrafted jewelry at Marjahan's. Shop our featured collection of rings, necklaces, and more."
      />
      <Hero />
      <FeaturedProducts />
      <AboutSection />
      <CategoriesSection />
    </div>
  );
};

export default HomePage;
