import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, User, ChevronRight, ChevronLeft,
  Check, AlertCircle, Info,
} from 'lucide-react';
import {
  signUpEmail,
  signInGoogle,
  signInFacebook,
  signInApple,
  getAuthErrorMessage,
} from '../../lib/firebaseAuth';
import { isFirebaseConfigured } from '../../lib/firebase';
import { useAuthStore, speciesDefaultImages } from '../../store/authStore';
import { usePetStore } from '../../store/petStore';
import type { Pet } from '../../data/dummyData';

/* ── Shared icons ────────────────────────────── */
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

/* ── Constants ───────────────────────────────── */
const SPECIES = ['Dog','Cat','Bird','Rabbit','Hamster','Reptile','Other'] as const;
const SPECIES_EMOJI: Record<string, string> = {
  Dog:'🐶', Cat:'🐱', Bird:'🦜', Rabbit:'🐰', Hamster:'🐹', Reptile:'🦎', Other:'🐾',
};

type Step = 'method' | 'info' | 'password' | 'pet' | 'done';

/* ── Password strength meter ─────────────────── */
const PasswordStrength: React.FC<{ pw: string }> = ({ pw }) => {
  const s = !pw ? 0
    : pw.length < 6 ? 1
    : pw.length < 10 || !/[A-Z]/.test(pw) ? 2
    : /[A-Z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 10 ? 4 : 3;
  const colors  = ['','bg-rose-500','bg-orange-400','bg-yellow-400','bg-green-500'];
  const labels  = ['','Too short','Weak','Good','Strong'];
  const tColors = ['','text-rose-400','text-orange-400','text-yellow-400','text-green-400'];
  if (!pw) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map((i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= s ? colors[s] : 'bg-[var(--pb-border)]'}`} />
        ))}
      </div>
      <p className={`text-[10px] font-medium ${tColors[s]}`}>{labels[s]}</p>
    </div>
  );
};

/* ── Not-configured banner ───────────────────── */
const SetupBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
    className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-5"
  >
    <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
    <p className="text-xs text-amber-300/80 leading-relaxed">
      Firebase is not configured.
      Copy <code className="bg-amber-500/20 px-1 rounded">.env.example</code> →{' '}
      <code className="bg-amber-500/20 px-1 rounded">.env.local</code> to enable real auth.
    </p>
  </motion.div>
);

/* ── Main component ──────────────────────────── */
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentPet } = useAuthStore();
  const { addPet } = usePetStore();

  const [step, setStep]      = useState<Step>('method');
  const [loading, setLoading] = useState(false);
  const [error, setError]    = useState('');
  const [showPw, setShowPw]  = useState(false);
  const [showCo, setShowCo]  = useState(false);

  /* Pending Firebase user when social auth completes but pet not set up yet */
  const [pendingFbUser, setPendingFbUser] = useState<import('../../lib/firebaseAuth').FirebaseUser | null>(null);

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    petName: '', petSpecies: 'Dog' as string,
  });
  const upd = (k: keyof typeof form, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError('');
  };

  /* ── Helpers ── */
  const savePetAndGo = (petName: string, petSpecies: string, fbUser: import('../../lib/firebaseAuth').FirebaseUser) => {
    const newPet: Pet = {
      id:           `pet_${fbUser.uid}`,
      name:         petName || fbUser.displayName?.split(' ')[0] || 'My Pet',
      species:      petSpecies,
      breed:        'Mixed',
      age:          'Puppy',
      owner:        fbUser.displayName ?? fbUser.email ?? '',
      location:     'Earth 🌍',
      bio:          `Hi, I'm ${petName}! Just joined FurBook 🐾`,
      profileImage: (speciesDefaultImages as Record<string, string>)[petSpecies] ?? speciesDefaultImages.Dog,
      coverImage:   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
      friends:      0,
      followers:    0,
      tags:         ['New here! 🌟'],
      verified:     false,
      gallery:      [],
    };
    setCurrentPet(newPet);
    addPet(newPet);
    setStep('done');
    setTimeout(() => navigate('/'), 2200);
  };

  /* ── Social sign-up (opens real popup) ── */
  const handleSocial = async (provider: 'google' | 'facebook' | 'apple') => {
    setError('');
    setLoading(true);
    try {
      const fn = { google: signInGoogle, facebook: signInFacebook, apple: signInApple }[provider];
      const cred = await fn();
      /* Social auth succeeded — go straight to pet setup */
      setPendingFbUser(cred.user);
      setStep('pet');
    } catch (e) {
      setError(getAuthErrorMessage(e));
    }
    setLoading(false);
  };

  /* ── Email flow ── */
  const validateInfo = () => {
    if (!form.name.trim())        { setError('Please enter your name.'); return false; }
    if (!form.email.includes('@')){ setError('Please enter a valid email address.'); return false; }
    return true;
  };
  const validatePassword = () => {
    if (form.password.length < 6)         { setError('Password must be at least 6 characters.'); return false; }
    if (form.password !== form.confirm)   { setError('Passwords do not match.'); return false; }
    return true;
  };

  const handleNext = async () => {
    setError('');
    if (step === 'info') {
      if (validateInfo()) setStep('password');
    } else if (step === 'password') {
      if (validatePassword()) setStep('pet');
    } else if (step === 'pet') {
      if (!form.petName.trim()) { setError('Give your pet a name!'); return; }
      setLoading(true);
      try {
        if (pendingFbUser) {
          /* Social path: Firebase user already exists */
          savePetAndGo(form.petName, form.petSpecies, pendingFbUser);
        } else {
          /* Email path: create Firebase account now */
          const cred = await signUpEmail(form.email, form.password, form.name);
          savePetAndGo(form.petName, form.petSpecies, cred.user);
        }
      } catch (e) {
        setError(getAuthErrorMessage(e));
        setLoading(false);
      }
    }
  };

  /* ── Step: choose method ── */
  if (step === 'method') return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--pb-bg)] px-6 py-10 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🐾</div>
          <h1 className="font-display font-black text-3xl bg-gradient-to-r from-orange-500 to-violet-600 bg-clip-text text-transparent">
            Join FurBook
          </h1>
          <p className="text-sm text-[var(--pb-muted)] mt-2">
            Sign up to discover amazing pets worldwide.
          </p>
        </div>

        {!isFirebaseConfigured && <SetupBanner />}

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

        <div className="flex flex-col gap-3 mb-6">
          {([
            { id: 'google',   label: 'Continue with Google',   icon: <GoogleIcon />,   cls: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50' },
            { id: 'apple',    label: 'Continue with Apple',    icon: <AppleIcon />,    cls: 'bg-black text-white hover:bg-neutral-900' },
            { id: 'facebook', label: 'Continue with Facebook', icon: <FacebookIcon />, cls: 'bg-[#1877F2] text-white hover:bg-[#1669d9]' },
          ] as const).map(({ id, label, icon, cls }) => (
            <motion.button
              key={id} whileTap={{ scale: 0.98 }}
              onClick={() => handleSocial(id)}
              disabled={loading || !isFirebaseConfigured}
              className={`flex items-center justify-center gap-3 w-full py-3.5 rounded-xl font-medium text-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${cls}`}
            >
              {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
              {label}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[var(--pb-border)]" />
          <span className="text-xs font-semibold text-[var(--pb-muted)] uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-[var(--pb-border)]" />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => { setError(''); setStep('info'); }}
          disabled={!isFirebaseConfigured}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-violet-600 text-white rounded-xl py-3.5 font-bold text-sm hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] transition-all cursor-pointer disabled:opacity-60"
        >
          <Mail className="w-4 h-4" /> Sign up with Email
        </motion.button>

        <p className="text-center text-sm text-[var(--pb-muted)] mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );

  /* ── Step: done ── */
  if (step === 'done') return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--pb-bg)] transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center px-8"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8 }}
          className="text-8xl mb-6"
        >🎉</motion.div>
        <h2 className="font-display font-black text-3xl text-[var(--pb-text)] mb-2">
          Welcome to FurBook!
        </h2>
        <p className="text-[var(--pb-muted)]">
          {form.petName || 'Your pet'} is ready to meet the community 🐾
        </p>
        <div className="flex justify-center gap-2 mt-6">
          {['🐶','🐱','🦜','🐰','🐹'].map((e, i) => (
            <motion.span key={i}
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
              className="text-2xl"
            >{e}</motion.span>
          ))}
        </div>
        <p className="text-sm text-[var(--pb-muted)] mt-4 animate-pulse">Redirecting to your feed…</p>
      </motion.div>
    </div>
  );

  /* ── Multi-step form ── */
  const stepMeta: Record<Exclude<Step,'method'|'done'>, { title: string; subtitle: string }> = {
    info:     { title: 'Your Info',       subtitle: 'Tell us a bit about yourself.' },
    password: { title: 'Create Password', subtitle: 'Make it strong and memorable!' },
    pet:      { title: 'Your Pet',        subtitle: "Now the best part — your pet's details!" },
  };
  const steps = ['info','password','pet'] as const;
  const idx   = steps.indexOf(step as typeof steps[number]);
  const meta  = stepMeta[step as Exclude<Step,'method'|'done'>];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--pb-bg)] px-6 py-10 transition-colors duration-300">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-sm"
      >
        {/* Header row */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              setError('');
              const prev: Record<string, Step> = { info:'method', password:'info', pet: pendingFbUser ? 'method' : 'password' };
              setStep(prev[step] as Step);
            }}
            className="p-2 rounded-full hover:bg-[var(--pb-hover)] text-[var(--pb-muted)] hover:text-[var(--pb-text)] transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-2xl">🐾</span>
          <span className="font-display font-black text-lg bg-gradient-to-r from-orange-500 to-violet-600 bg-clip-text text-transparent">
            FurBook
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= idx ? 'bg-gradient-to-r from-orange-500 to-violet-600' : 'bg-[var(--pb-border)]'
              }`}
            />
          ))}
        </div>

        <h2 className="font-display font-black text-2xl text-[var(--pb-text)] mb-1">{meta.title}</h2>
        <p className="text-sm text-[var(--pb-muted)] mb-6">{meta.subtitle}</p>

        {/* ── info ── */}
        {step === 'info' && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pb-muted)]" />
              <input type="text" placeholder="Full name" value={form.name}
                onChange={(e) => upd('name', e.target.value)}
                className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pb-muted)]" />
              <input type="email" placeholder="Email address" value={form.email}
                onChange={(e) => upd('email', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>
          </div>
        )}

        {/* ── password ── */}
        {step === 'password' && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pb-muted)]" />
                <input type={showPw ? 'text' : 'password'} placeholder="Create password" value={form.password}
                  onChange={(e) => upd('password', e.target.value)}
                  className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl pl-10 pr-11 py-3 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/60 transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--pb-muted)] cursor-pointer" aria-label="Toggle">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength pw={form.password} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pb-muted)]" />
              <input type={showCo ? 'text' : 'password'} placeholder="Confirm password" value={form.confirm}
                onChange={(e) => upd('confirm', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl pl-10 pr-11 py-3 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/60 transition-colors"
              />
              <button type="button" onClick={() => setShowCo(!showCo)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--pb-muted)] cursor-pointer" aria-label="Toggle">
                {showCo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* ── pet ── */}
        {step === 'pet' && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-semibold text-[var(--pb-muted)] uppercase tracking-wider mb-2 block">
                Pet's Name
              </label>
              <input type="text" placeholder="e.g. Mango, Luna, Biscuit…" value={form.petName}
                onChange={(e) => upd('petName', e.target.value)}
                className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl px-4 py-3 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--pb-muted)] uppercase tracking-wider mb-2 block">
                Species
              </label>
              <div className="grid grid-cols-4 gap-2">
                {SPECIES.map((s) => (
                  <button key={s} onClick={() => upd('petSpecies', s)}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      form.petSpecies === s
                        ? 'bg-gradient-to-br from-orange-500 to-violet-600 text-white shadow-lg scale-105'
                        : 'bg-[var(--pb-hover)] border border-[var(--pb-border)] text-[var(--pb-muted)] hover:border-orange-500/30 hover:text-[var(--pb-text)]'
                    }`}
                  >
                    <span className="text-xl">{SPECIES_EMOJI[s]}</span>
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>

            {form.petName && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-orange-500/10 to-violet-600/10 border border-orange-500/20 rounded-2xl p-4 text-center"
              >
                <div className="text-4xl mb-1">{SPECIES_EMOJI[form.petSpecies]}</div>
                <p className="font-display font-black text-lg text-[var(--pb-text)]">{form.petName}</p>
                <p className="text-xs text-[var(--pb-muted)]">{form.petSpecies}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mt-4 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.98 }} onClick={handleNext} disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-violet-600 text-white rounded-xl py-3.5 font-bold text-sm hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading
            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : step === 'pet'
              ? <><Check className="w-4 h-4" /> Create My Account!</>
              : <>Continue <ChevronRight className="w-4 h-4" /></>}
        </motion.button>

        {step === 'info' && (
          <p className="text-center text-sm text-[var(--pb-muted)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
              Log In
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterPage;
