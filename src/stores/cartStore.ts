import { create } from 'zustand';
import { ShopifyProduct, createStorefrontCheckout } from '@/lib/shopify';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface CartStore {
  items: CartItem[];
  checkoutUrl: string | null;
  isLoading: boolean;
  
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<string | null>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  checkoutUrl: null,
  isLoading: false,

  addItem: (item) => {
    const { items } = get();
    const existingItem = items.find(i => i.variantId === item.variantId);
    
    if (existingItem) {
      set({
        items: items.map(i =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      });
    } else {
      set({ items: [...items, item] });
    }
  },

  updateQuantity: (variantId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(variantId);
      return;
    }
    
    set({
      items: get().items.map(item =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    });
  },

  removeItem: (variantId) => {
    set({
      items: get().items.filter(item => item.variantId !== variantId)
    });
  },

  clearCart: () => {
    set({ items: [], checkoutUrl: null });
  },

  setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
  setLoading: (isLoading) => set({ isLoading }),

  createCheckout: async () => {
    const { items, setLoading, setCheckoutUrl } = get();
    if (items.length === 0) return null;

    setLoading(true);
    try {
      const checkoutUrl = await createStorefrontCheckout(
        items.map(item => ({ variantId: item.variantId, quantity: item.quantity }))
      );
      setCheckoutUrl(checkoutUrl);
      return checkoutUrl;
    } catch (error) {
      console.error('Failed to create checkout:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }
}));
