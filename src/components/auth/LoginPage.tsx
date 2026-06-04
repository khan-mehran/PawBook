import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, X, ArrowRight, Info } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  signInEmail,
  signInGoogle,
  signInFacebook,
  signInApple,
  getAuthErrorMessage,
} from '../../lib/firebaseAuth';
import { auth, isFirebaseConfigured } from '../../lib/firebase';
import { dummyPets } from '../../data/dummyData';

/* ── Brand icons ─────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/* ── Forgot-password sheet ───────────────────── */
const ForgotSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSend = async () => {
    if (!email.includes('@')) { setErr('Enter a valid email.'); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (e) {
      setErr(getAuthErrorMessage(e));
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[var(--pb-card)] border border-[var(--pb-border)] rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-lg text-[var(--pb-text)]">Reset Password</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--pb-hover)] text-[var(--pb-muted)] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        {!sent ? (
          <>
            <p className="text-sm text-[var(--pb-muted)] mb-4">
              Enter your email and Firebase will send you a real reset link.
            </p>
            <input
              type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(''); }}
              placeholder="your@email.com"
              className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl px-4 py-3 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/60 transition-colors mb-3"
            />
            {err && <p className="text-xs text-rose-400 mb-3">{err}</p>}
            <button
              onClick={handleSend} disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-violet-600 text-white rounded-xl py-3 font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : 'Send Reset Link'}
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">📬</div>
            <p className="font-semibold text-[var(--pb-text)]">Email sent!</p>
            <p className="text-sm text-[var(--pb-muted)] mt-1">
              Check <span className="text-orange-400">{email}</span>
            </p>
            <button onClick={onClose} className="mt-4 text-sm text-orange-400 hover:text-orange-300 cursor-pointer">Done</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ── Not-configured banner ───────────────────── */
const SetupBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
    className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-5"
  >
    <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-xs font-semibold text-amber-400 mb-0.5">Firebase not configured</p>
      <p className="text-xs text-amber-300/80 leading-relaxed">
        Copy <code className="bg-amber-500/20 px-1 rounded">.env.example</code> → <code className="bg-amber-500/20 px-1 rounded">.env.local</code> and
        add your Firebase project credentials to enable real authentication.
      </p>
    </div>
  </motion.div>
);

