import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  product: Product;
  quantity: number;
  purchaseType: 'subscription' | 'one_time';
}

interface CartStore {
  items: CartItem[];
  checkoutUrl: string | null;
  isLoading: boolean;
  
  addItem: (product: Product, quantity: number, purchaseType: 'subscription' | 'one_time') => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<string | null>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutUrl: null,
      isLoading: false,

      addItem: (product, quantity, purchaseType) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          i => i.product.id === product.id && i.purchaseType === purchaseType
        );
        
        if (existingIndex >= 0) {
          const newItems = [...items];
          newItems[existingIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({ items: [...items, { product, quantity, purchaseType }] });
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
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
          const checkoutItems = items.map(item => ({
            productId: item.product.id,
            title: item.product.title,
            quantity: item.quantity,
            purchaseType: item.purchaseType,
            priceId: item.purchaseType === 'subscription' 
              ? item.product.stripe_subscription_price_id!
              : item.product.stripe_one_time_price_id!,
            price: item.purchaseType === 'subscription'
              ? item.product.subscription_price
              : item.product.one_time_price,
          }));

          console.log('Creating checkout with items:', checkoutItems);

          const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: { items: checkoutItems },
          });

          console.log('Checkout response:', { data, error });

          if (error) {
            console.error('Supabase function error:', error);
            throw new Error(error.message || 'Failed to create checkout');
          }
          
          if (!data?.url) {
            console.error('No checkout URL in response:', data);
            throw new Error('No checkout URL returned');
          }

          setCheckoutUrl(data.url);
          return data.url;
        } catch (error) {
          console.error('Failed to create checkout:', error);
          throw error;
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: 'harvest-box-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
