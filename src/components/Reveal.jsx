import { motion } from 'framer-motion';
import { rise, stagger, viewportOnce } from '../lib/motion';

/**
 * Scroll-triggered reveal. Uses Framer's IntersectionObserver under the hood
 * and only ever animates transform + opacity.
 *
 * <Reveal>            single element rises in
 * <Reveal stagger>    children with `variants={rise}` rise in sequence
 */
const Reveal = ({
  children,
  as: Tag = motion.div,
  delay = 0,
  stagger: shouldStagger = false,
  amount,
  className,
  ...rest
}) => (
  <Tag
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={amount ? { ...viewportOnce, amount } : viewportOnce}
    variants={
      shouldStagger
        ? stagger(0.07, delay)
        : { ...rise, visible: { ...rise.visible, transition: { ...rise.visible.transition, delay } } }
    }
    {...rest}
  >
    {children}
  </Tag>
);

/** Child of a `<Reveal stagger>` parent. */
export const RevealItem = ({ children, as: Tag = motion.div, ...rest }) => (
  <Tag variants={rise} {...rest}>
    {children}
  </Tag>
);

export default Reveal;
