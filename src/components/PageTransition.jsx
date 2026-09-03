import { motion } from 'framer-motion';
import { EASE_OUT } from '../lib/motion';

/**
 * Route-level enter/exit. Kept deliberately short — a long page transition is
 * the cheapest way to make a fast site feel slow.
 */
const PageTransition = ({ children, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.28, ease: EASE_OUT }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
