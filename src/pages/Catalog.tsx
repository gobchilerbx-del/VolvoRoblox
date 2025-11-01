import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { siteContent } from '@/config/siteContent';
import type { Product } from '@/types';

function Catalog() {
  const products = useMarketplaceStore((state) => state.products);
  const [selected, setSelected] = useState<Product | null>(null);
  const [currencyCode, setCurrencyCode] = useState<string>(
    siteContent.catalog.currencies[0]?.code ?? 'MXN'
  );
  const currencies = siteContent.catalog.currencies;

  const selectedCurrency = useMemo(() => {
    return currencies.find((currency) => currency.code === currencyCode) ?? currencies[0];
  }, [currencyCode, currencies]);

  const formatCurrencyValue = (value: number) =>
    new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: value < 1 ? 2 : 0,
      maximumFractionDigits: 2
    }).format(value);

  return (
    <div className="space-y-12">
      <header className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-xs uppercase tracking-[0.32em] text-ash"
        >
          {siteContent.catalog.eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          className="mt-4 text-3xl font-semibold text-ink md:text-4xl"
        >
          {siteContent.catalog.heading}
        </motion.h2>
        <p className="mt-3 text-sm text-ash md:text-base">{siteContent.catalog.description}</p>
      </header>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-4 text-sm text-ash"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
      >
        <label className="text-xs uppercase tracking-[0.32em] text-ash" htmlFor="currency-select">
          Moneda
        </label>
        <motion.div
          className="relative inline-flex items-center overflow-hidden rounded-full border border-[#CCD4DD] bg-panel shadow-[0_12px_30px_rgba(13,17,23,0.08)]"
          animate={{ boxShadow: '0 18px 42px rgba(0,48,87,0.15)' }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            key={selectedCurrency.code}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,48,87,0.18),transparent_60%)]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [0, 0.55, 0.35], scale: [0.85, 1, 1.05] }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
          <select
            id="currency-select"
            value={currencyCode}
            onChange={(event) => setCurrencyCode(event.target.value)}
            className="relative z-10 appearance-none rounded-full bg-transparent px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.32em] text-ink outline-none transition focus:text-navy"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code} className="text-ink">
                {currency.label}
              </option>
            ))}
          </select>
          <motion.span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/60"
            initial={{ rotate: 0 }}
            animate={{ rotate: currencyCode === selectedCurrency.code ? 0 : 180 }}
          >
            ▾
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.section
        layout
        className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        transition={{ layout: { duration: 0.45, ease: 'easeInOut' } }}
      >
        {products.map((product) => {
          const basePriceMXN = product.price;
          const convertedValue = basePriceMXN * (selectedCurrency?.perMXN ?? 1);
          return (
            <ProductCard
              key={product.id}
              product={product}
              pricing={{
                formattedPrice: `${selectedCurrency?.symbol ?? '$'}${formatCurrencyValue(convertedValue)} ${selectedCurrency?.code ?? 'MXN'}`
              }}
              onDetails={setSelected}
            />
          );
        })}
      </motion.section>

      <ProductModal
        product={selected}
        pricing={
          selected
            ? {
                formattedPrice: `${selectedCurrency?.symbol ?? '$'}${formatCurrencyValue(
                  selected.price * (selectedCurrency?.perMXN ?? 1)
                )} ${selectedCurrency?.code ?? 'MXN'}`
              }
            : undefined
        }
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

export default Catalog;
