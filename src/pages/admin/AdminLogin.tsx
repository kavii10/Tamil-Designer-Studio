import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/auth';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login(password);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Authentication failed. Please check the passcode.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-gold-500/20">
      <div className="w-full max-w-md bg-white rounded-3xl border border-beige-200 shadow-premium p-8 sm:p-9 space-y-6">
        
        {/* Studio Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-studio-900 border border-gold-400/40 shadow-subtle p-1 mb-1">
            <img
              src="/logo.png"
              alt="Tamil Designer Studio"
              className="w-full h-full object-contain rounded-xl select-none"
            />
          </div>
          <h1 className="text-2xl font-serif font-bold text-studio-900">
            Tamil Designer Studio
          </h1>
          <p className="text-xs uppercase font-sans tracking-widest text-gold-700 font-semibold">
            Admin Management Console
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-2xl bg-gold-50/80 border border-gold-300 text-xs text-gold-950 flex items-start gap-2.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
          <span>
            <strong>Strict Passcode Verification:</strong> For security across all mobile devices, tablets, and PCs, the admin passcode is strictly required on every access to unlock studio management.
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
              Admin Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full px-4 py-3 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-500 bg-cream-50/50 pr-11 text-studio-900"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-studio-400 hover:text-studio-700 p-1"
                aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full flex items-center justify-center gap-2 bg-studio-900 hover:bg-studio-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-subtle text-sm disabled:opacity-50 mt-3 active:scale-[0.99]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4 text-gold-400" />
                <span>Unlock Admin Console</span>
                <ArrowRight className="w-4 h-4 text-gold-400 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <a
            href="/tamil-designer-studio"
            className="text-xs text-studio-500 hover:text-studio-800 underline transition-colors"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};
