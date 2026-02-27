import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 40,
    filter: 'blur(15px)',
    clipPath: 'inset(15% 15% 15% 15%)',
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    clipPath: 'inset(0% 0% 0% 0%)',
  },
  out: {
    opacity: 0,
    scale: 1.02,
    y: -20,
    filter: 'blur(10px)',
    clipPath: 'inset(10% 0% 10% 0%)',
  },
};

const pageTransition = {
  duration: 2.0,
  ease: [0.22, 1, 0.36, 1], // Custom slow cinematic ease
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full">
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
