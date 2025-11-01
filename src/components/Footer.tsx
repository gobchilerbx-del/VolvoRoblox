import { motion } from 'framer-motion';
import { siteContent } from '@/config/siteContent';

function Footer() {
  const links = (siteContent.footer.links as unknown) as Array<{
    label: string;
    href: string;
    iconUrl?: string;
  }>;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="border-t border-[#D9DEE3] bg-footer py-10"
    >
      <div className="mx-auto flex w-[90%] flex-col items-center gap-6 text-center text-xs text-ash">
        <p className="font-montserrat text-sm text-ink">{siteContent.footer.copy}</p>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-ash transition hover:text-ink"
            >
              {link.iconUrl ? (
                <img
                  src={link.iconUrl}
                  alt={link.label}
                  className="h-5 w-5 object-contain"
                />
              ) : (
                <span className="text-ink/80">{link.label.charAt(0)}</span>
              )}
              <span className="text-sm font-medium uppercase tracking-[0.22em]">{link.label}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
