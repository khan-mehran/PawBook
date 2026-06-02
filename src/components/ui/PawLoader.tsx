import React from 'react';
import { motion } from 'framer-motion';

const PawLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          className="text-2xl"
        >
          🐾
        </motion.div>
      ))}
    </div>
  );
};

export default PawLoader;
