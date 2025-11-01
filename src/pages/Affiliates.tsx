import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AffiliateCard } from '@/components/AffiliateCard';
import { AffiliateFormModal } from '@/components/AffiliateFormModal';
import { siteContent } from '@/config/siteContent';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';
import type { Affiliate } from '@/types';

function Affiliates() {
  const affiliates = useMarketplaceStore((state) => state.affiliates);
  const ownerLoggedIn = useMarketplaceStore((state) => state.ownerLoggedIn);
  const addAffiliate = useMarketplaceStore((state) => state.addAffiliate);
  const deleteAffiliate = useMarketplaceStore((state) => state.deleteAffiliate);
  const copy = siteContent.affiliates;

  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const orderedAffiliates = useMemo<Affiliate[]>(() => [...affiliates], [affiliates]);

  const handleSubmitAffiliate = async (payload: {
    name: string;
    description: string;
    discordUrl: string;
    robloxUrl: string;
    image: string;
  }) => {
    try {
      const created = await addAffiliate(payload);
      setModalOpen(false);
      setFeedback(`Afiliado “${created.name}” añadido correctamente.`);
      setTimeout(() => setFeedback(''), 2800);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'No se pudo registrar el afiliado.' };
    }
  };

  const handleDeleteAffiliate = async (affiliate: Affiliate) => {
    const confirmed = window.confirm(`¿Eliminar afiliado “${affiliate.name}”?`);
    if (!confirmed) return;
    try {
      await deleteAffiliate(affiliate.id);
      setFeedback(`Afiliado “${affiliate.name}” eliminado.`);
      setTimeout(() => setFeedback(''), 2800);
    } catch (error) {
      console.error(error);
      window.alert('No fue posible eliminar el afiliado.');
    }
  };

  return (
    <div className="space-y-12">
      <header className="space-y-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-xs uppercase tracking-[0.32em] text-ash"
        >
          {copy.eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
          className="text-3xl font-semibold text-ink md:text-4xl"
        >
          {copy.heading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          className="mx-auto max-w-2xl text-sm text-ash md:text-base"
        >
          {copy.description}
        </motion.p>
      </header>

      {ownerLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.12 }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-navy px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-navy transition hover:bg-navy/10"
          >
            {copy.ownerPanel.addButtonLabel}
          </button>
          {feedback && <p className="text-xs text-ash">{feedback}</p>}
        </motion.div>
      )}

      <motion.section
        layout
        className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3"
        transition={{ layout: { duration: 0.45, ease: 'easeInOut' } }}
      >
        {orderedAffiliates.map((affiliate) => (
          <AffiliateCard
            key={affiliate.id}
            affiliate={affiliate}
            canManage={ownerLoggedIn}
            onDelete={handleDeleteAffiliate}
          />
        ))}
      </motion.section>

      {!orderedAffiliates.length && (
        <div className="rounded-3xl border border-[#D9DEE3] bg-panel p-10 text-center text-ash">
          {copy.emptyState}
        </div>
      )}

      <AffiliateFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitAffiliate}
      />
    </div>
  );
}

export default Affiliates;
