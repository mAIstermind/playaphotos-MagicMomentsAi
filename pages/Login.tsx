import React, { useState } from 'react';
import { auth, GoogleAuthProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    console.log("Attempting Google login...");

    try {
      if (!auth) {
        throw new Error("Firebase Auth not initialized");
      }
      const provider = new GoogleAuthProvider();
      // Force account selection to avoid auto-login loops during testing
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      console.log("Login success:", result.user.uid);
      
      // In a real app, you would check Firestore here:
      // const docRef = doc(db, 'agencies', result.user.uid);
      // const docSnap = await getDoc(docRef);
      // if (docSnap.exists()) navigate(RoutePaths.ADMIN_DASHBOARD);
      // else navigate(RoutePaths.AGENCY_SETUP);

      // For this demo step, just go to Dashboard
      navigate(RoutePaths.ADMIN_DASHBOARD);
      
    } catch (err: any) {
      console.error("Login Error:", err);
      let msg = "Failed to sign in. Please try again.";
      
      if (err.code === 'auth/popup-closed-by-user') {
        msg = "Sign in cancelled.";
      } else if (err.code === 'auth/configuration-not-found') {
        msg = "Firebase Auth not configured. Check console.";
      } else if (err.message) {
        msg = err.message;
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Agency Portal</h2>
        <p className="text-slate-500 mb-8">Sign in to manage your events and revenue</p>
        
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          {loading ? 'Connecting...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;