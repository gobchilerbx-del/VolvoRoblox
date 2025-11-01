import { motion } from 'framer-motion';
import { siteContent } from '@/config/siteContent';
import type { Affiliate } from '@/types';

interface AffiliateCardProps {
  affiliate: Affiliate;
  canManage?: boolean;
  onDelete?: (affiliate: Affiliate) => void | Promise<void>;
}

const motionConfig = {
  rest: { y: 0, scale: 1, boxShadow: '0px 0px 0px rgba(13,17,23,0)' },
  hover: { y: -6, scale: 1.02, boxShadow: '0px 16px 36px rgba(13,17,23,0.08)' }
};

export function AffiliateCard({ affiliate, canManage, onDelete }: AffiliateCardProps) {
  const affiliateCopy = siteContent.affiliates;

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={motionConfig}
      transition={{ type: 'spring', stiffness: 170, damping: 18, bounce: 0.2 }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#DCE1E6] bg-panel p-6 text-center transition-colors"
    >
      <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-[#E1E5EA] bg-[#F4F6F8]">
        <img src={affiliate.image} alt={affiliate.name} className="h-full w-full object-cover" />
      </div>
      <h3 className="mt-5 text-lg font-semibold uppercase tracking-[0.16em] text-navy">
        {affiliate.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">{affiliate.description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={affiliate.robloxUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-navy transition hover:bg-navy/10"
        >
          <img
            src={affiliateCopy.icons.roblox}
            alt="Roblox"
            className="h-4 w-4 object-contain"
          />
          <span>{affiliateCopy.card.robloxLabel}</span>
        </a>
        <a
          href={affiliate.discordUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#5865F2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#5865F2] transition hover:bg-[#5865F2]/10"
        >
          <img
            src={affiliateCopy.icons.discord}
            alt="Discord"
            className="h-4 w-4 object-contain"
          />
          <span>{affiliateCopy.card.discordLabel}</span>
        </a>
      </div>
      {canManage && (
        <button
          type="button"
          onClick={() => onDelete?.(affiliate)}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-500 transition hover:bg-red-500/10"
        >
          Eliminar
        </button>
      )}
    </motion.article>
  );
}
