import React, { useState } from 'react';
import { productService } from '../../services/productService';
import { Product, MetalType, CategoryType } from '../../types';
import Button from '../Button';
import { useToast } from '../../context/ToastContext';
import Image from '../Image';

interface FBProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: CategoryType;
  metal: MetalType;
  images: string[];
  status: 'pending' | 'imported' | 'error';
}

const EXTRACTED_PRODUCTS: FBProduct[] = [
  {
    id: 'fb-1',
    name: 'Leafbar Bracelet',
    description: 'Leafbar Bracelet. Waterproof, color guarantee, anti-tarnish.',
    price: 45.0,
    stock: 20,
    category: 'Bracelets',
    metal: 'Gold',
    images: [
      'https://scontent.fdac151-1.fna.fbcdn.net/v/t51.82787-15/590958917_17853696519593181_7034999273597650300_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=NJg8XnXXCm8Q7kNvwENZuRw&_nc_oc=AdkglgUWurZIJuJxjAfubQeJUkhWAmEOd_0x_2QuI7kCUKDLR7-w2yLl-rDBOgaw-Do&_nc_zt=23&_nc_ht=scontent.fdac151-1.fna&_nc_gid=Kt0WU245t4W8wTv1-ZDukQ&oh=00_Afk8gLI_Jr_wbful8Cp9oJGPHhmdkC7-_YCptt_yVOTrDw&oe=6959F5F8',
    ],
    status: 'pending',
  },
  {
    id: 'fb-2',
    name: 'Premium Stainless Steel Rings',
    description:
      'Premium Stainless Steel Rings. Chic stack that elevates everyday style. Color guarantee, anti-tarnish, waterproof.',
    price: 35.0,
    stock: 15,
    category: 'Rings',
    metal: 'Gold',
    images: [
      'https://scontent.fdac151-1.fna.fbcdn.net/v/t51.71878-10/589842087_860147773259581_2550165881368688505_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=5fad0e&_nc_ohc=SLCuPAO6QfQQ7kNvwHhuElt&_nc_oc=AdnOf6QEW3bGmGFUE0r59bu0ma0-8nZAwERgS5eeiPehxRmCZ8gZOmnXJuYYeRhP2_Y&_nc_zt=23&_nc_ht=scontent.fdac151-1.fna&_nc_gid=U4YZJPQhm-fQTQcS5LoIbA&oh=00_Afle9Aa5q8tf0K2tgJYQbdGmabIRa8LLx3-af_GerSlc3w&oe=6959D72A',
    ],
    status: 'pending',
  },
  {
    id: 'fb-3',
    name: 'The Duchess Chain Bracelet',
    description:
      'The Duchess Chain Bracelet. Premium stainless jewellery that transforms a simple outfit into a statement.',
    price: 55.0,
    stock: 10,
    category: 'Bracelets',
    metal: 'Platinum',
    images: [
      'https://scontent.fdac151-1.fna.fbcdn.net/v/t51.82787-15/591703172_17852112309593181_2804946966614921977_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=UboHz4Zxb5QQ7kNvwFwOiFs&_nc_oc=AdmPGMQCDhvc8w8xw0J8fvwckkBO-VlU243HKfsyZ5XHKb_PIcydiwtgIrbbP0LdiKQ&_nc_zt=23&_nc_ht=scontent.fdac151-1.fna&_nc_gid=ltU_GK49PUH4dbGBrPeeug&oh=00_AfnaMCtkD4St8RFKRnzcP1fKWV34dAWAQqFTAw5z7d1abA&oe=6959EBEB',
    ],
    status: 'pending',
  },
  {
    id: 'fb-4',
    name: 'Pookie Bracelet & Aura Ring Combo',
    description: 'Pookie Bracelet and AURA Ring Combo. A curated jewelry set.',
    price: 85.0,
    stock: 5,
    category: 'Bracelets',
    metal: 'Gold',
    images: [
      'https://scontent.fdac151-1.fna.fbcdn.net/v/t51.71878-10/588206261_1057403476447576_3488361090542314616_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=5fad0e&_nc_ohc=-sWjbsLnm5YQ7kNvwF0Px0n&_nc_oc=Adn6vq6vYLRRgLMgjZP11N3KQtKhcd9YWH3I04AjY2tRT63G-Wr56dJtC7E_8JxWPz-A&_nc_zt=23&_nc_ht=scontent.fdac151-1.fna&_nc_gid=ltU_GK49PUH4dbGBrPeeug&oh=00_AfnXn8SWxn7fHnvp0g2AQE2ODttujXslwmm20U8dLxKekQ&oe=6959F3EA',
    ],
    status: 'pending',
  },
  {
    id: 'fb-5',
    name: 'The Daisy Neckpiece',
    description: 'The Daisy Neckpiece. Elegant neckpiece showcasing flower-inspired designs.',
    price: 65.0,
    stock: 8,
    category: 'Necklaces',
    metal: 'Silver',
    images: [
      'https://scontent.fdac151-1.fna.fbcdn.net/v/t51.82787-15/587497523_17851586241593181_387627638204696622_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=e8eUn9Wum8IQ7kNvwFiULx0&_nc_oc=Adk0TTr10jjqqTAHKAsEYRzZn2jKdXnTEcs6R7lYQ8QmSdHLANehzT-29mIj1yiLulE&_nc_zt=23&_nc_ht=scontent.fdac151-1.fna&_nc_gid=ltU_GK49PUH4dbGBrPeeug&oh=00_Aflhs2h_ivp-jYmDP_Zg9dHGDtvecDywB95MjIluWKvSYQ&oe=695A0445',
    ],
    status: 'pending',
  },
];

const AdminFacebookSync: React.FC<{ onSyncComplete: () => void }> = ({ onSyncComplete }) => {
  const { addToast } = useToast();
  const [items, setItems] = useState<FBProduct[]>(EXTRACTED_PRODUCTS);
  const [syncing, setSyncing] = useState(false);

  const handleImport = async (item: FBProduct) => {
    try {
      const { id, status, ...productData } = item;
      await productService.addProduct(productData);

      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'imported' } : i)));
      addToast(`${item.name} imported successfully!`, 'success');
    } catch (error) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'error' } : i)));
      addToast(`Failed to import ${item.name}`, 'error');
    }
  };

  const handleImportAll = async () => {
    setSyncing(true);
    const pendingItems = items.filter((i) => i.status === 'pending');

    for (const item of pendingItems) {
      await handleImport(item);
    }

    setSyncing(false);
    onSyncComplete();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-serif text-brand-dark">Facebook Page Extraction</h3>
          <p className="text-sm text-gray-500 mt-1">
            Found {items.length} product(s) from{' '}
            <span className="font-semibold">Marjahans2025</span>
          </p>
        </div>
        <Button
          onClick={handleImportAll}
          disabled={syncing || items.every((i) => i.status === 'imported')}
          loading={syncing}
        >
          {syncing ? 'Importing...' : 'Import All Products'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden bg-gray-50 flex flex-col">
            <div className="aspect-square bg-gray-200 relative">
              <Image src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              {item.status === 'imported' && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    IMPORTED
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h4 className="font-serif text-lg text-brand-dark mb-2">{item.name}</h4>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{item.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-brand-gold font-bold">${item.price}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleImport(item)}
                  disabled={item.status === 'imported'}
                >
                  {item.status === 'imported' ? 'Imported' : 'Import Now'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFacebookSync;
