import { searchService } from './searchService';
import productsData from '../data/products.json';

/**
 * Script to index all products in Typesense
 * Run this once during deployment or when products are updated
 */
export async function indexAllProducts() {
  console.log('🔍 Starting product indexing...');

  try {
    // Initialize Typesense collection
    await searchService.initializeCollection();

    // Index all products
    await searchService.indexAllProducts(productsData);

    console.log('✅ All products indexed successfully!');
  } catch (error) {
    console.error('❌ Error indexing products:', error);
  }
}

// For development/testing - can be called from browser console
if (typeof window !== 'undefined') {
  (window as any).indexProducts = indexAllProducts;
}
