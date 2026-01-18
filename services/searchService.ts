import Typesense from 'typesense';
import { Product, CategoryType } from '../types';
import { logger } from './logger';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface ProductDocument {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  tags: string[];
  inStock: boolean;
  created_at: number;
}

interface TypesenseHit {
  document: ProductDocument;
  highlights?: Array<{ field: string; snippet: string; matched_tokens: string[] }>;
  text_match?: number;
}

interface TypesenseFacet {
  field_name: string;
  counts: Array<{ value: string; count: number }>;
}

interface TypesenseSearchResponse {
  hits?: TypesenseHit[];
  facet_counts?: TypesenseFacet[];
  found?: number;
  page?: number;
  search_time_ms?: number;
}

interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  limit?: number;
  page?: number;
}

interface SearchResult {
  hits: ProductDocument[] | Product[];
  facets: TypesenseFacet[];
  total: number;
  page: number;
}

interface TypesenseConfig {
  nodes: Array<{
    host: string;
    port: number;
    protocol: string;
  }>;
  apiKey: string;
  connectionTimeoutSeconds: number;
}

interface TypesenseError extends Error {
  httpStatus?: number;
}

// Type for the Typesense client
export interface TypesenseClient {
  collections: (name?: string) => {
    documents: () => {
      search: (params: Record<string, unknown>) => Promise<TypesenseSearchResponse>;
      upsert: (doc: ProductDocument) => Promise<ProductDocument>;
      import: (docs: ProductDocument[], options: { action: string }) => Promise<unknown>;
    };
    create: (schema: Record<string, unknown>) => Promise<unknown>;
  };
}

// ============================================
// SEARCH SERVICE CLASS
// ============================================

/**
 * Typesense client instance exposed for other services
 */
export let typesenseClient: TypesenseClient | null = null;

class SearchService {
  private client: TypesenseClient | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      const typesenseConfig: TypesenseConfig = {
        nodes: [
          {
            host:
              (import.meta as { env?: Record<string, string> }).env?.VITE_TYPESENSE_HOST ||
              'localhost',
            port: parseInt(
              (import.meta as { env?: Record<string, string> }).env?.VITE_TYPESENSE_PORT || '8108',
            ),
            protocol:
              (import.meta as { env?: Record<string, string> }).env?.VITE_TYPESENSE_PROTOCOL ||
              'http',
          },
        ],
        apiKey:
          (import.meta as { env?: Record<string, string> }).env?.VITE_TYPESENSE_API_KEY || 'xyz',
        connectionTimeoutSeconds: 2,
      };

