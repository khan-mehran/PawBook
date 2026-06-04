import { StrictMode, Component, type ReactNode, type ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

/* ── Global error boundary ───────────────────────────────────────────────
   Catches any runtime error that bubbles to the root and renders a
   recovery screen instead of a blank page.
   ──────────────────────────────────────────────────────────────────────── */
class RootErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[FurBook] Uncaught error:', error, info);
  }

  render() {
    if (this.state.error) {
      const msg = (this.state.error as Error).message ?? String(this.state.error);
      const isFirebaseError =
        msg.includes('Firebase') ||
        msg.includes('firebase') ||
        msg.includes('invalid-firebase-options');

      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#0D0D1A',
            color: '#F0F0FF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: "'DM Sans', sans-serif",
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐾</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#FF6B35' }}>
            {isFirebaseError ? 'Firebase not configured' : 'Something went wrong'}
          </h2>

          {isFirebaseError ? (
            <>
              <p style={{ color: '#9999BB', marginBottom: '1.5rem', maxWidth: 440, lineHeight: 1.6 }}>
                Copy <code style={{ background: '#1E1E38', padding: '2px 6px', borderRadius: 4 }}>.env.example</code>{' '}
                to <code style={{ background: '#1E1E38', padding: '2px 6px', borderRadius: 4 }}>.env.local</code>,
                fill in your Firebase credentials, then restart the dev server.
              </p>
              <pre style={{
                background: '#16162A', color: '#00D4AA', padding: '1rem', borderRadius: 12,
                fontSize: '0.75rem', textAlign: 'left', maxWidth: 480, width: '100%',
              }}>
{`# 1. Create the file
cp .env.example .env.local

# 2. Add your Firebase values from
#    console.firebase.google.com

# 3. Restart
npm run dev`}
              </pre>
            </>
          ) : (
            <>
              <p style={{ color: '#9999BB', marginBottom: '1.5rem', maxWidth: 380, lineHeight: 1.6 }}>
                {msg}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'linear-gradient(135deg, #FF6B35, #7C3AED)',
                  color: '#fff', border: 'none', borderRadius: 24,
                  padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                }}
              >
                Reload page
              </button>
            </>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
