import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hold the preloader for 2.5 seconds to establish the luxury feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-bg-surface flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle Grid Lines */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-text-main/5 -translate-x-1/2 z-0 hidden md:block"></div>
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-text-main/5 -translate-y-1/2 z-0 hidden md:block"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="relative z-10 flex flex-col items-center justify-center text-center">
            <span className="text-text-muted text-[10px] uppercase tracking-[4px] mb-8 font-body">
              / Casa de Alta Cocina
            </span>
            <span className="font-heading text-4xl md:text-6xl text-text-main uppercase tracking-[0.15em] leading-none mb-2">
              Distrito
            </span>
            <span className="font-heading text-2xl md:text-4xl text-primary italic tracking-widest leading-none font-light mb-12">
              Gourmet
            </span>

            {/* Loading Line */}
            <div className="w-32 h-[1px] bg-text-main/10 relative overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-primary/50 w-full"></motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
