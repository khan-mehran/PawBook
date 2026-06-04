import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, Link2, Info, Bell, BellOff, Mail,
  Shield, Smartphone, Eye, Globe, Sun, Moon,
  HelpCircle, Flag, FileText, Heart, Star,
  Trash2, LogOut, ChevronRight, X, AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

/* ── Toggle switch ───────────────────────────── */
const Toggle: React.FC<{ value: boolean; onChange: () => void }> = ({ value, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer flex-shrink-0 ${
      value ? 'bg-gradient-to-r from-orange-500 to-violet-600' : 'bg-[var(--pb-border)]'
    }`}
    aria-checked={value}
    role="switch"
  >
    <motion.span
      animate={{ x: value ? 20 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow"
    />
  </button>
);

/* ── Row types ───────────────────────────────── */
interface SettingRowProps {
  icon: React.ReactNode;
  iconBg?: string;
  label: string;
  description?: string;
  value?: string;
  toggle?: boolean;
  checked?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  destructive?: boolean;
  chevron?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon, iconBg = 'bg-[var(--pb-hover)]', label, description, value,
  toggle, checked, onToggle, onClick, destructive, chevron = true,
}) => (
  <button
    onClick={toggle ? onToggle : onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--pb-hover)] transition-colors cursor-pointer text-left
      ${destructive ? 'hover:bg-rose-500/5' : ''}
    `}
  >
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <span className={destructive ? 'text-rose-400' : 'text-[var(--pb-muted)]'}>{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium ${destructive ? 'text-rose-400' : 'text-[var(--pb-text)]'}`}>{label}</p>
      {description && <p className="text-xs text-[var(--pb-muted)] mt-0.5">{description}</p>}
    </div>
    {value && <span className="text-sm text-[var(--pb-muted)] flex-shrink-0">{value}</span>}
    {toggle ? (
      <Toggle value={!!checked} onChange={onToggle!} />
    ) : chevron ? (
      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${destructive ? 'text-rose-400' : 'text-[var(--pb-muted)]'}`} />
    ) : null}
  </button>
);

/* ── Section card ────────────────────────────── */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-5">
    <p className="text-xs font-bold text-[var(--pb-muted)] uppercase tracking-widest px-1 mb-2">{title}</p>
    <div className="bg-[var(--pb-card)] border border-[var(--pb-border-faint)] rounded-2xl overflow-hidden divide-y divide-[var(--pb-border-faint)]">
      {children}
    </div>
  </div>
);

