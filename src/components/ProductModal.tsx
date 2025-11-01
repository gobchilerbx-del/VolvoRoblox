import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '@/types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  pricing?: {
    formattedPrice: string;
  };
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

export function ProductModal({ product, onClose, pricing }: ProductModalProps) {

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D9DEE3] bg-panel shadow-[0_28px_60px_rgba(13,17,23,0.12)]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 h-10 w-10 rounded-full border border-ink/10 text-2xl text-ink/60 transition hover:text-ink"
            >
              ×
            </button>
            <div className="grid gap-6 p-8 sm:grid-cols-[1.1fr_0.9fr]">
              <motion.div
                className="overflow-hidden rounded-2xl border border-[#D9DEE3] bg-[#F5F6F7]"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
              >
                <img src={product.image} alt={product.name} className="h-72 w-full object-cover" />
              </motion.div>
              <div className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.28em] text-ash">Detalle del producto</p>
                <h3 className="text-2xl font-semibold text-ink uppercase tracking-[0.08em]">
                  {product.name}
                </h3>
                <p className="text-sm text-ash">{product.description}</p>
                <div className="mt-auto">
                  <span className="text-lg font-semibold text-navy">
                    {pricing?.formattedPrice ??
                      `$${product.price.toLocaleString('es-MX', { minimumFractionDigits: 0 })} MXN`}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
