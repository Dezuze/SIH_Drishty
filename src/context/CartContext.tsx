import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Product, CartItem, OrderCustomerDetails, ConfirmedOrder } from '../data/products';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  appliedPromo: string | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  grandTotal: number;
  lastOrder: ConfirmedOrder | null;
  placeOrder: (customer: OrderCustomerDetails) => ConfirmedOrder;
  toasts: ToastState[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'kisan_cart_v1';
const ORDER_STORAGE_KEY = 'kisan_last_order_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastOrder, setLastOrder] = useState<ConfirmedOrder | null>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (lastOrder) {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(lastOrder));
      }
    } catch (e) {
      console.error('Failed to save last order to localStorage', e);
    }
  }, [lastOrder]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1): { success: boolean; message: string } => {
    let result = { success: true, message: '' };

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const currentQty = existing ? existing.quantity : 0;
      const targetQty = currentQty + quantity;

      if (targetQty > product.available) {
        const allowed = product.available - currentQty;
        if (allowed <= 0) {
          result = {
            success: false,
            message: `Cannot add more. You have all ${product.available} ${product.unit} available in your cart.`
          };
          return prev;
        } else {
          result = {
            success: true,
            message: `Added maximum available (${allowed} ${product.unit}) to cart.`
          };
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: product.available }
              : item
          );
        }
      }

      result = {
        success: true,
        message: `Added ${quantity} ${product.unit} of fresh ${product.name} to cart!`
      };

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: targetQty }
            : item
        );
      }

      return [...prev, { product, quantity }];
    });

    if (result.success) {
      addToast(result.message, 'success');
    } else {
      addToast(result.message, 'warning');
    }

    return result;
  };

  const updateQuantity = (productId: number, requestedQty: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            if (requestedQty <= 0) {
              return null;
            }
            const clamped = Math.min(requestedQty, item.product.available);
            if (clamped < requestedQty) {
              addToast(`Quantity capped at maximum available stock (${item.product.available} ${item.product.unit})`, 'info');
            }
            return { ...item, quantity: clamped };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        addToast(`Removed ${item.product.name} from cart`, 'info');
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'KISAN10' || clean === 'FARM2026' || clean === 'ORGANIC') {
      setAppliedPromo(clean);
      addToast(`Promo code '${clean}' applied! You get 10% off.`, 'success');
      return { success: true, message: 'Promo code applied successfully!' };
    }
    addToast('Invalid promo code. Try KISAN10 for 10% off.', 'warning');
    return { success: false, message: 'Invalid promo code' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    addToast('Promo code removed', 'info');
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Delivery is free over ₹300, else flat ₹35
  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return subtotal >= 300 ? 0 : 35;
  }, [cart.length, subtotal]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round(subtotal * 0.1);
  }, [appliedPromo, subtotal]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee - discount);
  }, [subtotal, deliveryFee, discount]);

  const placeOrder = (customer: OrderCustomerDetails): ConfirmedOrder => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `KSN-${new Date().getFullYear()}-${randomNum}`;
    
    // Extract unique farmers
    const farmerSet = new Set(cart.map((item) => item.product.farmer));
    const allFarmers = Array.from(farmerSet);
    const primaryFarmer = allFarmers[0] || 'Local Kerala Farm Collective';

    const order: ConfirmedOrder = {
      orderId,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [...cart],
      customer,
      subtotal,
      deliveryFee,
      discount,
      grandTotal,
      estimatedDelivery: customer.deliverySlot || 'Tomorrow, 7:00 AM - 11:00 AM',
      primaryFarmer,
      allFarmers
    };

    setLastOrder(order);
    clearCart();
    addToast('🎉 Order placed successfully!', 'success');
    return order;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        discount,
        appliedPromo,
        applyPromo,
        removePromo,
        grandTotal,
        lastOrder,
        placeOrder,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
