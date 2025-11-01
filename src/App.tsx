import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import AppRoutes from './routes/AppRoutes';
import { useInitializeData } from './hooks/useInitializeData';

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 }
};

function App() {
  const location = useLocation();
  useInitializeData();

  return (
    <div className="relative min-h-screen bg-base text-ink">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="mx-auto w-full max-w-7xl px-6 pb-20 pt-32 sm:px-10 lg:px-16"
        >
          <AppRoutes />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
