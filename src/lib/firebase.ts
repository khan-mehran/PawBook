import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

/** True only when all required env vars are present */
export const isFirebaseConfigured =
  !!import.meta.env.VITE_FIREBASE_API_KEY &&
  !!import.meta.env.VITE_FIREBASE_PROJECT_ID;

/* ─────────────────────────────────────────────────────────
   CRITICAL: only call initializeApp when config is present.
   Firebase throws "invalid-firebase-options" at module-eval
   time if apiKey is undefined, crashing the entire app.
   ───────────────────────────────────────────────────────── */
let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;

if (isFirebaseConfigured) {
  try {
    _app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    _auth = getAuth(_app);
  } catch (e) {
    console.error('[FurBook] Firebase init failed:', e);
  }
}

/** Defined only when isFirebaseConfigured is true — always check before use */
export const auth = _auth as Auth;
