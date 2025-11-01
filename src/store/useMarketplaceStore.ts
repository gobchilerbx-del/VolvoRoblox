import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import affiliatesSeed from '@/data/affiliates.json';
import productsSeed from '@/data/products.json';
import type { Affiliate, Credentials, Product } from '@/types';

const OWNER_USERNAME = 'FormalDev';
const OWNER_PASSWORD = 'YOUR_PASSWORD_HERE';

type ProductPayload = Omit<Product, 'id' | 'createdAt'>;
type AffiliatePayload = Omit<Affiliate, 'id' | 'createdAt'>;

interface MarketplaceState {
  initialized: boolean;
  products: Product[];
  affiliates: Affiliate[];
  ownerLoggedIn: boolean;
  loadProducts: () => void;
  loginOwner: (credentials: Credentials) => { success: boolean; message?: string };
  logoutOwner: () => void;
  addProduct: (payload: ProductPayload) => Product;
  updateProduct: (id: string, payload: Partial<ProductPayload>) => void;
  deleteProduct: (id: string) => void;
  addAffiliate: (payload: AffiliatePayload) => Affiliate;
  updateAffiliate: (id: string, payload: Partial<AffiliatePayload>) => void;
  deleteAffiliate: (id: string) => void;
}

const sortByNewest = (items: Product[]) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const sortAffiliatesByNewest = (items: Affiliate[]) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const seedProducts = () =>
  sortByNewest(
    productsSeed.map((product) => ({
      ...product,
      createdAt: product.createdAt ?? new Date().toISOString()
    }))
  );

const seedAffiliates = () =>
  sortAffiliatesByNewest(
    affiliatesSeed.map((affiliate) => ({
      ...affiliate,
      createdAt: affiliate.createdAt ?? new Date().toISOString()
    }))
  );

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      initialized: false,
      products: seedProducts(),
      affiliates: seedAffiliates(),
      ownerLoggedIn: false,
      loadProducts: () => {
        if (get().initialized) return;
        set((state) => ({
          products: state.products.length ? sortByNewest(state.products) : seedProducts(),
          affiliates: state.affiliates.length ? sortAffiliatesByNewest(state.affiliates) : seedAffiliates(),
          initialized: true
        }));
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
      addProduct: (payload) => {
        const id = `prd-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 9)}`;
        const newProduct: Product = {
          id,
          createdAt: new Date().toISOString(),
          ...payload
        };
        set((state) => ({ products: sortByNewest([newProduct, ...state.products]) }));
        return newProduct;
      },
      updateProduct: (id, payload) => {
        set((state) => ({
          products: sortByNewest(
            state.products.map((product) =>
              product.id === id
                ? {
                    ...product,
                    ...payload,
                    id: product.id,
                    createdAt: product.createdAt
                  }
                : product
            )
          )
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((product) => product.id !== id) }));
      },
      addAffiliate: (payload) => {
        const id = `aff-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 9)}`;
        const newAffiliate: Affiliate = {
          id,
          createdAt: new Date().toISOString(),
          ...payload
        };
        set((state) => ({
          affiliates: sortAffiliatesByNewest([newAffiliate, ...state.affiliates])
        }));
        return newAffiliate;
      },
      updateAffiliate: (id, payload) => {
        set((state) => ({
          affiliates: sortAffiliatesByNewest(
            state.affiliates.map((affiliate) =>
              affiliate.id === id
                ? {
                    ...affiliate,
                    ...payload,
                    id: affiliate.id,
                    createdAt: affiliate.createdAt
                  }
                : affiliate
            )
          )
        }));
      },
      deleteAffiliate: (id) => {
        set((state) => ({
          affiliates: state.affiliates.filter((affiliate) => affiliate.id !== id)
        }));
      }
    }),
    {
      name: 'volvo-catalog-owner',
      partialize: (state) => ({
        products: state.products,
        affiliates: state.affiliates,
        ownerLoggedIn: state.ownerLoggedIn
      })
    }
  )
);
