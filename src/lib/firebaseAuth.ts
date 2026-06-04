import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signOut,
  updateProfile,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';

/* ── Provider instances ──────────────────────── */
const googleProvider   = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider    = new OAuthProvider('apple.com');

// Optional scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');
appleProvider.addScope('name');
appleProvider.addScope('email');

/* ── Auth functions ──────────────────────────── */
const requireAuth = (): Auth => {
  if (!auth) throw new Error('Firebase is not configured. Add your credentials to .env.local.');
  return auth;
};

export const signInEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(requireAuth(), email, password);

export const signUpEmail = async (email: string, password: string, displayName: string) => {
  const cred = await createUserWithEmailAndPassword(requireAuth(), email, password);
  await updateProfile(cred.user, { displayName });
  return cred;
};

export const signInGoogle   = () => signInWithPopup(requireAuth(), googleProvider);
export const signInFacebook = () => signInWithPopup(requireAuth(), facebookProvider);
export const signInApple    = () => signInWithPopup(requireAuth(), appleProvider);

export const signOutUser = () => (auth ? signOut(auth) : Promise.resolve());

/* ── Friendly error messages ─────────────────── */
const ERROR_MAP: Record<string, string> = {
  'auth/user-not-found':                          'No account found with this email. Create one below.',
  'auth/wrong-password':                          'Incorrect password. Please try again.',
  'auth/invalid-credential':                      'Invalid email or password. Please try again.',
  'auth/invalid-email':                           'Please enter a valid email address.',
  'auth/email-already-in-use':                   'This email is already registered. Try logging in instead.',
  'auth/weak-password':                           'Password must be at least 6 characters.',
  'auth/popup-closed-by-user':                    'Sign-in was cancelled. Please try again.',
  'auth/popup-blocked':                           'Popup was blocked by your browser. Please allow popups for this site.',
  'auth/account-exists-with-different-credential':'An account already exists with this email using a different sign-in method.',
  'auth/network-request-failed':                  'Network error. Please check your internet connection.',
  'auth/too-many-requests':                       'Too many failed attempts. Please wait a moment and try again.',
  'auth/operation-not-allowed':                   'This sign-in method is not enabled. Please contact support.',
  'auth/cancelled-popup-request':                 'Another sign-in popup is already open.',
  'auth/internal-error':                          'An internal error occurred. Please try again.',
};

export const getAuthErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code ?? '';
  return ERROR_MAP[code] ?? 'Something went wrong. Please try again.';
};

export type { FirebaseUser };
