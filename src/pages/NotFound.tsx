import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { siteContent } from '@/config/siteContent';

function NotFound() {
  const { notFound } = siteContent;
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="space-y-4"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-ash">{notFound.eyebrow}</p>
        <h2 className="text-4xl font-semibold text-ink">{notFound.heading}</h2>
        <p className="text-sm text-ash">{notFound.description}</p>
      </motion.div>
      <Link
        to="/"
        className="rounded-full bg-navy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#084C83]"
      >
        {notFound.cta}
      </Link>
    </div>
  );
}

export default NotFound;