/* ── Main component ──────────────────────────── */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

  const clearError = () => setError('');

  /* ── Email sign-in ── */
  const handleEmailLogin = async () => {
    clearError();
    if (!email)    { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true);
    try {
      await signInEmail(email, password);
      /* onAuthStateChanged in App.tsx will update the store → redirect happens there */
      navigate('/');
    } catch (e) {
      setError(getAuthErrorMessage(e));
    }
    setLoading(false);
  };

  /* ── Social sign-in (opens real OAuth popup) ── */
  const handleSocial = async (provider: 'google' | 'facebook' | 'apple') => {
    clearError();
    setSocialLoading(provider);
    try {
      const fn = { google: signInGoogle, facebook: signInFacebook, apple: signInApple }[provider];
      await fn();
      navigate('/');
    } catch (e) {
      setError(getAuthErrorMessage(e));
    }
    setSocialLoading(null);
  };

  const socialProviders = [
    {
      id: 'google'   as const,
      label: 'Continue with Google',
      icon: <GoogleIcon />,
      cls:  'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    },
    {
      id: 'apple'    as const,
      label: 'Continue with Apple',
      icon: <AppleIcon />,
      cls:  'bg-black text-white border border-black hover:bg-neutral-900',
      note: 'Requires Apple Developer account',
    },
    {
      id: 'facebook' as const,
      label: 'Continue with Facebook',
      icon: <FacebookIcon />,
      cls:  'bg-[#1877F2] text-white border border-[#1877F2] hover:bg-[#1669d9]',
      note: 'Requires Facebook App setup',
    },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--pb-bg)] transition-colors duration-300">

      {/* ── Left branding panel (lg+) ─────────── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-orange-500 via-violet-700 to-teal-500 items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-400/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 bg-violet-500/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-teal-400/30 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md text-white text-center">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="text-8xl mb-6"
          >🐾</motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-black text-5xl mb-4 drop-shadow-lg"
          >FurBook</motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-xl text-white/90 mb-8 leading-relaxed"
          >Where every pet has a story.</motion.p>

          <div className="flex justify-center gap-3 flex-wrap mb-8">
            {dummyPets.slice(0, 5).map((pet, i) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="w-14 h-14 rounded-full border-2 border-white/60 overflow-hidden shadow-lg"
              >
                <img src={pet.profileImage} alt={pet.name} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex justify-center gap-8 text-white/80"
          >
            {[['50K+','Pets'],['2M+','Stories'],['6','Species']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="font-display font-black text-2xl text-white">{val}</p>
                <p className="text-sm">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Form panel ───────────────────────── */}
      <div className="flex-1 lg:max-w-[480px] flex flex-col items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl">🐾</span>
            <h1 className="font-display font-black text-3xl mt-2 bg-gradient-to-r from-orange-500 to-violet-600 bg-clip-text text-transparent">
              FurBook
            </h1>
          </div>

          <h2 className="font-display font-black text-2xl text-[var(--pb-text)] mb-1">Welcome back</h2>
          <p className="text-sm text-[var(--pb-muted)] mb-6">Sign in to see paws from your friends.</p>

          {/* Firebase not-configured warning */}
          {!isFirebaseConfigured && <SetupBanner />}

          {/* Social buttons */}
          <div className="flex flex-col gap-3 mb-5">
            {socialProviders.map(({ id, label, icon, cls, note }) => (
              <div key={id} className="relative group">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocial(id)}
                  disabled={!!socialLoading || !isFirebaseConfigured}
                  className={`flex items-center justify-center gap-3 w-full py-3 rounded-xl font-medium text-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${cls}`}
                >
                  {socialLoading === id
                    ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : icon}
                  {label}
                </motion.button>
                {/* Tooltip for providers requiring extra setup */}
                {note && (
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-[var(--pb-muted)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {note}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3 mt-7 mb-5">
            <div className="flex-1 h-px bg-[var(--pb-border)]" />
            <span className="text-xs font-semibold text-[var(--pb-muted)] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[var(--pb-border)]" />
          </div>

          {/* Email / Password */}
          <div className="flex flex-col gap-3 mb-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pb-muted)]" />
              <input
                type="email" placeholder="Email address"
                value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                disabled={!isFirebaseConfigured}
                className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/60 transition-colors disabled:opacity-60"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pb-muted)]" />
              <input
                type={showPw ? 'text' : 'password'} placeholder="Password"
                value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                disabled={!isFirebaseConfigured}
                className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl pl-10 pr-11 py-3 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/60 transition-colors disabled:opacity-60"
              />
              <button
                type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--pb-muted)] hover:text-[var(--pb-text)] transition-colors cursor-pointer"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mb-5">
            <button
              onClick={() => setShowForgot(true)}
              disabled={!isFirebaseConfigured}
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors cursor-pointer disabled:opacity-40"
            >
              Forgot password?
            </button>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-4 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-rose-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Log In button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleEmailLogin}
            disabled={loading || !isFirebaseConfigured}
            className="w-full bg-gradient-to-r from-orange-500 to-violet-600 text-white rounded-xl py-3.5 font-bold text-sm hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><span>Log In</span><ArrowRight className="w-4 h-4" /></>}
          </motion.button>

          {/* Register link */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--pb-border)]" />
            <span className="text-xs text-[var(--pb-muted)]">New to FurBook?</span>
            <div className="flex-1 h-px bg-[var(--pb-border)]" />
          </div>
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl py-3.5 text-sm font-semibold text-[var(--pb-text)] hover:border-orange-500/40 hover:text-orange-400 transition-all"
          >
            Create a new account
          </Link>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForgot && <ForgotSheet onClose={() => setShowForgot(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
