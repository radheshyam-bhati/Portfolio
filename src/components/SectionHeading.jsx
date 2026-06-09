import { motion } from 'framer-motion';

const headingReveal = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
};

function SectionHeading({ number, title }) {
  return (
    <motion.h2 className="section-title" {...headingReveal}>
      <span className="section-title-num">{number}</span>
      {title}
      <div className="section-line" />
    </motion.h2>
  );
}

export default SectionHeading;
