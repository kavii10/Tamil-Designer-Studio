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
  CheckCircle2,
  Languages,
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { authService } from '../../services/auth';
import { Lang } from '../../i18n/translations';

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
  editLang?: Lang;
  onLangChange?: (lang: Lang) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onLogout,
  editLang = 'en',
  onLangChange,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'qrcodes' as AdminTab, label: 'QR Codes', icon: QrCode },
    { id: 'profile' as AdminTab, label: 'Business Profile', icon: Store },
    { id: 'courses' as AdminTab, label: 'Courses & Academy', icon: GraduationCap },
    { id: 'services' as AdminTab, label: 'Stitching Services', icon: Scissors },
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

        <div className="flex items-center gap-2">
          {onLangChange && (
            <button
              type="button"
              onClick={() => onLangChange(editLang === 'en' ? 'ta' : 'en')}
              className="px-2.5 py-1.5 rounded-lg border border-gold-500/40 bg-studio-800 text-gold-300 text-xs font-bold flex items-center gap-1 active:scale-95"
              title="Toggle Language / மொழி மாற்று"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{editLang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-studio-800 text-cream-100 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-studio-900 text-cream-100 flex flex-col justify-between p-6 z-50 transition-transform duration-300 border-r border-gold-900/30 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-5">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 pb-4 border-b border-studio-800">
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

          {/* Edit Language Switcher in Sidebar */}
          {onLangChange && (
            <div className="p-2.5 rounded-xl bg-studio-800/90 border border-gold-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-studio-400">
                <span className="flex items-center gap-1.5 text-gold-400 font-medium">
                  <Languages className="w-3.5 h-3.5" />
                  Edit Language:
                </span>
                <span className="font-bold text-cream-100 uppercase tracking-wider text-[10px]">
                  {editLang === 'ta' ? 'தமிழ்' : 'English'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 bg-studio-950/60 p-1 rounded-lg border border-studio-800">
                <button
                  type="button"
                  onClick={() => onLangChange('en')}
                  className={`py-1 rounded-md text-xs font-bold transition-all ${
                    editLang === 'en'
                      ? 'bg-gold-500 text-studio-950 shadow-sm'
                      : 'text-cream-300 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onLangChange('ta')}
                  className={`py-1 rounded-md text-xs font-bold transition-all ${
                    editLang === 'ta'
                      ? 'bg-gold-500 text-studio-950 shadow-sm'
                      : 'text-cream-300 hover:text-white'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>
          )}

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
            onClick={() => authService.logout()}
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

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/50 transition-colors font-medium text-left"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Lock &amp; Logout</span>
          </button>
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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-4">
        {/* Top Language Banner for Content Editing Tabs */}
        {onLangChange && (currentTab === 'profile' || currentTab === 'courses' || currentTab === 'services') && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-beige-300 rounded-2xl p-3 px-4 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center shrink-0">
                <Languages className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-studio-900 block leading-tight">
                  {editLang === 'ta' ? 'தமிழ் மொழி திருத்துதல் முறை (Tamil Edit Mode)' : 'English Content Edit Mode'}
                </span>
                <span className="text-[11px] text-studio-500">
                  {editLang === 'ta' ? 'நீங்கள் செய்யும் மாற்றங்கள் தமிழ் பதிப்பில் சேமிக்கப்படும்' : 'Changes you make will save to the English version'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
              <span className="text-[11px] text-studio-500 font-medium mr-1 hidden sm:inline">Switch:</span>
              <div className="inline-flex rounded-xl p-1 bg-cream-100 border border-beige-300">
                <button
                  type="button"
                  onClick={() => onLangChange('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    editLang === 'en'
                      ? 'bg-studio-900 text-gold-300 shadow-sm'
                      : 'text-studio-700 hover:text-studio-900'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onLangChange('ta')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    editLang === 'ta'
                      ? 'bg-studio-900 text-gold-300 shadow-sm'
                      : 'text-studio-700 hover:text-studio-900'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>
        )}

        {children}
      </main>
    </div>
  );
};
