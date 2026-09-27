import React, { useState } from 'react';
import {
  LayoutDashboard,
  QrCode,
  Store,
  GraduationCap,
  Scissors,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Database,
  CheckCircle2
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { authService } from '../../services/auth';

export type AdminTab =
  | 'dashboard'
  | 'qrcodes'
  | 'profile'
  | 'courses'
  | 'services'
  | 'analytics'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'qrcodes' as AdminTab, label: 'QR Codes', icon: QrCode },
    { id: 'profile' as AdminTab, label: 'Business Profile', icon: Store },
    { id: 'courses' as AdminTab, label: 'Courses & Academy', icon: GraduationCap },
    { id: 'services' as AdminTab, label: 'Tailoring Services', icon: Scissors },
    { id: 'analytics' as AdminTab, label: 'Scan Analytics', icon: BarChart3 },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row text-studio-900 selection:bg-gold-500/20">
      {/* Mobile Top App Bar */}
      <header className="md:hidden bg-studio-900 text-white p-4 flex items-center justify-between border-b border-gold-900/40 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Tamil Designer Studio Logo"
            className="w-8 h-8 object-contain rounded-lg bg-cream-100 p-0.5 shadow-sm"
          />
          <div>
            <h1 className="font-serif font-bold text-sm tracking-wide leading-none">
              Tamil Designer Studio
            </h1>
            <span className="text-[10px] text-gold-400">Dynamic QR Console</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-studio-800 text-cream-100 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-studio-900 text-cream-100 flex flex-col justify-between p-6 z-50 transition-transform duration-300 border-r border-gold-900/30 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 pb-5 border-b border-studio-800">
            <img
              src="/logo.png"
              alt="Tamil Designer Studio Logo"
              className="w-12 h-12 object-contain rounded-2xl bg-cream-100 p-1 shadow-gold shrink-0"
            />
            <div>
              <h2 className="font-serif font-bold text-sm text-cream-50 leading-tight">
                Tamil Designer Studio
              </h2>
              <p className="text-[11px] text-gold-400 font-sans tracking-wide">
                Dynamic QR Manager
              </p>
            </div>
          </div>

          {/* Database Mode Status */}
          <div className="px-3 py-2 rounded-xl bg-studio-800/80 border border-studio-700/60 flex items-center justify-between text-[11px]">
            <span className="text-studio-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-gold-400" />
              Engine:
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full ${
                isSupabaseConfigured
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-gold-950 text-gold-300 border border-gold-800'
              }`}
            >
              {isSupabaseConfigured ? 'Supabase Cloud' : 'Local Persistence'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gold-500 text-studio-950 font-semibold shadow-gold'
                      : 'text-cream-200/80 hover:bg-studio-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-studio-950' : 'text-gold-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-2 pt-6 border-t border-studio-800">
          <a
            href="/tamil-designer-studio"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-gold-300 hover:text-white bg-studio-800/80 hover:bg-studio-800 transition-colors font-medium border border-studio-700/60"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              View Public Website
            </span>
            <span className="text-[10px] bg-gold-500/20 text-gold-300 px-1.5 py-0.5 rounded font-mono">
              Live
            </span>
          </a>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Page Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
