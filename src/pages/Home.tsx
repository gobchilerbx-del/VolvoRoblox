import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { siteContent } from '@/config/siteContent';

function Home() {
  const { hero } = siteContent;
  const heroHeadline = hero.headline.split('\n');

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center">
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="grid w-full max-w-6xl gap-12 rounded-[32px] border border-[#D9DEE3] bg-[#F2F4F5] px-8 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-14 md:py-20"
      >
        <div className="space-y-8 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.32em] text-ash">{hero.eyebrow}</p>
          <h1 className="text-4xl font-semibold leading-snug text-ink md:text-5xl">
            {heroHeadline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-base text-ash md:text-lg">{hero.description}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-8 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-[#084C83]"
              >
                {hero.primaryCta}
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
        >
          <motion.div
            className="relative h-full w-full max-w-md overflow-hidden rounded-[24px] border border-[#D9DEE3] bg-panel shadow-[0_24px_60px_rgba(13,17,23,0.12)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            <img
              src={hero.imageUrl}
              alt={siteContent.branding.title}
              className="h-full w-full object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-white/50 via-transparent to-white/15"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.div
              className="absolute inset-x-6 -bottom-8 h-16 rounded-full bg-[#D0D6DC]/70 blur-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            />
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default Home;
