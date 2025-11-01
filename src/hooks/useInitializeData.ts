import { useEffect } from 'react';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';

export const useInitializeData = () => {
  const loadProducts = useMarketplaceStore((state) => state.loadProducts);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
};
