import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Server
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AdminSettings: React.FC = () => {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleCopySchemaPath = async () => {
    try {
      await navigator.clipboard.writeText('supabase/schema.sql');
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    } catch {
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all data back to Tamil Designer Studio factory defaults? Any custom destination or profile edits will be restored to defaults.'
      )
    ) {
      localStorage.clear();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-beige-200 pb-5">
        <h1 className="text-2xl font-serif font-bold text-studio-900 tracking-tight">
          System & Database Settings
        </h1>
        <p className="text-xs sm:text-sm text-studio-500 mt-1">
          Infrastructure status, Supabase cloud configuration, and database maintenance.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Defaults restored! Reloading application...</span>
        </div>
      )}

      {/* Database Connection Card */}
      <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-beige-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gold-600" />
            <h3 className="font-serif font-bold text-studio-900 text-base">
              Database Engine Status
            </h3>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-gold-100 text-gold-800 border border-gold-300'
            }`}
          >
            {isSupabaseConfigured ? 'Supabase Connected' : 'Local Persistence Mode'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-studio-600 leading-relaxed">
          {isSupabaseConfigured
            ? 'Your application is connected to your Supabase PostgreSQL cluster with full Row Level Security (RLS).'
            : 'Running in high-speed local persistence mode. All destination changes, QR codes, scan logs, and profile settings are saved locally and reactive across all tabs.'}
        </p>

        {/* Cloud Setup Instructions */}
        <div className="bg-cream-50 rounded-2xl p-4 sm:p-5 border border-beige-200 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-studio-800 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-gold-600" />
            How to Connect to your free Supabase instance:
          </h4>
          <ol className="text-xs text-studio-700 space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              Create a free project at <span className="font-semibold">supabase.com</span>.
            </li>
            <li>
              Go to the <span className="font-semibold">SQL Editor</span> in Supabase and execute the script in{' '}
              <code className="bg-white px-2 py-0.5 rounded border border-beige-200 font-mono text-studio-900">
                supabase/schema.sql
              </code>
              .
            </li>
            <li>
              Add your credentials to <code className="bg-white px-2 py-0.5 rounded border border-beige-200 font-mono">.env</code>:
              <pre className="mt-2 bg-studio-900 text-gold-300 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
              </pre>
            </li>
          </ol>

          <button
            onClick={handleCopySchemaPath}
            className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-beige-100 text-studio-800 border border-beige-300 px-3 py-1.5 rounded-lg transition-colors font-medium shadow-subtle"
          >
            {copiedSchema ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Path Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Schema Path</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security & RLS Overview */}
      <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 sm:p-7 space-y-3">
        <div className="flex items-center gap-2 border-b border-beige-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-serif font-bold text-studio-900 text-base">
            Security & QR Protection
          </h3>
        </div>

        <ul className="text-xs text-studio-600 space-y-2 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-studio-800">Permanent QR Slug Integrity:</strong> QR codes encode only the permanent redirect URL. Destination URLs are resolved server-side / client-side dynamically.
          </li>
          <li>
            <strong className="text-studio-800">URL Sanitization:</strong> All destination updates are validated to prevent malicious schemes.
          </li>
          <li>
            <strong className="text-studio-800">Row Level Security (RLS):</strong> Unauthenticated users can only query active slugs and public business details. Destination modifications require authentication.
          </li>
          <li>
            <strong className="text-studio-800">Privacy Safeguards:</strong> No personal user identifiable information (PII) or IP addresses are stored during QR scans.
          </li>
        </ul>
      </div>

      {/* Factory Reset */}
      <div className="bg-white rounded-2xl border border-red-200 shadow-subtle p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif font-bold text-red-900 text-sm">
              Restore Factory Seed Data
            </h4>
            <p className="text-xs text-studio-500 mt-0.5">
              Reset all courses, services, business settings, and visiting card QR back to fresh defaults.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3.5 py-2 rounded-xl transition-colors font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
