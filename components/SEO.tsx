import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ProductStructuredData {
  name: string;
  description: string;
  image: string[];
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
    condition: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  brand: {
    name: string;
  };
}

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  product?: ProductStructuredData;
  type?: 'website' | 'product';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = "Marjahan's Jewelry - Exquisite Handcrafted Jewelry",
  image = '/og-image.jpg',
  url,
  product,
  type = 'website',
}) => {
  const siteTitle = `${title} | Marjahan's Jewelry`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Generate JSON-LD structured data
  const generateStructuredData = () => {
    if (product) {
      // Product structured data
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        offers: {
          '@type': 'Offer',
          price: product.offers.price,
          priceCurrency: product.offers.priceCurrency,
          availability: product.offers.availability,
          condition: product.offers.condition,
          seller: {
            '@type': 'Organization',
            name: "Marjahan's Jewelry",
          },
        },
        brand: product.brand,
        ...(product.aggregateRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.aggregateRating.ratingValue,
            reviewCount: product.aggregateRating.reviewCount,
          },
        }),
      };
    } else {
      // Organization/Website structured data
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: "Marjahan's Jewelry",
        url: typeof window !== 'undefined' ? window.location.origin : 'https://marjahans.com',
        logo: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png',
        description: 'Exquisite handcrafted luxury jewelry for discerning customers',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+880-123-456-7890',
          contactType: 'customer service',
          availableLanguage: 'English',
        },
        sameAs: [
          'https://www.facebook.com/marjahansjewelry',
          'https://www.instagram.com/marjahansjewelry',
        ],
      };
    }
  };

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Marjahan's Jewelry" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(generateStructuredData())}</script>
    </Helmet>
  );
};

export default SEO;
