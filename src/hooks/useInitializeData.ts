import { useEffect } from 'react';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';

export const useInitializeData = () => {
  const loadInitialData = useMarketplaceStore((state) => state.loadInitialData);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);
};
