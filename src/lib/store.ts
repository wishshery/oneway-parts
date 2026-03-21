import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  sku: string;
  stock: number;
}

interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity: Math.min(quantity, i.product.stock) } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: 'oneway-cart' }
  )
);

interface WishlistStore {
  items: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        const items = get().items;
        set({ items: items.includes(productId) ? items.filter((id) => id !== productId) : [...items, productId] });
      },
      has: (productId) => get().items.includes(productId),
      clear: () => set({ items: [] }),
    }),
    { name: 'oneway-wishlist' }
  )
);

interface RecentProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  sku: string;
  stock: number;
}

interface RecentlyViewedStore {
  products: RecentProduct[];
  addProduct: (product: RecentProduct) => void;
  clear: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const filtered = get().products.filter((p) => p.id !== product.id);
        set({ products: [product, ...filtered].slice(0, 12) });
      },
      clear: () => set({ products: [] }),
    }),
    { name: 'oneway-recent' }
  )
);
