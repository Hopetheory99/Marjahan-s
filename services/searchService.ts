import Typesense from 'typesense';

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

interface SearchResult {
  hits: any[];
  facets: any[];
  total: number;
  page: number;
}

class SearchService {
  private client: any = null;
  private isInitialized = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    try {
      // Typesense configuration - in production, these would come from environment variables
      const typesenseConfig = {
        nodes: [
          {
            host: (import.meta as any).env?.VITE_TYPESENSE_HOST || 'localhost',
            port: parseInt((import.meta as any).env?.VITE_TYPESENSE_PORT || '8108'),
            protocol: (import.meta as any).env?.VITE_TYPESENSE_PROTOCOL || 'http',
          },
        ],
        apiKey: (import.meta as any).env?.VITE_TYPESENSE_API_KEY || 'xyz',
        connectionTimeoutSeconds: 2,
      };

      this.client = new (Typesense as any).Client(typesenseConfig);
      this.isInitialized = true;
      console.log('🔍 Typesense client initialized');
    } catch (error) {
      console.warn('🔍 Typesense not available, falling back to local search:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Index a product in Typesense
   */
  async indexProduct(product: any): Promise<void> {
    if (!this.isInitialized || !this.client) {
      console.warn('🔍 Typesense not available, skipping indexing');
      return;
    }

    try {
      const document: ProductDocument = {
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        image: product.image,
        tags: product.tags || [],
        inStock: product.stock > 0,
        created_at: new Date(product.created_at).getTime(),
      };

      await this.client.collections('products').documents().upsert(document);
      console.log(`🔍 Indexed product: ${product.name}`);
    } catch (error) {
      console.error('🔍 Error indexing product:', error);
    }
  }

  /**
   * Search products using Typesense
   */
  async searchProducts(query: string, filters: any = {}): Promise<SearchResult> {
    if (!this.isInitialized || !this.client) {
      console.warn('🔍 Typesense not available, using fallback search');
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

      const result = await this.client.collections('products').documents().search(searchParameters);

      return {
        hits: result.hits?.map((hit) => hit.document) || [],
        facets: result.facet_counts || [],
        total: result.found || 0,
        page: result.page || 1,
      };
    } catch (error) {
      console.error('🔍 Typesense search error:', error);
      return this.fallbackSearch(query, filters);
    }
  }

  /**
   * Fallback search when Typesense is not available
   */
  private async fallbackSearch(query: string, filters: any = {}): Promise<SearchResult> {
    try {
      // Fallback: Use productService to query Supabase directly
      // This ensures we always get live data even if Typesense is down
      const { productService } = await import('./productService');

      // Map Search filters to ProductService filters
      const productFilters: any = {
        search: query,
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      if (filters.maxPrice) {
        productFilters.price = filters.maxPrice;
      }

      if (filters.category) {
        productFilters.categories = [filters.category];
      }


      if (filters.sortBy) {
        // Map sort strings
        const sortMap: Record<string, string> = {
          'price:asc': 'price-low',
          'price:desc': 'price-high',
          'name:asc': 'name',
          'created_at:desc': 'newest', // productService might default to name if unknown
        };
        productFilters.sort = sortMap[filters.sortBy] || filters.sortBy;
      }

      const { data: results, count } = await productService.getAll(productFilters);

      return {
        hits: results,
        facets: [],
        total: count,
        page: productFilters.page,
      };
    } catch (error) {
      console.error('🔍 Fallback search error:', error);
      return { hits: [], facets: [], total: 0, page: 1 };
    }
  }
  /**
   * Build filter string for Typesense
   */
  private buildFilterString(filters: any): string {
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

  /**
   * Initialize Typesense collection and schema
   */
  async initializeCollection(): Promise<void> {
    if (!this.isInitialized || !this.client) {
      console.warn('🔍 Typesense not available, skipping collection initialization');
      return;
    }

    try {
      // Define the schema
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

      // Create or update collection
      await this.client.collections().create(schema);
      console.log('🔍 Typesense collection initialized');
    } catch (error: any) {
      // Collection might already exist
      if (error.httpStatus === 409) {
        console.log('🔍 Typesense collection already exists');
      } else {
        console.error('🔍 Error initializing Typesense collection:', error);
      }
    }
  }

  /**
   * Index all products (useful for initial setup)
   */
  async indexAllProducts(products: any[]): Promise<void> {
    if (!this.isInitialized || !this.client) {
      console.warn('🔍 Typesense not available, skipping bulk indexing');
      return;
    }

    try {
      const documents: ProductDocument[] = products.map((product) => ({
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        image: product.image,
        tags: product.tags || [],
        inStock: product.stock > 0,
        created_at: new Date(product.created_at).getTime(),
      }));

      await this.client.collections('products').documents().import(documents, { action: 'upsert' });
      console.log(`🔍 Indexed ${products.length} products`);
    } catch (error) {
      console.error('🔍 Error bulk indexing products:', error);
    }
  }
}

// Export singleton instance
export const searchService = new SearchService();
export default searchService;
