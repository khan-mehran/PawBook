import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReactionBarProps {
  reactions: { heart: number; paw: number; laugh: number; wow: number };
  onReact?: (type: string) => void;
}

const REACTIONS = [
  { key: 'heart', emoji: '❤️', label: 'Love' },
  { key: 'paw', emoji: '🐾', label: 'Paw' },
  { key: 'laugh', emoji: '😂', label: 'Haha' },
  { key: 'wow', emoji: '😮', label: 'Wow' },
  { key: 'sad', emoji: '😢', label: 'Sad' },
  { key: 'like', emoji: '👍', label: 'Like' },
];

const ReactionBar: React.FC<ReactionBarProps> = ({ reactions, onReact }) => {
  const [open, setOpen] = useState(false);

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  return (
    <div className="relative inline-flex items-center gap-2">
      <div
        className="flex items-center gap-1 cursor-pointer"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <span className="text-sm">❤️🐾😂</span>
        <span className="text-sm text-[var(--pb-muted)]">{totalReactions.toLocaleString()}</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="absolute bottom-8 left-0 flex gap-1 bg-[var(--pb-surface)] border border-[var(--pb-border)] rounded-full px-3 py-2 shadow-xl z-10"
          >
            {REACTIONS.map(({ key, emoji, label }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.4, y: -4 }}
                transition={{ duration: 0.1 }}
                onClick={() => { onReact?.(key); setOpen(false); }}
                title={label}
                className="text-xl cursor-pointer bg-transparent border-none p-0 leading-none"
                aria-label={label}
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionBar;
