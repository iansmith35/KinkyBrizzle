
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Product, Order, CartItem, OrderStatus } from '../types';
import * as api from '../services/api';
import { useToast } from '../hooks/useToast';

interface AppContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  isLoading: boolean;
  isAgeVerified: boolean;
  verifyAge: () => void;
  createProduct: (name: string, description: string, price: number) => Promise<Product | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  submitOrder: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => sessionStorage.getItem('isAgeVerified') === 'true');
  const { addToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsData, ordersData] = await Promise.all([
          api.fetchProducts(),
          api.fetchOrders(),
        ]);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        addToast('Failed to load initial data.', 'error');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const verifyAge = () => {
    sessionStorage.setItem('isAgeVerified', 'true');
    setIsAgeVerified(true);
    addToast('Age verified successfully! You can now view all content.', 'success');
  };

  const createProduct = useCallback(async (name: string, description: string, price: number): Promise<Product | null> => {
    setIsLoading(true);
    try {
      const newProduct = await api.createProduct(name, description, price);
      setProducts(prev => [...prev, newProduct]);
      addToast(`Product "${name}" created successfully!`, 'success');
      
      // Simulate creating an Etsy listing
      try {
          const etsyListing = await api.createEtsyListing(newProduct);
          addToast(`Etsy draft listing created: ${etsyListing.title}`, 'success');
      } catch (error) {
          addToast('Failed to create Etsy listing.', 'error');
      }

      return newProduct;
    } catch (error) {
      addToast('Failed to create product.', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    addToast(`Order ${orderId} status updated to ${status}.`, 'info');
  };

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id && item.size === size && item.color === color);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity, size, color }];
    });
    addToast(`${product.name} added to cart.`, 'success');
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prevCart => prevCart.filter(item => !(item.product.id === productId && item.size === size && item.color === color)));
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };
  
  const clearCart = () => {
      setCart([]);
  }

  const submitOrder = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
        const newOrder = await api.submitOrder(cart);
        setOrders(prev => [newOrder, ...prev]);
        setCart([]);
        addToast('Order submitted successfully!', 'success');
        return true;
    } catch (error) {
        addToast('Failed to submit order.', 'error');
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{ products, orders, cart, isLoading, isAgeVerified, verifyAge, createProduct, updateOrderStatus, addToCart, removeFromCart, updateCartQuantity, clearCart, submitOrder }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};