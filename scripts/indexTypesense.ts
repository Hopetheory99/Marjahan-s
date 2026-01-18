import { createClient } from '@supabase/supabase-js';
import Typesense from 'typesense';
import * as dotenv from 'dotenv';
dotenv.config();

const typesense = new Typesense.Client({
  nodes: [
    {
      host: process.env.VITE_TYPESENSE_HOST || 'localhost',
      port: Number(process.env.VITE_TYPESENSE_PORT) || 8108,
      protocol: process.env.VITE_TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.VITE_TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 2,
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
);

async function indexProducts() {
  if (!process.env.VITE_TYPESENSE_HOST) {
    console.warn('Skipping Typesense indexing: VITE_TYPESENSE_HOST not defined');
    return;
  }

  console.log('Fetching products from Supabase...');
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Supabase Error:', error);
    process.exit(1);
  }

  console.log(`Found ${products?.length || 0} products. Re-creating schema...`);

  const schema = {
    name: 'products',
    fields: [
      { name: 'id', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'category', type: 'string', facet: true },
      { name: 'metal', type: 'string', facet: true },
      { name: 'price', type: 'float' },
      { name: 'stock', type: 'int32' },
      { name: 'images', type: 'string[]' },
    ],
  };

  try {
    await typesense.collections('products').delete();
  } catch (err) {
    // collection might not exist, ignore
  }

  await typesense.collections().create(schema as any);

  if (!products || products.length === 0) {
    console.log('No products to index.');
    return;
  }

  console.log('Indexing documents...');
  const documents = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    metal: p.metal,
    price: p.price,
    stock: p.stock,
    images: p.images || [],
  }));

  const results = await typesense
    .collections('products')
    .documents()
    .import(documents, { action: 'create' });
  console.log(`Indexed ${results.length} documents.`);
}

indexProducts().catch(console.error);
