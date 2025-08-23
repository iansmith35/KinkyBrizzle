import { Product, Order, OrderStatus, EtsyListing, SocialPost, CartItem, CustomDesignRequest } from '../types';

// --- MOCK DATA ---
const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Classic Smiley T-Shirt',
    description: 'A comfortable and stylish tee featuring the iconic smiley face. Made from 100% premium cotton.',
    price: 24.99,
    imageUrl: 'https://picsum.photos/seed/smiley/800/800',
    mockupUrls: ['https://picsum.photos/seed/smiley-front/800/800', 'https://picsum.photos/seed/smiley-back/800/800', 'https://picsum.photos/seed/smiley-model/800/800'],
    variants: {
      sizes: [
        { id: 'size_s', name: 'Size', value: 'S', priceModifier: 0 },
        { id: 'size_m', name: 'Size', value: 'M', priceModifier: 0 },
        { id: 'size_l', name: 'Size', value: 'L', priceModifier: 0 },
        { id: 'size_xl', name: 'Size', value: 'XL', priceModifier: 2.50 },
      ],
      colors: [
        { id: 'color_white', name: 'Color', value: 'White', priceModifier: 0 },
        { id: 'color_black', name: 'Color', value: 'Black', priceModifier: 0 },
        { id: 'color_heather', name: 'Color', value: 'Heather Grey', priceModifier: 1.00 },
      ]
    },
    sku: 'KB-SMILEY-TEE',
    isAdult: false,
  },
  {
    id: 'prod_2',
    name: '"Brizzle" Signature Hoodie',
    description: 'Stay warm and trendy with our signature "Brizzle" hoodie. Ultra-soft fleece interior.',
    price: 59.99,
    imageUrl: 'https://picsum.photos/seed/brizzle/800/800',
    mockupUrls: ['https://picsum.photos/seed/brizzle-front/800/800', 'https://picsum.photos/seed/brizzle-back/800/800'],
     variants: {
      sizes: [
        { id: 'size_s', name: 'Size', value: 'S', priceModifier: 0 },
        { id: 'size_m', name: 'Size', value: 'M', priceModifier: 0 },
        { id: 'size_l', name: 'Size', value: 'L', priceModifier: 0 },
      ],
      colors: [
        { id: 'color_navy', name: 'Color', value: 'Navy', priceModifier: 0 },
        { id: 'color_maroon', name: 'Color', value: 'Maroon', priceModifier: 0 },
      ]
    },
    sku: 'KB-BRIZZLE-HOODIE',
    isAdult: true,
  }
];

const mockOrders: Order[] = [
    { id: 'ord_1001', customerName: 'Alice Johnson', items: [{ productId: 'prod_1', quantity: 1, productName: 'Classic Smiley T-Shirt' }], total: 24.99, status: OrderStatus.Shipped, date: '2023-10-26' },
    { id: 'ord_1002', customerName: 'Bob Williams', items: [{ productId: 'prod_2', quantity: 1, productName: '"Brizzle" Signature Hoodie' }], total: 59.99, status: OrderStatus.InProgress, date: '2023-10-28' },
];

// --- MOCK API FUNCTIONS ---

// Utility to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchProducts = async (): Promise<Product[]> => {
  console.log('API: Fetching products...');
  await delay(500);
  return [...mockProducts];
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
    console.log(`API: Fetching product ${id}...`);
    await delay(300);
    return mockProducts.find(p => p.id === id);
}

export const fetchOrders = async (): Promise<Order[]> => {
  console.log('API: Fetching orders...');
  await delay(800);
  return [...mockOrders];
};

export const createProduct = async (name: string, description: string, price: number): Promise<Product> => {
  console.log('API: Creating product with Printful...', { name, description, price });
  await delay(1500); // Simulate Printful API latency
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    name,
    description,
    price,
    imageUrl: `https://picsum.photos/seed/${name.split(' ')[0]}/800/800`,
    mockupUrls: [`https://picsum.photos/seed/${name.split(' ')[0]}-front/800/800`, `https://picsum.photos/seed/${name.split(' ')[0]}-back/800/800`],
    variants: { // Default variants for new products
      sizes: [
        { id: 'size_s', name: 'Size', value: 'S', priceModifier: 0 },
        { id: 'size_m', name: 'Size', value: 'M', priceModifier: 0 },
        { id: 'size_l', name: 'Size', value: 'L', priceModifier: 0 },
      ],
      colors: [
        { id: 'color_white', name: 'Color', value: 'White', priceModifier: 0 },
        { id: 'color_black', name: 'Color', value: 'Black', priceModifier: 0 },
      ]
    },
    sku: `KB-${name.toUpperCase().replace(/\s/g, '-')}-${Math.floor(Math.random() * 1000)}`,
    isAdult: false, // Default new products to not be adult content
  };
  mockProducts.push(newProduct);
  console.log('API: Product created.', newProduct);
  return newProduct;
};

export const createEtsyListing = async (product: Product): Promise<EtsyListing> => {
    console.log(`API: Creating Etsy listing for ${product.name}...`);
    await delay(2000); // Simulate Etsy API latency
    const newListing: EtsyListing = {
        listing_id: Date.now(),
        title: product.name,
        state: 'draft',
        url: `https://www.etsy.com/listing/${Date.now()}/${product.name.replace(/\s/g, '-')}`
    };
    console.log('API: Etsy listing created.', newListing);
    return newListing;
}

export const postToHootsuite = async (text: string, imageUrl?: string): Promise<SocialPost> => {
    console.log('API: Posting to Hootsuite...');
    await delay(1000);
    if(text.toLowerCase().includes('fail')) {
        throw new Error("Simulated Hootsuite API failure.");
    }
    const newPost: SocialPost = {
        id: `hs_post_${Date.now()}`,
        text,
        url: `https://hootsuite.com/dashboard`
    };
    console.log('API: Hootsuite post created.', newPost);
    return newPost;
};

export const submitOrder = async (cart: CartItem[]): Promise<Order> => {
    console.log('API: Submitting order to Printful...', cart);
    await delay(1200);
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const newOrder: Order = {
        id: `ord_${Date.now()}`,
        customerName: "Guest Shopper",
        items: cart.map(item => ({ productId: item.product.id, productName: item.product.name, quantity: item.quantity })),
        total,
        status: OrderStatus.Pending,
        date: new Date().toISOString().split('T')[0]
    };
    mockOrders.unshift(newOrder);
    console.log('API: Order submitted.', newOrder);
    return newOrder;
};

export const submitCustomDesign = async (request: CustomDesignRequest): Promise<{success: boolean}> => {
    console.log('API: Submitting custom design request...', request);
    await delay(1000);
    // In a real app, this would handle file uploads and save to a DB.
    if (request.description.toLowerCase().includes('fail')) {
        throw new Error('Simulated API failure for custom design submission.');
    }
    console.log('API: Custom design request received.');
    return { success: true };
};