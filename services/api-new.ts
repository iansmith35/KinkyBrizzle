import { Product, Order, OrderStatus, CartItem, CustomDesignRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// --- API FUNCTIONS ---

export const fetchProducts = async (): Promise<Product[]> => {
  console.log('API: Fetching products...');
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  
  // Transform database format to frontend format
  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price),
    imageUrl: p.image_url,
    mockupUrls: p.mockup_urls || [],
    variants: p.variants || { sizes: [], colors: [] },
    sku: p.sku,
    isAdult: p.is_adult
  }));
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  console.log(`API: Fetching product ${id}...`);
  const response = await fetch(`${API_URL}/api/products/${id}`);
  if (!response.ok) return undefined;
  const p = await response.json();
  
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price),
    imageUrl: p.image_url,
    mockupUrls: p.mockup_urls || [],
    variants: p.variants || { sizes: [], colors: [] },
    sku: p.sku,
    isAdult: p.is_adult
  };
};

export const fetchOrders = async (): Promise<Order[]> => {
  console.log('API: Fetching orders...');
  const response = await fetch(`${API_URL}/api/orders`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  const data = await response.json();
  
  return data.map((o: any) => ({
    id: o.id,
    customerName: o.customer_name,
    items: o.items,
    total: parseFloat(o.total),
    status: o.status as OrderStatus,
    date: new Date(o.created_at).toISOString().split('T')[0]
  }));
};

export const createProduct = async (
  name: string, 
  description: string, 
  price: number,
  designPrompt?: string
): Promise<Product> => {
  console.log('API: Creating product...', { name, description, price, designPrompt });
  
  const response = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description,
      price,
      design_prompt: designPrompt
    })
  });
  
  if (!response.ok) throw new Error('Failed to create product');
  const p = await response.json();
  
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price),
    imageUrl: p.image_url,
    mockupUrls: p.mockup_urls || [],
    variants: p.variants || { sizes: [], colors: [] },
    sku: p.sku,
    isAdult: p.is_adult
  };
};

export const submitOrder = async (cart: CartItem[], customerInfo?: any): Promise<Order> => {
  console.log('API: Submitting order...', cart);
  
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: customerInfo?.name || 'Guest Shopper',
      customer_email: customerInfo?.email,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      })),
      total,
      shipping_address: customerInfo?.address
    })
  });
  
  if (!response.ok) throw new Error('Failed to submit order');
  const o = await response.json();
  
  return {
    id: o.id,
    customerName: o.customer_name,
    items: o.items,
    total: parseFloat(o.total),
    status: o.status as OrderStatus,
    date: new Date(o.created_at).toISOString().split('T')[0]
  };
};

export const submitCustomDesign = async (request: CustomDesignRequest): Promise<{success: boolean}> => {
  console.log('API: Submitting custom design request...', request);
  
  const response = await fetch(`${API_URL}/api/designs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: request.name,
      customer_email: request.email,
      description: request.description
    })
  });
  
  if (!response.ok) throw new Error('Failed to submit design request');
  
  return { success: true };
};

// Cart API functions
export const getCart = async (sessionId: string): Promise<CartItem[]> => {
  const response = await fetch(`${API_URL}/api/cart/${sessionId}`);
  if (!response.ok) return [];
  return response.json();
};

export const addToCartAPI = async (sessionId: string, productId: string, quantity: number, size: string, color: string) => {
  const response = await fetch(`${API_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      product_id: productId,
      quantity,
      size,
      color
    })
  });
  
  if (!response.ok) throw new Error('Failed to add to cart');
  return response.json();
};

export const updateCartItemAPI = async (itemId: string, quantity: number) => {
  const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
  
  if (!response.ok) throw new Error('Failed to update cart item');
  return response.json();
};

export const removeFromCartAPI = async (itemId: string) => {
  const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) throw new Error('Failed to remove from cart');
  return response.json();
};

export const clearCartAPI = async (sessionId: string) => {
  const response = await fetch(`${API_URL}/api/cart/session/${sessionId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) throw new Error('Failed to clear cart');
  return response.json();
};

// Legacy compatibility exports
export const createEtsyListing = async (product: Product) => {
  console.log('Etsy listing creation is now handled by AI agent');
  return {
    listing_id: Date.now(),
    title: product.name,
    state: 'draft' as const,
    url: `https://www.etsy.com/listing/${Date.now()}`
  };
};

export const postToHootsuite = async (text: string, imageUrl?: string) => {
  console.log('Social posting is now handled by AI agent via Rube.app');
  return {
    id: `post_${Date.now()}`,
    text,
    url: 'https://hootsuite.com/dashboard'
  };
};
