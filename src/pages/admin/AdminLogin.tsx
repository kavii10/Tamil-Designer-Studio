import React, { useState } from 'react';
import { Lock, Sparkles, ArrowRight, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { authService } from '../../services/auth';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login(email || password, password);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('admin@tamildesignerstudio.com');
    setPassword('studio78452');
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-gold-500/20">
      <div className="w-full max-w-md bg-white rounded-3xl border border-beige-200 shadow-premium p-8 sm:p-9 space-y-6">
        {/* Studio Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-studio-800 text-gold-400 mb-1 border border-gold-400/30 shadow-subtle">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-studio-900">
            Tamil Designer Studio
          </h1>
          <p className="text-xs uppercase font-sans tracking-widest text-gold-700 font-semibold">
            Dynamic QR Management Console
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
              Admin Email / Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tamildesignerstudio.com"
              className="w-full px-4 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-500 bg-cream-50/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
              Passcode / Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-500 bg-cream-50/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-studio-800 hover:bg-studio-900 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-subtle text-sm disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="p-3.5 rounded-2xl bg-cream-50 border border-beige-200 text-xs text-studio-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-studio-800 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-gold-600" />
              Default Studio Passcode:
            </span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-[11px] font-semibold text-gold-700 hover:text-gold-800 underline"
            >
              Fill Credentials
            </button>
          </div>
          <p className="font-mono text-studio-800 bg-white px-2.5 py-1 rounded border border-beige-200">
            Passcode: studio78452
          </p>
        </div>

        <div className="pt-2 text-center">
          <a
            href="/tamil-designer-studio"
            className="text-xs text-studio-500 hover:text-studio-800 underline transition-colors"
          >
            ← Return to Public Digital Visiting Card
          </a>
        </div>
      </div>
    </div>
  );
};
