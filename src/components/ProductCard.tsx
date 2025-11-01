import { motion } from 'framer-motion';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  variant?: 'catalog' | 'panel';
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onDetails?: (product: Product) => void;
  pricing?: {
    formattedPrice: string;
  };
}

const motionConfig = {
  rest: { y: 0, scale: 1, rotate: 0, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
  hover: {
    y: -6,
    scale: 1.02,
    rotate: -0.5,
    boxShadow: '0px 12px 32px rgba(13, 17, 23, 0.08)'
  }
};

const imageVariants = {
  rest: { scale: 1.02 },
  hover: { scale: 1.08 }
};

export function ProductCard({
  product,
  variant = 'catalog',
  onEdit,
  onDelete,
  onDetails,
  pricing
}: ProductCardProps) {
  const fallbackPrice = `$${product.price.toLocaleString('es-MX', { minimumFractionDigits: 0 })} MXN`;
  const priceDisplay = pricing?.formattedPrice ?? fallbackPrice;

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={motionConfig}
      transition={{ type: 'spring', stiffness: 180, damping: 18, bounce: 0.25 }}
      className="group overflow-hidden rounded-xl border border-[#DCE1E6] bg-panel"
    >
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          variants={imageVariants}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        />
      </div>
      <div className="space-y-4 p-6">
        <header className="space-y-2">
          <h3 className="text-xl font-semibold text-navy uppercase tracking-[0.05em]">{product.name}</h3>
          <p className="text-sm text-ash leading-relaxed">{product.description}</p>
        </header>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-ink">{priceDisplay}</span>
          {variant === 'catalog' ? (
            <button
              type="button"
              onClick={() => onDetails?.(product)}
              className="rounded-full border border-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-navy transition hover:bg-navy/10"
            >
              Ver detalles
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit?.(product)}
                className="rounded-full border border-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-navy transition hover:bg-navy/10"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(product)}
                className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-500 transition hover:bg-red-500/10"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
