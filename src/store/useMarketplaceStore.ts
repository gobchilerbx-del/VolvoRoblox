import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Affiliate, Credentials, Product } from '@/types';

const OWNER_USERNAME = 'FormalDev';
const OWNER_PASSWORD = 'YOUR_PASSWORD_HERE';

type ProductPayload = Omit<Product, 'id' | 'createdAt'>;
type AffiliatePayload = Omit<Affiliate, 'id' | 'createdAt'>;

interface MarketplaceState {
  initialized: boolean;
  loading: boolean;
  error?: string;
  products: Product[];
  affiliates: Affiliate[];
  ownerLoggedIn: boolean;
  loadInitialData: () => Promise<void>;
  loginOwner: (credentials: Credentials) => { success: boolean; message?: string };
  logoutOwner: () => void;
  addProduct: (payload: ProductPayload) => Promise<Product>;
  updateProduct: (id: string, payload: Partial<ProductPayload>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  addAffiliate: (payload: AffiliatePayload) => Promise<Affiliate>;
  updateAffiliate: (id: string, payload: Partial<AffiliatePayload>) => Promise<Affiliate>;
  deleteAffiliate: (id: string) => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const sortByNewest = <T extends { createdAt: string }>(items: T[]) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      initialized: false,
      loading: false,
      error: undefined,
      products: [],
      affiliates: [],
      ownerLoggedIn: false,
      loadInitialData: async () => {
        if (get().initialized) return;
        set({ loading: true, error: undefined });
        try {
          const [products, affiliates] = await Promise.all([
            request<Product[]>('/products'),
            request<Affiliate[]>('/affiliates')
          ]);
          set({
            products: sortByNewest(products),
            affiliates: sortByNewest(affiliates),
            initialized: true,
            loading: false
          });
        } catch (error) {
          console.error(error);
          set({
            error: error instanceof Error ? error.message : 'Error al cargar los datos.',
            loading: false,
            initialized: false
          });
        }
      },
      loginOwner: ({ username, password }) => {
        if (username.trim() !== OWNER_USERNAME) {
          return { success: false, message: 'Usuario no reconocido.' };
        }
        if (password !== OWNER_PASSWORD) {
          return { success: false, message: 'Contraseña incorrecta.' };
        }
        set({ ownerLoggedIn: true });
        return { success: true };
      },
      logoutOwner: () => set({ ownerLoggedIn: false }),
      addProduct: async (payload) => {
        const newProduct = await request<Product>('/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        set((state) => ({
          products: sortByNewest([...state.products, newProduct])
        }));
        return newProduct;
      },
      updateProduct: async (id, payload) => {
        const updated = await request<Product>(`/products/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        set((state) => ({
          products: sortByNewest(
            state.products.map((product) => (product.id === id ? updated : product))
          )
        }));
        return updated;
      },
      deleteProduct: async (id) => {
        await request<void>(`/products/${id}`, { method: 'DELETE' });
        set((state) => ({
          products: state.products.filter((product) => product.id !== id)
        }));
      },
      addAffiliate: async (payload) => {
        const newAffiliate = await request<Affiliate>('/affiliates', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        set((state) => ({
          affiliates: sortByNewest([...state.affiliates, newAffiliate])
        }));
        return newAffiliate;
      },
      updateAffiliate: async (id, payload) => {
        const updated = await request<Affiliate>(`/affiliates/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        set((state) => ({
          affiliates: sortByNewest(
            state.affiliates.map((affiliate) => (affiliate.id === id ? updated : affiliate))
          )
        }));
        return updated;
      },
      deleteAffiliate: async (id) => {
        await request<void>(`/affiliates/${id}`, { method: 'DELETE' });
        set((state) => ({
          affiliates: state.affiliates.filter((affiliate) => affiliate.id !== id)
        }));
      }
    }),
    {
      name: 'volvo-catalog-owner',
      partialize: (state) => ({
        ownerLoggedIn: state.ownerLoggedIn
      })
    }
  )
);
