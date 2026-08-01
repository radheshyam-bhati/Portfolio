import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Floating assistant button (bottom-right)
// ---------------------------------------------------------------------------

const AssistantButton = ({ isOpen, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      type: 'spring',
      stiffness: 400,
      damping: 20,
      delay: 1.5,
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      background: isOpen
        ? 'rgba(239,68,68,0.15)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      border: isOpen
        ? '1px solid rgba(239,68,68,0.3)'
        : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      zIndex: 9998,
      boxShadow: isOpen
        ? '0 0 20px rgba(239,68,68,0.2)'
        : '0 4px 24px rgba(239,68,68,0.4)',
      transition: 'all 0.3s ease',
    }}
  >
    {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
  </motion.button>
);

export default AssistantButton;