/* ── Confirm dialog ──────────────────────────── */
const ConfirmDialog: React.FC<{
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, message, confirmLabel, destructive, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-sm bg-[var(--pb-card)] border border-[var(--pb-border)] rounded-3xl p-6 text-center"
    >
      <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${destructive ? 'bg-rose-500/10' : 'bg-orange-500/10'}`}>
        {destructive
          ? <AlertTriangle className="w-7 h-7 text-rose-400" />
          : <LogOut className="w-7 h-7 text-orange-400" />
        }
      </div>
      <h3 className="font-display font-bold text-lg text-[var(--pb-text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--pb-muted)] mb-6 leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-[var(--pb-hover)] border border-[var(--pb-border)] text-sm font-semibold text-[var(--pb-text)] hover:bg-[var(--pb-border)] transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer ${
            destructive ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gradient-to-r from-orange-500 to-violet-600 hover:opacity-90'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ── Change-Password sheet ───────────────────── */
const ChangePasswordSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext]       = useState('');
  const [saved, setSaved]     = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[var(--pb-card)] border border-[var(--pb-border)] rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-lg text-[var(--pb-text)]">Change Password</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--pb-hover)] text-[var(--pb-muted)] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        {!saved ? (
          <>
            {['Current password', 'New password'].map((label, i) => (
              <div key={label} className="mb-3">
                <label className="text-xs text-[var(--pb-muted)] mb-1 block">{label}</label>
                <input
                  type="password"
                  value={i === 0 ? current : next}
                  onChange={(e) => i === 0 ? setCurrent(e.target.value) : setNext(e.target.value)}
                  className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl px-4 py-3 text-sm text-[var(--pb-text)] focus:outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>
            ))}
            <button
              onClick={() => current && next.length >= 6 && setSaved(true)}
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-violet-600 text-white rounded-xl py-3 font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity"
            >
              Update Password
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="font-semibold text-[var(--pb-text)]">Password updated!</p>
            <button onClick={onClose} className="mt-3 text-sm text-orange-400 cursor-pointer">Close</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ── Main SettingsPage ───────────────────────── */
const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, currentPet, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [prefs, setPrefs] = useState({
    pushNotifs:   true,
    emailNotifs:  false,
    storyNotifs:  true,
    likeNotifs:   true,
    commentNotifs:true,
    privateAcct:  false,
    showLocation: true,
    allowTags:    true,
    twoFA:        false,
  });
  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const [showLogout,  setShowLogout]  = useState(false);
  const [showDelete,  setShowDelete]  = useState(false);
  const [showPwSheet, setShowPwSheet] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="pb-12">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display font-black text-3xl text-[var(--pb-text)]">Settings</h1>
        <p className="text-sm text-[var(--pb-muted)] mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile summary card */}
      <Link to={`/profile/${currentPet.id}`}>
        <motion.div
          whileHover={{ x: 2 }}
          className="flex items-center gap-4 bg-[var(--pb-card)] border border-[var(--pb-border-faint)] rounded-2xl p-4 mb-6 hover:border-orange-500/30 transition-colors"
        >
          <img
            src={currentPet.profileImage}
            alt={currentPet.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-orange-500/40"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[var(--pb-text)] truncate">{currentPet.name}</p>
            <p className="text-sm text-[var(--pb-muted)] truncate">{user?.email || 'your@email.com'}</p>
            <p className="text-xs text-orange-400 mt-0.5">View profile →</p>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--pb-muted)] flex-shrink-0" />
        </motion.div>
      </Link>

      {/* ── Account ─────────────────────────────── */}
      <Section title="Account">
        <SettingRow
          icon={<User className="w-4 h-4" />}
          iconBg="bg-blue-500/15"
          label="Edit Profile"
          description="Update your pet's name, bio and photos"
          onClick={() => navigate('/create')}
        />
        <SettingRow
          icon={<Lock className="w-4 h-4" />}
          iconBg="bg-orange-500/15"
          label="Change Password"
          description="Keep your account secure"
          onClick={() => setShowPwSheet(true)}
        />
        <SettingRow
          icon={<Info className="w-4 h-4" />}
          iconBg="bg-teal-500/15"
          label="Personal Information"
          value={user?.name || '—'}
          onClick={() => {}}
        />
        <SettingRow
          icon={<Link2 className="w-4 h-4" />}
          iconBg="bg-violet-500/15"
          label="Linked Accounts"
          description="Google, Apple, Facebook"
          onClick={() => {}}
        />
      </Section>

      {/* ── Appearance ──────────────────────────── */}
      <Section title="Appearance">
        <SettingRow
          icon={theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          iconBg={theme === 'dark' ? 'bg-violet-500/15' : 'bg-yellow-500/15'}
          label="Dark Mode"
          description={theme === 'dark' ? 'Currently dark' : 'Currently light'}
          toggle
          checked={theme === 'dark'}
          onToggle={toggleTheme}
          chevron={false}
        />
        <SettingRow
          icon={<Globe className="w-4 h-4" />}
          iconBg="bg-teal-500/15"
          label="Language"
          value="English"
          onClick={() => {}}
        />
      </Section>

      {/* ── Notifications ───────────────────────── */}
      <Section title="Notifications">
        <SettingRow icon={<Bell className="w-4 h-4" />}    iconBg="bg-orange-500/15" label="Push Notifications"  toggle checked={prefs.pushNotifs}    onToggle={() => toggle('pushNotifs')}    chevron={false} />
        <SettingRow icon={<Mail className="w-4 h-4" />}    iconBg="bg-blue-500/15"   label="Email Alerts"        toggle checked={prefs.emailNotifs}   onToggle={() => toggle('emailNotifs')}   chevron={false} />
        <SettingRow icon={<Star className="w-4 h-4" />}    iconBg="bg-yellow-500/15" label="Story Notifications" toggle checked={prefs.storyNotifs}    onToggle={() => toggle('storyNotifs')}   chevron={false} />
        <SettingRow icon={<Heart className="w-4 h-4" />}   iconBg="bg-rose-500/15"   label="Likes & Reactions"   toggle checked={prefs.likeNotifs}     onToggle={() => toggle('likeNotifs')}    chevron={false} />
        <SettingRow icon={<BellOff className="w-4 h-4" />} iconBg="bg-[var(--pb-hover)]" label="Comment Alerts"  toggle checked={prefs.commentNotifs} onToggle={() => toggle('commentNotifs')} chevron={false} />
      </Section>

      {/* ── Privacy ─────────────────────────────── */}
      <Section title="Privacy">
        <SettingRow icon={<Eye className="w-4 h-4" />}      iconBg="bg-teal-500/15"   label="Private Account"  description="Only approved followers see your posts"  toggle checked={prefs.privateAcct}   onToggle={() => toggle('privateAcct')}   chevron={false} />
        <SettingRow icon={<Globe className="w-4 h-4" />}    iconBg="bg-blue-500/15"   label="Show Location"    toggle checked={prefs.showLocation}                   onToggle={() => toggle('showLocation')} chevron={false} />
        <SettingRow icon={<User className="w-4 h-4" />}     iconBg="bg-violet-500/15" label="Allow Tags"       description="Let others tag your pet in posts" toggle checked={prefs.allowTags} onToggle={() => toggle('allowTags')} chevron={false} />
        <SettingRow icon={<FileText className="w-4 h-4" />} iconBg="bg-[var(--pb-hover)]" label="Blocked Pets" onClick={() => {}} />
      </Section>

      {/* ── Security ────────────────────────────── */}
      <Section title="Security">
        <SettingRow icon={<Shield className="w-4 h-4" />}     iconBg="bg-green-500/15"  label="Two-Factor Authentication" toggle checked={prefs.twoFA} onToggle={() => toggle('twoFA')} chevron={false} />
        <SettingRow icon={<Smartphone className="w-4 h-4" />} iconBg="bg-orange-500/15" label="Login Activity"          description="See recent sign-ins" onClick={() => {}} />
      </Section>

      {/* ── Help & Support ──────────────────────── */}
      <Section title="Help & Support">
        <SettingRow icon={<HelpCircle className="w-4 h-4" />} iconBg="bg-blue-500/15"         label="Help Center"        onClick={() => {}} />
        <SettingRow icon={<Flag className="w-4 h-4" />}       iconBg="bg-yellow-500/15"       label="Report a Problem"   onClick={() => {}} />
        <SettingRow icon={<FileText className="w-4 h-4" />}   iconBg="bg-[var(--pb-hover)]"   label="Privacy Policy"     onClick={() => {}} />
        <SettingRow icon={<FileText className="w-4 h-4" />}   iconBg="bg-[var(--pb-hover)]"   label="Terms of Service"   onClick={() => {}} />
      </Section>

      {/* ── About ───────────────────────────────── */}
      <Section title="About">
        <SettingRow icon={<Star className="w-4 h-4" />}       iconBg="bg-orange-500/15"       label="Rate FurBook"        onClick={() => {}} />
        <SettingRow icon={<Info className="w-4 h-4" />}       iconBg="bg-[var(--pb-hover)]"   label="Version"            value="1.0.0" chevron={false} onClick={() => {}} />
      </Section>

      {/* ── Danger zone ─────────────────────────── */}
      <Section title="Account Actions">
        <SettingRow
          icon={<LogOut className="w-4 h-4" />}
          iconBg="bg-rose-500/15"
          label="Log Out"
          description={`Signed in as ${user?.email || 'guest'}`}
          destructive
          onClick={() => setShowLogout(true)}
          chevron={false}
        />
        <SettingRow
          icon={<Trash2 className="w-4 h-4" />}
          iconBg="bg-rose-500/10"
          label="Delete Account"
          description="This action is irreversible"
          destructive
          onClick={() => setShowDelete(true)}
          chevron={false}
        />
      </Section>

      {/* Dialogs */}
      <AnimatePresence>
        {showLogout && (
          <ConfirmDialog
            title="Log Out?"
            message={`You'll be signed out of ${currentPet.name}'s account on this device.`}
            confirmLabel="Log Out"
            onConfirm={handleLogout}
            onCancel={() => setShowLogout(false)}
          />
        )}
        {showDelete && (
          <ConfirmDialog
            title="Delete Account?"
            message="All your data, posts, and followers will be permanently removed. This cannot be undone."
            confirmLabel="Delete Forever"
            destructive
            onConfirm={() => { logout(); navigate('/login'); }}
            onCancel={() => setShowDelete(false)}
          />
        )}
        {showPwSheet && <ChangePasswordSheet onClose={() => setShowPwSheet(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
