import { AnimatePresence } from 'framer-motion';
import Preloader from './Preloader';

export default function AppPreloader({ isLoading, onComplete }) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && <Preloader key="preloader" onComplete={onComplete} />}
    </AnimatePresence>
  );
}
