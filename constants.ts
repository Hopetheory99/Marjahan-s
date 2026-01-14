import { Product, Order } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Seraphina Diamond Ring',
    description:
      'An exquisite diamond ring crafted in 18k white gold, featuring a brilliant-cut center stone surrounded by a halo of smaller diamonds.',
    price: 2500,
    images: ['/images/diamond_ring.png'],
    metal: 'Platinum',
    category: 'Rings',
    sizes: ['5', '6', '7', '8'],
    stock: 10,
  },
  {
    id: '2',
    name: 'Aurelia Gold Necklace',
    description:
      'A timeless piece, this 14k yellow gold necklace features a delicate chain and a polished pendant, perfect for everyday elegance.',
    price: 850,
    images: ['/images/gold_necklace.png'],
    metal: 'Gold',
    category: 'Necklaces',
    stock: 15,
  },
  {
    id: '3',
    name: 'Luna Pearl Earrings',
    description:
      'Classic and sophisticated, these freshwater pearl stud earrings are set in sterling silver, offering a touch of grace to any outfit.',
    price: 300,
    images: ['/images/pearl_earrings.png'],
    metal: 'Silver',
    category: 'Earrings',
    stock: 25,
  },
  {
    id: '4',
    name: 'Orion Sapphire Bracelet',
    description:
      'A stunning bracelet featuring deep blue sapphires and diamonds, set in a flexible platinum link design for maximum comfort and sparkle.',
    price: 4200,
    images: ['/images/sapphire_bracelet.png'],
    metal: 'Platinum',
    category: 'Bracelets',
    stock: 8,
  },
  {
    id: '5',
    name: 'Solstice Gold Hoops',
    description:
      'Modern and chic, these lightweight 18k gold hoop earrings are the perfect accessory for both day and night.',
    price: 650,
    images: ['/images/gold_hoops.png'],
    metal: 'Gold',
    category: 'Earrings',
    stock: 20,
  },
  {
    id: '6',
    name: 'Caspian Silver Cuff',
    description:
      'A bold statement piece, this handcrafted sterling silver cuff bracelet features an intricate, nature-inspired design.',
    price: 450,
    images: ['/images/silver_cuff.png'],
    metal: 'Silver',
    category: 'Bracelets',
    stock: 12,
  },
  {
    id: '7',
    name: 'Elysian Emerald Ring',
    description:
      'A magnificent ring featuring a vibrant, cushion-cut emerald surrounded by a double halo of sparkling diamonds, set in platinum.',
    price: 7800,
    images: ['/images/emerald_ring.png'],
    metal: 'Platinum',
    category: 'Rings',
    sizes: ['6', '7', '8'],
    stock: 5,
  },
  {
    id: '8',
    name: 'Celeste Crystal Necklace',
    description:
      'An elegant sterling silver pendant necklace featuring a teardrop crystal charm, perfect for special occasions.',
    price: 320,
    images: ['/images/silver_necklace.png'],
    metal: 'Silver',
    category: 'Necklaces',
    stock: 18,
  },
  {
    id: '9',
    name: 'Nova Diamond Studs',
    description:
      'The essential diamond studs. These brilliant-cut diamonds are set in a simple four-prong platinum setting for timeless appeal.',
    price: 1200,
    images: ['/images/diamond_studs.png'],
    metal: 'Platinum',
    category: 'Earrings',
    stock: 15,
  },
  {
    id: '10',
    name: 'Zephyr Chain Bracelet',
    description:
      'A delicate and modern chain bracelet in 14k gold, perfect for layering or wearing alone for a minimalist look.',
    price: 280,
    images: ['/images/gold_bracelet.png'],
    metal: 'Gold',
    category: 'Bracelets',
    stock: 30,
  },
  {
    id: '11',
    name: 'Valentina Ruby Ring',
    description:
      'A vintage-inspired ring featuring a deep red cushion-cut ruby surrounded by diamond accents in a rose gold setting.',
    price: 3500,
    images: ['/images/ruby_ring.png'],
    metal: 'Gold',
    category: 'Rings',
    sizes: ['5', '6', '7', '8'],
    stock: 7,
  },
];

export const ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Jane Doe',
    items: [
      {
        id: '2',
        name: 'Aurelia Gold Necklace',
        price: 850,
        image: '/images/gold_necklace.png',
        quantity: 1,
      },
      {
        id: '3',
        name: 'Luna Pearl Earrings',
        price: 300,
        image: '/images/pearl_earrings.png',
        quantity: 1,
      },
    ],
    total: 1150,
    status: 'Shipped',
    date: '2023-10-26',
  },
  {
    id: 'ORD-002',
    customerName: 'John Smith',
    items: [
      {
        id: '7',
        name: 'Elysian Emerald Ring',
        price: 7800,
        image: '/images/emerald_ring.png',
        quantity: 1,
        size: '7',
      },
    ],
    total: 7800,
    status: 'Delivered',
    date: '2023-10-24',
  },
  {
    id: 'ORD-003',
    customerName: 'Emily White',
    items: [
      {
        id: '5',
        name: 'Solstice Gold Hoops',
        price: 650,
        image: '/images/gold_hoops.png',
        quantity: 1,
      },
      {
        id: '6',
        name: 'Caspian Silver Cuff',
        price: 450,
        image: '/images/silver_cuff.png',
        quantity: 1,
      },
      {
        id: '10',
        name: 'Zephyr Chain Bracelet',
        price: 280,
        image: '/images/gold_necklace.png',
        quantity: 2,
      },
    ],
    total: 1660,
    status: 'Pending',
    date: '2023-10-27',
  },
];
