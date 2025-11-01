import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoMark } from './LogoMark';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';
import { siteContent } from '@/config/siteContent';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Afiliados', href: '/afiliados' },
  { label: 'Panel', href: '/panel' }
];

const linkStyles = ({ isActive }: { isActive: boolean }) =>
  `px-3 text-xs font-semibold uppercase tracking-[0.32em] transition-colors ${
    isActive ? 'text-navy' : 'text-ink/60 hover:text-navy'
  }`;

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ownerLoggedIn = useMarketplaceStore((state) => state.ownerLoggedIn);
  const logoutOwner = useMarketplaceStore((state) => state.logoutOwner);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutOwner();
    navigate('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <motion.div
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`mt-4 flex w-[95%] items-center justify-between rounded-full border border-[#E1E5EA] bg-panel px-5 py-3 shadow-header transition ${
          scrolled ? 'shadow-[0_8px_32px_rgba(13,17,23,0.08)] translate-y-0' : ''
        }`}
      >
        <div className="relative flex w-full items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <LogoMark size={40} />
          </Link>

          <div className="pointer-events-none absolute inset-x-0 hidden md:flex justify-center">
            <motion.div
              className="flex flex-col items-center gap-1 text-center pointer-events-auto"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <p className="font-montserrat text-sm font-semibold uppercase tracking-[0.48em] text-ink">
                {siteContent.branding.title}
              </p>
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-ash">
                {siteContent.branding.tagline}
              </p>
              <nav>
                <ul className="inline-flex items-center gap-3 text-xs">
                  {navItems.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-3">
                      <NavLink to={item.href} className={linkStyles}>
                        {item.label}
                      </NavLink>
                      {index < navItems.length - 1 && <span className="text-ink/30">|</span>}
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!ownerLoggedIn ? (
              <Link
                to="/panel"
                className="inline-flex items-center rounded-full bg-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-[#084C83]"
              >
                Acceder
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/panel"
                  className="inline-flex items-center rounded-full border border-navy/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-navy transition hover:bg-navy/10"
                >
                  Panel
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-ink/70 transition hover:border-ink/40 hover:text-ink"
                >
                  Salir
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 text-ink md:hidden"
          >
            <span className="sr-only">Abrir menú</span>
            <motion.span
              className="relative block h-0.5 w-6 bg-ink"
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden pt-4 md:hidden"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="font-montserrat text-sm font-semibold uppercase tracking-[0.48em] text-ink">
                  {siteContent.branding.title}
                </p>
                <p className="text-[0.65rem] uppercase tracking-[0.4em] text-ash">
                  {siteContent.branding.tagline}
                </p>
              </div>
              <ul className="mt-4 flex flex-col items-center gap-3">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <NavLink to={item.href} className={linkStyles}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-3 pb-4">
                {!ownerLoggedIn ? (
                  <Link
                    to="/panel"
                    className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white"
                  >
                    Acceder
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/panel"
                      className="inline-flex items-center justify-center rounded-full border border-navy/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-navy"
                    >
                      Panel
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-ink/70"
                    >
                      Salir
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

export default Header;