      this.client = new (
        Typesense as unknown as { Client: new (config: TypesenseConfig) => TypesenseClient }
      ).Client(typesenseConfig);
      typesenseClient = this.client;
      this.isInitialized = true;
      logger.info('Typesense client initialized', { service: 'search' });
    } catch (error) {
      logger.warn('Typesense not available, falling back to local search', {
        error: String(error),
        service: 'search',
      });
      this.isInitialized = false;
    }
  }

  async indexProduct(product: Product): Promise<void> {
    if (!this.isInitialized || !this.client) {
      logger.warn('Typesense not available, skipping indexing', { service: 'search' });
      return;
    }

    try {
      const document: ProductDocument = {
        id: product.id.toString(),
        name: product.name,
        description: product.description || '',
        category: product.category,
        price: product.price,
        image: product.images?.[0] || '',
        tags: [],
        inStock: product.stock > 0,
        created_at: product.created_at ? new Date(product.created_at).getTime() : Date.now(),
      };

      await this.client.collections('products').documents().upsert(document);
      logger.info('Indexed product', { productName: product.name, service: 'search' });
    } catch (error) {
      logger.error('Error indexing product', error as Error, {
        productId: product.id,
        service: 'search',
      });
    }
  }

  async searchProducts(query: string, filters: SearchFilters = {}): Promise<SearchResult> {
    if (!this.isInitialized || !this.client) {
      logger.warn('Typesense not available, using fallback search', { service: 'search' });
      return this.fallbackSearch(query, filters);
    }

    try {
      const searchParameters = {
        q: query,
        query_by: 'name,description,category,tags',
        filter_by: this.buildFilterString(filters),
        sort_by: filters.sortBy || '_text_match:desc,created_at:desc',
        per_page: filters.limit || 20,
        page: filters.page || 1,
        facet_by: 'category,tags',
        include_fields: 'id,name,description,category,price,image,inStock',
      };

      const result: TypesenseSearchResponse = await this.client
        .collections('products')
        .documents()
        .search(searchParameters);

      return {
        hits: result.hits?.map((hit: TypesenseHit) => hit.document) || [],
        facets: result.facet_counts || [],
        total: result.found || 0,
        page: result.page || 1,
      };
    } catch (error) {
      logger.error('Typesense search error', error as Error, { query, service: 'search' });
      return this.fallbackSearch(query, filters);
    }
  }

  private async fallbackSearch(query: string, filters: SearchFilters = {}): Promise<SearchResult> {
    try {
      const { productService } = await import('./productService');

      const productFilters: {
        search?: string;
        page?: number;
        limit?: number;
        price?: number;
        categories?: CategoryType[];
        sort?: string;
      } = {
        search: query,
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      if (filters.maxPrice) {
        productFilters.price = filters.maxPrice;
      }

      if (filters.category) {
        productFilters.categories = [filters.category as CategoryType];
      }

      if (filters.sortBy) {
        const sortMap: Record<string, string> = {
          'price:asc': 'price-low',
          'price:desc': 'price-high',
          'name:asc': 'name',
          'created_at:desc': 'newest',
        };
        productFilters.sort = sortMap[filters.sortBy] || filters.sortBy;
      }

      const { data: results, count } = await productService.getAll(productFilters);

      return {
        hits: results,
        facets: [],
        total: count,
        page: productFilters.page || 1,
      };
    } catch (error) {
      logger.error('Fallback search error', error as Error, { query, service: 'search' });
      return { hits: [], facets: [], total: 0, page: 1 };
    }
  }

  private buildFilterString(filters: SearchFilters): string {
    const conditions: string[] = [];

    if (filters.category) {
      conditions.push(`category:=${filters.category}`);
    }

    if (filters.minPrice) {
      conditions.push(`price:>=${filters.minPrice}`);
    }

    if (filters.maxPrice) {
      conditions.push(`price:<=${filters.maxPrice}`);
    }

    if (filters.inStock !== undefined) {
      conditions.push(`inStock:=${filters.inStock}`);
    }

    return conditions.join(' && ');
  }

  async initializeCollection(): Promise<void> {
    if (!this.isInitialized || !this.client) {
      logger.warn('Typesense not available, skipping collection initialization', {
        service: 'search',
      });
      return;
    }

    try {
      const schema = {
        name: 'products',
        fields: [
          { name: 'id', type: 'string' },
          { name: 'name', type: 'string', facet: false },
          { name: 'description', type: 'string', facet: false },
          { name: 'category', type: 'string', facet: true },
          { name: 'price', type: 'float', facet: false },
          { name: 'image', type: 'string', facet: false },
          { name: 'tags', type: 'string[]', facet: true },
          { name: 'inStock', type: 'bool', facet: true },
          { name: 'created_at', type: 'int64', facet: false, sort: true },
        ],
        default_sorting_field: 'created_at',
      };

      await this.client.collections().create(schema);
      logger.info('Typesense collection initialized', { service: 'search' });
    } catch (error: unknown) {
      const typesenseError = error as TypesenseError;
      if (typesenseError.httpStatus === 409) {
        logger.info('Typesense collection already exists', { service: 'search' });
      } else {
        logger.error('Error initializing Typesense collection', typesenseError, {
          service: 'search',
        });
      }
    }
  }

  async indexAllProducts(products: Product[]): Promise<void> {
    if (!this.isInitialized || !this.client) {
      logger.warn('Typesense not available, skipping bulk indexing', { service: 'search' });
      return;
    }

    try {
      const documents: ProductDocument[] = products.map((product: Product) => ({
        id: product.id.toString(),
        name: product.name,
        description: product.description || '',
        category: product.category,
        price: product.price,
        image: product.images?.[0] || '',
        tags: [],
        inStock: product.stock > 0,
        created_at: product.created_at ? new Date(product.created_at).getTime() : Date.now(),
      }));

      await this.client.collections('products').documents().import(documents, { action: 'upsert' });
      logger.info('Indexed products', { count: products.length, service: 'search' });
    } catch (error) {
      logger.error('Error bulk indexing products', error as Error, {
        count: products.length,
        service: 'search',
      });
    }
  }
}

export const searchService = new SearchService();
export default searchService;
export type { SearchFilters, SearchResult, ProductDocument };
