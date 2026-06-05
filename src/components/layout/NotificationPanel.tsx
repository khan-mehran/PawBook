import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Check, X } from 'lucide-react';
import { useNotificationStore, type Notification } from '../../store/notificationStore';

/* ── Icon per type ───────────────────────────── */
const TYPE_ICON: Record<string, string> = {
  like:           '❤️',
  comment:        '💬',
  follow:         '➕',
  friend_request: '🤝',
  mention:        '📣',
  story:          '👀',
  achievement:    '🏆',
};

/* ── Single notification row ─────────────────── */
const NotifRow: React.FC<{ n: Notification; onRead: () => void; onClose: () => void }> = ({
  n, onRead, onClose,
}) => (
  <Link
    to={n.actionUrl}
    onClick={() => { onRead(); onClose(); }}
    className={`
      flex items-start gap-3 px-4 py-3 hover:bg-[var(--pb-hover)] transition-colors cursor-pointer group
      ${!n.read ? 'bg-orange-500/5' : ''}
    `}
  >
    {/* Avatar or icon */}
    <div className="relative flex-shrink-0 mt-0.5">
      {n.petImage ? (
        <img
          src={n.petImage}
          alt={n.petName}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${n.petName}&background=FF6B35&color=fff`; }}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-violet-600 flex items-center justify-center text-xl">
          🐾
        </div>
      )}
      <span className="absolute -bottom-1 -right-1 text-sm leading-none">
        {TYPE_ICON[n.type]}
      </span>
    </div>

    {/* Text */}
    <div className="flex-1 min-w-0">
      <p className={`text-sm leading-snug ${!n.read ? 'text-[var(--pb-text)] font-medium' : 'text-[var(--pb-muted)]'}`}>
        {n.message}
      </p>
      <p className={`text-xs mt-0.5 ${!n.read ? 'text-orange-400' : 'text-[var(--pb-muted)]'}`}>
        {n.timestamp}
      </p>
    </div>

    {/* Unread dot */}
    {!n.read && (
      <div className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0 mt-2" />
    )}
  </Link>
);

/* ── Main panel ──────────────────────────────── */
interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, markAllRead, markRead } = useNotificationStore();
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* Close when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  /* Group by today vs earlier */
  const today   = notifications.filter((n) => !n.timestamp.includes('Yesterday') && !n.timestamp.includes('d ago'));
  const earlier = notifications.filter((n) =>  n.timestamp.includes('Yesterday') || n.timestamp.includes('d ago'));

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-[var(--pb-card)] border border-[var(--pb-border)] rounded-2xl shadow-2xl overflow-hidden z-50"
      style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--pb-border-faint)]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[var(--pb-text)]" />
          <h3 className="font-display font-bold text-base text-[var(--pb-text)]">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-[var(--pb-hover)]"
            >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--pb-hover)] text-[var(--pb-muted)] hover:text-[var(--pb-text)] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="max-h-[440px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🔔</div>
            <p className="text-sm text-[var(--pb-muted)]">No notifications yet</p>
          </div>
        ) : (
          <>
            {today.length > 0 && (
              <>
                <p className="text-[10px] font-bold text-[var(--pb-muted)] uppercase tracking-widest px-4 pt-3 pb-1">
                  Today
                </p>
                {today.map((n) => (
                  <NotifRow key={n.id} n={n} onRead={() => markRead(n.id)} onClose={onClose} />
                ))}
              </>
            )}
            {earlier.length > 0 && (
              <>
                <p className="text-[10px] font-bold text-[var(--pb-muted)] uppercase tracking-widest px-4 pt-3 pb-1">
                  Earlier
                </p>
                {earlier.map((n) => (
                  <NotifRow key={n.id} n={n} onRead={() => markRead(n.id)} onClose={onClose} />
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--pb-border-faint)] px-4 py-2.5 text-center">
        <button
          onClick={onClose}
          className="text-xs text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
        >
          See all activity →
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationPanel;
