export interface Variant {
  id: string;
  name: string; // e.g., 'Color', 'Size'
  value: string; // e.g., 'Red', 'M'
  priceModifier: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  mockupUrls: string[];
  variants: {
    sizes: Variant[];
    colors: Variant[];
  };
  sku?: string;
  isAdult: boolean;
}

export enum OrderStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export interface Order {
  id: string;
  customerName: string;
  items: { productId: string; quantity: number; productName:string }[];
  total: number;
  status: OrderStatus;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface EtsyListing {
  listing_id: number;
  title: string;
  state: 'draft' | 'active';
  url: string;
}

export interface SocialPost {
    id: string;
    text: string;
    url: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface CustomDesignRequest {
    name: string;
    email: string;
    description: string;
    file?: File;
}