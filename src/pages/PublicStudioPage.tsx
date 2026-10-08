import React, { useEffect, useState, useCallback } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Scissors,
  GraduationCap,
  Star,
  Award,
  BookOpen,
  Zap,
  Users,
  CheckCircle2,
  Sun,
  Moon,
  TrendingUp,
  Heart,
  ChevronRight,
  Sparkles,
  Languages,
} from 'lucide-react';
import { InstagramIcon } from '../components/icons/InstagramIcon';
import { db, DEFAULT_STAGE_SYLLABUSES } from '../services/db';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BusinessSettings, CourseItem, CourseStageSyllabus, ServiceItem } from '../types';
import { ServiceCard } from '../components/studio/ServiceCard';
import { CourseCard } from '../components/studio/CourseCard';
import { AcademySpecialities } from '../components/studio/AcademySpecialities';
import { CourseStagesSyllabusSection } from '../components/studio/CourseStagesSyllabusSection';
import { SyllabusPdfModal } from '../components/studio/SyllabusPdfModal';
import { useLanguage, getStoredLanguage } from '../hooks/useLanguage';
import { translations, Lang } from '../i18n/translations';

/* ═══════════════════════════════════════════════
   SPLASH SCREEN (Clean Large Logo, No Star Above)
═══════════════════════════════════════════════ */
const SplashScreen: React.FC<{ onDone: () => void; isDark: boolean; studio?: BusinessSettings | null }> = ({
  onDone,
  isDark,
  studio,
}) => {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tEnter = setTimeout(() => setPhase('show'), 120);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 3.4, 100));
    }, 100);

    const tExit = setTimeout(() => setPhase('exit'), 2600);
    const tDone = setTimeout(() => onDone(), 3000);

    return () => {
      clearTimeout(tEnter);
      clearTimeout(tExit);
      clearTimeout(tDone);
      clearInterval(interval);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-4 transition-all duration-500 ${
        isDark
          ? 'bg-gradient-to-b from-[#12111A] via-[#0E0E14] to-[#08080C]'
          : 'bg-gradient-to-b from-[#FAF4EA] via-[#F4E9D8] to-[#ECE0CC]'
      } ${
        phase === 'exit' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-gold-400/25 to-amber-300/10 dark:from-gold-500/10 dark:to-transparent blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-16 w-80 h-80 rounded-full bg-gold-500/20 dark:bg-gold-600/5 blur-3xl pointer-events-none" />

      <div
        className={`relative z-10 flex flex-col items-center gap-6 max-w-lg w-full transition-all duration-700 ${
          phase === 'enter' ? 'opacity-0 scale-90 translate-y-6' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Large Prominent Logo Card (Star Above Removed) */}
        <div className="relative group">
          {/* Ambient Glow Behind Card */}
          <div className="absolute -inset-2 bg-gradient-to-r from-[#D9A73A]/40 via-[#E8BE56]/30 to-[#D9A73A]/40 rounded-3xl blur-lg transition-all duration-1000" />

          {/* Luxury Card Frame */}
          <div
            className={`relative w-80 sm:w-96 md:w-[440px] max-w-[90vw] p-3.5 sm:p-4 rounded-3xl border-2 shadow-2xl overflow-hidden flex items-center justify-center ${
              isDark
                ? 'bg-gradient-to-b from-[#201D2D] to-[#14131D] border-[#D9A73A]/60'
                : 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F2E7D5] border-[#D9B562]'
            }`}
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />

            <img
              src="/logo.png"
              alt="Tamil Designer Studio Logo"
              className="w-full h-auto object-contain rounded-2xl select-none transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Brand Text Below Logo */}
        <div className="text-center space-y-1.5">
          <p
            className={`font-serif font-bold text-xl sm:text-2xl tracking-normal brand-name ${
              isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
            }`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Tamil Designer Studio
          </p>
          <div
            className={`inline-block px-3 py-1 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
              isDark
                ? 'bg-[#2C261B] border-[#524424] text-[#E8BE56]'
                : 'bg-[#EEDBBF] border-[#D9B562] text-[#6B4715]'
            }`}
          >
            {studio?.subtitle || 'School of Fashion Design & Tailoring'}
          </div>
          <p
            className={`text-xs font-serif italic pt-1 ${
              isDark ? 'text-[#A8A3B8]' : 'text-[#87654C]'
            }`}
          >
            "{studio?.tagline || 'Wear Dreams, Not Just Clothes.'}"
          </p>
        </div>

        {/* Luxury Gold Progress Bar */}
        <div
          className={`w-48 sm:w-64 h-1.5 rounded-full overflow-hidden relative shadow-inner ${
            isDark ? 'bg-[#252233]' : 'bg-[#E2D2BC]'
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-[#D9A73A] via-[#E8BE56] to-[#C9962A] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   LANGUAGE PICKER (First-open screen)
═══════════════════════════════════════════════ */
const LanguagePicker: React.FC<{
  isDark: boolean;
  onPick: (lang: Lang) => void;
}> = ({ isDark, onPick }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#12111A] via-[#0E0E14] to-[#08080C]'
          : 'bg-gradient-to-b from-[#FAF4EA] via-[#F4E9D8] to-[#ECE0CC]'
      }`}
    >
      {/* Glow */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-gold-400/20 to-amber-300/10 blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-xl p-1 ${
              isDark ? 'border-[#D9A73A]/60 bg-[#1E1D2A]' : 'border-[#D9B562] bg-[#FAF5EC]'
            }`}
          >
            <img src="/logo.png" alt="Tamil Designer Studio" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5">
          <h2
            className={`text-xl sm:text-2xl font-serif font-bold ${
              isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
            }`}
          >
            Choose Language / மொழி தேர்வு
          </h2>
          <p className={`text-xs ${isDark ? 'text-[#A7A2B8]' : 'text-[#7C6556]'}`}>
            Tap your preferred language to start &bull; தொடங்க விரும்பும் மொழியைத் தொடவும்
          </p>
        </div>

        {/* Language Options — instant click & selection */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* English Option */}
          <button
            type="button"
            onClick={() => onPick('en')}
            className={`group rounded-2xl border-2 p-5 flex flex-col items-center gap-2.5 transition-all active:scale-95 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer ${
              isDark
                ? 'border-[#3C384D] bg-[#171622] hover:border-[#D9A73A] hover:bg-[#232030]'
                : 'border-[#E5D7C3] bg-white hover:border-[#D9B562] hover:bg-[#FFFDF9]'
            }`}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">🇬🇧</span>
            <div className="text-center">
              <span className={`block text-base font-bold ${isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'}`}>
                English
              </span>
              <span className={`text-[10px] font-medium ${isDark ? 'text-[#A7A2B8]' : 'text-[#8A7160]'}`}>
                Continue in English
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#D9A73A] mt-1 group-hover:underline">
              Select →
            </span>
          </button>

          {/* Tamil Option */}
          <button
            type="button"
            onClick={() => onPick('ta')}
            className={`group rounded-2xl border-2 p-5 flex flex-col items-center gap-2.5 transition-all active:scale-95 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer ${
              isDark
                ? 'border-[#3C384D] bg-[#171622] hover:border-[#D9A73A] hover:bg-[#232030]'
                : 'border-[#E5D7C3] bg-white hover:border-[#D9B562] hover:bg-[#FFFDF9]'
            }`}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">🇮🇳</span>
            <div className="text-center">
              <span className={`block text-base font-bold font-sans ${isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'}`}>
                தமிழ்
              </span>
              <span className={`text-[10px] font-medium ${isDark ? 'text-[#A7A2B8]' : 'text-[#8A7160]'}`}>
                தமிழில் தொடரவும்
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#D9A73A] mt-1 group-hover:underline">
              தேர்வு செய் →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   OVERVIEW TAB (Beige & Gold / Midnight & Gold)
═══════════════════════════════════════════════ */
const OverviewSection: React.FC<{
  studio: BusinessSettings;
  services: ServiceItem[];
  isDark: boolean;
  lang: Lang;
  t: (key: import('../i18n/translations').TranslationKey) => string;
  onSelectCourses: () => void;
  onSelectServices: () => void;
  onOpenStageSyllabus?: (stageId: 'beginner' | 'intermediate' | 'advanced') => void;
}> = ({ studio, services, isDark, lang, t, onSelectCourses, onSelectServices, onOpenStageSyllabus }) => {
  const features = [
    { icon: Users, label: t('feature1Label'), desc: t('feature1Desc') },
    { icon: BookOpen, label: t('feature2Label'), desc: t('feature2Desc') },
    { icon: Zap, label: t('feature3Label'), desc: t('feature3Desc') },
    { icon: Award, label: t('feature4Label'), desc: t('feature4Desc') },
  ];

  const levels: {
    id: 'beginner' | 'intermediate' | 'advanced';
    name: string;
    desc: string;
    badge: string;
    bg: string;
  }[] = [
    {
      id: 'beginner',
      name: t('beginnerName'),
      desc: t('beginnerDesc'),
      badge: t('beginnerBadge'),
      bg: isDark
        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
        : 'bg-emerald-50/90 border-emerald-300/80 text-emerald-950',
    },
    {
      id: 'intermediate',
      name: t('intermediateName'),
      desc: t('intermediateDesc'),
      badge: t('intermediateBadge'),
      bg: isDark
        ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
        : 'bg-amber-50/90 border-amber-300/80 text-amber-950',
    },
    {
      id: 'advanced',
      name: t('advancedName'),
      desc: t('advancedDesc'),
      badge: t('advancedBadge'),
      bg: isDark
        ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
        : 'bg-rose-50/90 border-rose-300/80 text-rose-950',
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── ISEIT Accreditation Badge ── */}
      <div className="flex justify-center">
        <div
          className={`inline-flex items-center gap-2 border text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-sm text-center ${
            isDark
              ? 'bg-gradient-to-r from-[#1D1B29] to-[#171622] border-[#3C384D] text-[#E8DAC2]'
              : 'bg-gradient-to-r from-[#F6EDE0] to-[#EFE2D0] border-[#D9B562]/80 text-[#5C3F18]'
          }`}
        >
          <Award className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`} />
          <span>{t('accreditBadge')}</span>
        </div>
      </div>

      {/* ── Main Hero Card ── */}
      <div
        className={`relative rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden transition-all duration-300 border-2 ${
          isDark
            ? 'bg-gradient-to-br from-[#1A1824] via-[#13121C] to-[#0A0A0F] border-[#D9A73A]/40 text-[#FDFCF9]'
            : 'bg-gradient-to-br from-[#FFFDF9] via-[#F8F0E3] to-[#EFE2CE] border-[#D9B562]/80 text-[#2C1910]'
        }`}
      >
        {/* Ambient Radial Highlights */}
        <div
          className={`absolute -top-12 -right-12 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-[#D9A73A]/15' : 'bg-[#E5B842]/20'
          }`}
        />
        <div
          className={`absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-[#D9A73A]/10' : 'bg-[#D9A73A]/15'
          }`}
        />
        <div
          className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent ${
            isDark ? 'via-[#D9A73A]/40' : 'via-[#D9B562]/60'
          }`}
        />

        <div className="relative z-10 text-center space-y-5 sm:space-y-6">
          <div
            className={`inline-block px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm ${
              isDark
                ? 'bg-gold-500/15 border-gold-400/30 text-gold-300'
                : 'bg-[#EEDBBF] border-[#D9B562] text-[#634215]'
            }`}
          >
            {studio.subtitle || t('subtitle')}
          </div>

          <h2
            className={`text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-normal leading-normal sm:leading-relaxed [word-spacing:0.14em] brand-name ${
              isDark ? 'text-[#FDFCF9]' : 'text-[#26150D]'
            }`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Tamil Designer Studio
          </h2>

          <p
            className={`font-serif italic text-base sm:text-xl leading-relaxed sm:leading-loose [word-spacing:0.12em] ${
              isDark ? 'text-[#E8BE56]' : 'text-[#9B7120]'
            }`}
          >
            {studio.quote || t('heroQuote')}
          </p>

          <p
            className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed sm:leading-loose [word-spacing:0.12em] ${
              isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'
            }`}
          >
            {studio.tagline || t('heroDesc')}
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto pt-2">
            <div
              className={`border rounded-2xl p-2.5 sm:p-3 text-center shadow-sm backdrop-blur-sm ${
                isDark ? 'bg-[#201D2D]/80 border-[#383447]' : 'bg-white/90 border-[#E5D7C3]'
              }`}
            >
              <span
                className={`block text-base sm:text-lg font-bold font-serif ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                }`}
              >
                3+
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold ${
                  isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'
                }`}
              >
                {t('metricsLevels')}
              </span>
            </div>
            <div
              className={`border rounded-2xl p-2.5 sm:p-3 text-center shadow-sm backdrop-blur-sm ${
                isDark ? 'bg-[#201D2D]/80 border-[#383447]' : 'bg-white/90 border-[#E5D7C3]'
              }`}
            >
              <span
                className={`block text-base sm:text-lg font-bold font-serif ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                }`}
              >
                100%
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold ${
                  isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'
                }`}
              >
                {t('metricsPractical')}
              </span>
            </div>
            <div
              className={`border rounded-2xl p-2.5 sm:p-3 text-center shadow-sm backdrop-blur-sm ${
                isDark ? 'bg-[#201D2D]/80 border-[#383447]' : 'bg-white/90 border-[#E5D7C3]'
              }`}
            >
              <span
                className={`block text-base sm:text-lg font-bold font-serif ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                }`}
              >
                Govt.
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold ${
                  isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'
                }`}
              >
                {t('metricsCertified')}
              </span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-3">
            <a
              href={studio.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D9A73A] via-[#E8BE56] to-[#C9962A] hover:brightness-105 text-[#160E07] text-xs sm:text-sm font-bold px-7 py-3 rounded-2xl transition-all shadow-[0_4px_20px_rgba(217,167,58,0.38)] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t('inquireWhatsApp')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Academy Specialities Highlight ── */}
      <AcademySpecialities isDark={isDark} lang={lang} />

      {/* ── Course Levels Overview ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GraduationCap className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`} />
            <h3
              className={`text-xs sm:text-sm font-bold uppercase tracking-wider [word-spacing:0.1em] ${
                isDark ? 'text-[#A7A2B8]' : 'text-[#7C6556]'
              }`}
            >
              {t('courseLevelsTitle')}
            </h3>
          </div>
          <button
            onClick={onSelectCourses}
            className={`text-xs font-bold hover:underline flex items-center gap-1.5 [word-spacing:0.08em] ${
              isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
            }`}
          >
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {levels.map((lvl) => (
            <div
              key={lvl.name}
              onClick={() => {
                if (onOpenStageSyllabus) {
                  onOpenStageSyllabus(lvl.id);
                } else {
                  onSelectCourses();
                }
              }}
              className={`cursor-pointer rounded-2xl border-2 p-5 transition-all hover:scale-[1.02] hover:shadow-lg ${lvl.bg} flex flex-col justify-between space-y-3.5`}
            >
              <div className="space-y-2">
                <span className="inline-block text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10 mb-1">
                  {lvl.badge}
                </span>
                <h4 className="font-serif font-bold text-base sm:text-lg leading-relaxed tracking-normal [word-spacing:0.14em]">
                  {lvl.name}
                </h4>
                <p className="text-xs sm:text-[13px] opacity-85 leading-relaxed sm:leading-loose [word-spacing:0.12em]">{lvl.desc}</p>
              </div>
              <span
                className={`text-xs font-bold pt-1 flex items-center gap-1.5 [word-spacing:0.08em] ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                }`}
              >
                {t('seeSyllabusPdf')} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Saree Prepleting Highlight Banner ── */}
      <div
        onClick={onSelectCourses}
        className={`cursor-pointer border-2 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all ${
          isDark
            ? 'bg-gradient-to-r from-[#201D2D] via-[#191724] to-[#12111A] border-[#D9A73A]/60'
            : 'bg-gradient-to-r from-[#FFFDF9] via-[#FAF3E6] to-[#F3E7D3] border-[#D9B562]'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D9A73A] to-[#E8BE56] text-[#160E07] flex items-center justify-center shrink-0 shadow-md">
          <Star className="w-6 h-6 fill-current" />
        </div>
        <div className="flex-1">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isDark
                ? 'text-[#E8BE56] bg-[#2E2818] border-[#524424]'
                : 'text-[#7A500C] bg-[#FAF0DC] border-[#DFC99C]'
            }`}
          >
            {t('sareeBannerBadge')}
          </span>
          <h4
            className={`font-serif font-bold text-sm sm:text-base mt-0.5 ${
              isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
            }`}
          >
            {t('sareeBannerTitle')}
          </h4>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'
            }`}
          >
            {t('sareeBannerDesc')}
          </p>
        </div>
        <ChevronRight
          className={`w-5 h-5 shrink-0 hidden sm:block ${
            isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
          }`}
        />
      </div>

      {/* ── Key Features Grid (4 Pillars) ── */}
      <div className="space-y-3">
        <h3
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
            isDark ? 'text-[#A7A2B8]' : 'text-[#7C6556]'
          }`}
        >
          <TrendingUp className={`w-4 h-4 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`} />
          {t('featuresTitle')} <span className="brand-name" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Tamil Designer Studio</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className={`rounded-2xl border p-4 flex items-center gap-3.5 shadow-sm transition-all ${
                isDark
                  ? 'bg-[#171622] border-[#2C293A]'
                  : 'bg-white border-[#E8DAC2] hover:border-[#D9B562]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                  isDark
                    ? 'bg-gradient-to-br from-[#252233] to-[#1A1824] border-[#3C384D] text-[#E8BE56]'
                    : 'bg-gradient-to-br from-[#FAF5EB] to-[#F3E7D3] border-[#E0D0B6] text-[#8C6010]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p
                  className={`text-xs sm:text-sm font-bold ${
                    isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                  }`}
                >
                  {label}
                </p>
                <p
                  className={`text-[11px] leading-tight mt-0.5 ${
                    isDark ? 'text-[#8E899E]' : 'text-[#7C6556]'
                  }`}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Batch Timings & Studio Location ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Batch & Class Timings */}
        <div
          className={`rounded-2xl border p-5 shadow-sm space-y-3 flex flex-col justify-between ${
            isDark ? 'bg-[#171622] border-[#2C293A]' : 'bg-white border-[#E8DAC2]'
          }`}
        >
          <div className="space-y-3">
            <div
              className={`font-bold text-xs uppercase tracking-wider flex items-center gap-2 ${
                isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
              }`}
            >
              <Clock className="w-4 h-4" />
              {t('timingsTitle')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className={`rounded-xl border p-3 text-center ${
                  isDark
                    ? 'bg-gradient-to-br from-[#252233] to-[#1A1824] border-[#3C384D]'
                    : 'bg-gradient-to-br from-[#FAF5EB] to-[#F3E7D3] border-[#E0D0B6]'
                }`}
              >
                <p
                  className={`font-bold text-xs sm:text-sm ${
                    isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                  }`}
                >
                  {t('morningBatch')}
                </p>
                <p
                  className={`font-semibold text-xs mt-0.5 ${
                    isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                  }`}
                >
                  {t('morningTime')}
                </p>
              </div>
              <div
                className={`rounded-xl border p-3 text-center ${
                  isDark
                    ? 'bg-gradient-to-br from-[#252233] to-[#1A1824] border-[#3C384D]'
                    : 'bg-gradient-to-br from-[#FAF5EB] to-[#F3E7D3] border-[#E0D0B6]'
                }`}
              >
                <p
                  className={`font-bold text-xs sm:text-sm ${
                    isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                  }`}
                >
                  {t('eveningBatch')}
                </p>
                <p
                  className={`font-semibold text-xs mt-0.5 ${
                    isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                  }`}
                >
                  {t('eveningTime')}
                </p>
              </div>
            </div>
          </div>
          <p
            className={`text-[11px] text-center pt-1 ${
              isDark ? 'text-[#8E899E]' : 'text-[#7C6556]'
            }`}
          >
            {studio.timings_weekdays || t('timingsNote')}
          </p>
        </div>

        {/* Card 2: Studio Location & Address */}
        <div
          className={`rounded-2xl border p-5 shadow-sm space-y-3 flex flex-col justify-between ${
            isDark ? 'bg-[#171622] border-[#2C293A]' : 'bg-white border-[#E8DAC2]'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div
                className={`font-bold text-xs uppercase tracking-wider flex items-center gap-2 ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#D9A73A]" />
                {t('locationTitle')}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-[#E8BE56]/10 border-[#E8BE56]/30 text-[#E8BE56]'
                    : 'bg-[#FAF0DC] border-[#DFC99C] text-[#7A500C]'
                }`}
              >
                {t('locationCity')}
              </span>
            </div>

            <div
              className={`rounded-xl border p-3.5 space-y-1.5 ${
                isDark
                  ? 'bg-gradient-to-br from-[#252233] to-[#1A1824] border-[#3C384D]'
                  : 'bg-gradient-to-br from-[#FAF5EB] to-[#F3E7D3] border-[#E0D0B6]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`font-serif font-bold text-sm sm:text-base brand-name ${
                    isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                  }`}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Tamil Designer Studio
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    isDark ? 'bg-[#D9A73A]/20 text-[#E8BE56]' : 'bg-[#D9A73A]/15 text-[#8C6010]'
                  }`}
                >
                  {t('visitStudio')}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm font-medium leading-relaxed ${
                  isDark ? 'text-[#D1CADB]' : 'text-[#4A392D]'
                }`}
              >
                {t('locationAddress')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <a
              href={studio.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D9A73A] via-[#E8BE56] to-[#C9962A] hover:brightness-105 text-[#160E07] text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 fill-current" />
              <span>{t('getDirections')}</span>
            </a>
            <a
              href={`tel:+${studio.phone_raw}`}
              className={`inline-flex items-center justify-center gap-1.5 border text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all active:scale-95 ${
                isDark
                  ? 'bg-[#252233] border-[#3C384D] text-[#FAF6EE] hover:border-[#E8BE56]'
                  : 'bg-white border-[#D9C4A6] text-[#2A170E] hover:border-[#8C6010]'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('call')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Stitching Services Preview ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className={`w-4 h-4 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`} />
            <h3
              className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-[#A7A2B8]' : 'text-[#7C6556]'
              }`}
            >
              {t('stitchingServices')}
            </h3>
          </div>
          <button
            onClick={onSelectServices}
            className={`text-xs font-bold hover:underline flex items-center gap-1 ${
              isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
            }`}
          >
            <span>{t('viewAllServices')} ({services.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.slice(0, 4).map((service) => (
            <div
              key={service.id}
              onClick={onSelectServices}
              className={`cursor-pointer rounded-2xl border p-3 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all ${
                isDark
                  ? 'bg-[#171622] border-[#2C293A]'
                  : 'bg-white border-[#E8DAC2] hover:border-[#D9B562]'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl overflow-hidden border shrink-0 relative shadow-sm ${
                  isDark ? 'border-[#3C384D] bg-[#252233]' : 'border-[#E0D0B6] bg-[#FAF5EB]'
                }`}
              >
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Scissors className={`w-5 h-5 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                  }`}
                >
                  {(lang === 'ta' && service.title_ta) ? service.title_ta : service.title}
                </p>
                {service.description && (
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isDark ? 'text-[#8E899E]' : 'text-[#7C6556]'
                    }`}
                  >
                    {(lang === 'ta' && service.description_ta) ? service.description_ta : service.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

/* ═══════════════════════════════════════════════
   BOTTOM ACTION BAR (Minimal & Touch-Optimized)
═══════════════════════════════════════════════ */
const BottomBar: React.FC<{
  studio: BusinessSettings;
  isDark: boolean;
  t: (key: import('../i18n/translations').TranslationKey) => string;
}> = ({ studio, isDark, t }) => {
  const actions = [
    {
      href: studio.whatsapp_url,
      icon: MessageCircle,
      label: t('bottomWhatsApp'),
      color: isDark ? 'text-emerald-400' : 'text-emerald-700',
      activeBg: isDark ? 'hover:bg-emerald-950/40' : 'hover:bg-emerald-50',
    },
    {
      href: `tel:+${studio.phone_raw}`,
      icon: Phone,
      label: t('bottomCall'),
      color: isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]',
      activeBg: isDark ? 'hover:bg-[#252233]' : 'hover:bg-[#FAF5EB]',
    },
    {
      href: studio.instagram_url,
      icon: InstagramIcon,
      label: t('bottomInstagram'),
      color: isDark ? 'text-rose-400' : 'text-rose-700',
      activeBg: isDark ? 'hover:bg-rose-950/40' : 'hover:bg-rose-50',
    },
    {
      href: studio.maps_url,
      icon: MapPin,
      label: t('bottomDirections'),
      color: isDark ? 'text-amber-400' : 'text-amber-700',
      activeBg: isDark ? 'hover:bg-amber-950/40' : 'hover:bg-amber-50',
    },
  ];

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 backdrop-blur-md border-t shadow-md ${
        isDark ? 'bg-[#12111A]/95 border-[#2A2838]' : 'bg-white/95 border-[#E8DAC2]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 grid grid-cols-4 gap-2">
        {actions.map(({ href, icon: Icon, label, color, activeBg }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('tel') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all active:scale-95 ${color} ${activeBg}`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-[11px] font-bold tracking-normal sm:tracking-wide [word-spacing:0.08em]">{label}</span>
          </a>
        ))}
      </div>
      <div
        className={`text-center text-[10px] pb-2 px-4 truncate [word-spacing:0.08em] ${
          isDark ? 'text-[#8E899E]' : 'text-[#8A7160]'
        }`}
      >
        {studio.address_line1}, {studio.address_line2}, {studio.address_city} – {studio.address_pincode} &nbsp;·&nbsp; {studio.timings_weekdays}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN PUBLIC STUDIO PAGE
═══════════════════════════════════════════════ */
export const PublicStudioPage: React.FC = () => {
  // ── Language ──────────────────────────────────────────────────────────────
  const { lang, setLang, toggleLang, t } = useLanguage();
  // Show language picker on first visit (when no preference stored)
  const [showLangPicker, setShowLangPicker] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tds_language_preference') === null;
    } catch {
      return false;
    }
  });

  const handleLangPick = useCallback((picked: Lang) => {
    setLang(picked);
    setShowLangPicker(false);
  }, [setLang]);

  // ── Theme ─────────────────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tds_theme') === 'dark';
    } catch {
      return false;
    }
  });

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tds_theme', next ? 'dark' : 'light');
      } catch {}
      if (next) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      return next;
    });
  }, []);

  // Sync DOM classes with theme state
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const [showSplash, setShowSplash] = useState(true);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [stageSyllabuses, setStageSyllabuses] = useState<CourseStageSyllabus[]>(DEFAULT_STAGE_SYLLABUSES);
  const [selectedSyllabusStage, setSelectedSyllabusStage] = useState<CourseStageSyllabus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'courses'>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSettings, loadedServices, loadedCourses, loadedStages] = await Promise.all([
          db.getBusinessSettings(),
          db.getServices(true),
          db.getCourses(true),
          db.getStageSyllabuses(),
        ]);
        setSettings(loadedSettings);
        setServices(loadedServices);
        if (loadedStages && loadedStages.length > 0) {
          setStageSyllabuses(loadedStages);
        }
        // Exclude Boutique Business Training per user request
        setCourses(
          loadedCourses.filter(
            (c) => !c.title.toLowerCase().includes('boutique business')
          )
        );
      } catch (err) {
        console.error('Failed to load studio details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Live update listeners when admin updates data
    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BusinessSettings>;
      if (customEvent.detail) setSettings(customEvent.detail);
    };
    const handleServicesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ServiceItem[]>;
      if (customEvent.detail) setServices(customEvent.detail.filter((s) => s.is_active));
    };
    const handleCoursesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CourseItem[]>;
      if (customEvent.detail) {
        setCourses(
          customEvent.detail.filter(
            (c) => c.is_active && !c.title.toLowerCase().includes('boutique business')
          )
        );
      }
    };
    const handleStagesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CourseStageSyllabus[]>;
      if (customEvent.detail) {
        setStageSyllabuses(customEvent.detail);
      }
    };

    // Cross-tab storage change listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tds_business_settings' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'tds_services' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setServices(parsed.filter((s: ServiceItem) => s.is_active));
        } catch {}
      }
      if (e.key === 'tds_courses' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setCourses(
            parsed.filter(
              (c: CourseItem) => c.is_active && c.id !== 'c5' && !c.title.toLowerCase().includes('boutique business')
            )
          );
        } catch {}
      }
      if (e.key === 'tds_stage_syllabuses' && e.newValue) {
        db.getStageSyllabuses().then((stages) => setStageSyllabuses(stages)).catch(() => {});
      }
    };

    window.addEventListener('tds_settings_updated', handleSettingsUpdate);
    window.addEventListener('tds_services_updated', handleServicesUpdate);
    window.addEventListener('tds_courses_updated', handleCoursesUpdate);
    window.addEventListener('tds_stage_syllabuses_updated', handleStagesUpdate);
    window.addEventListener('storage', handleStorageChange);

    // Cross-device sync: Refetch when window regains focus or visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', loadData);

    // Cross-device real-time sync with Supabase Realtime
    let channel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('tds_public_live_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'business_settings' },
          async () => {
            try {
              const freshSettings = await db.getBusinessSettings();
              setSettings(freshSettings);
            } catch (e) {
              console.warn('Realtime settings sync error:', e);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'courses' },
          async () => {
            try {
              const freshCourses = await db.getCourses(true);
              setCourses(
                freshCourses.filter((c) => !c.title.toLowerCase().includes('boutique business'))
              );
            } catch (e) {
              console.warn('Realtime courses sync error:', e);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'services' },
          async () => {
            try {
              const freshServices = await db.getServices(true);
              setServices(freshServices);
            } catch (e) {
              console.warn('Realtime services sync error:', e);
            }
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('tds_settings_updated', handleSettingsUpdate);
      window.removeEventListener('tds_services_updated', handleServicesUpdate);
      window.removeEventListener('tds_courses_updated', handleCoursesUpdate);
      window.removeEventListener('tds_stage_syllabuses_updated', handleStagesUpdate);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadData);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Show language picker on very first open (before splash)
  if (showLangPicker) {
    return <LanguagePicker isDark={isDark} onPick={handleLangPick} />;
  }

  if (loading || showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} isDark={isDark} studio={settings} />;
  }

  const studio = settings!;

  const tabs: { key: 'overview' | 'services' | 'courses'; label: string }[] = [
    { key: 'overview', label: t('tabOverview') },
    { key: 'services', label: `${t('tabServices')} (${services.length})` },
    { key: 'courses', label: `${t('tabCourses')} (${courses.length})` },
  ];

  return (
    <div
      className={`min-h-screen selection:bg-gold-500/20 pb-32 transition-colors duration-300 ${
        isDark ? 'dark bg-[#0E0E14] text-[#FAF6EE]' : 'bg-[#FAF5EC] text-[#2A170E]'
      }`}
    >
      {/* ── Top Header Bar ── */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-sm ${
          isDark ? 'bg-[#15151F]/95 border-[#2A2838]' : 'bg-white/95 border-[#E8DAC2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">

          {/* Logo on Left */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border shadow-sm flex items-center justify-center p-0.5 shrink-0 ${
                isDark
                  ? 'border-[#D9A73A]/60 bg-[#1E1D2A]'
                  : 'border-[#D9B562] bg-[#FAF5EC]'
              }`}
            >
              <img
                src="/logo.png"
                alt="Tamil Designer Studio Logo"
                className="w-full h-full object-cover rounded-lg select-none"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={`text-sm sm:text-base font-serif font-bold tracking-normal brand-name ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Tamil Designer Studio
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider hidden sm:block ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                }`}
              >
                {studio.subtitle || t('subtitle')}
              </span>
            </div>
          </div>

          {/* Right: Language Toggle + Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Language Toggle Button (Shows opposite target language, like Dark/Light theme) */}
            <button
              onClick={toggleLang}
              type="button"
              title={lang === 'en' ? 'தமிழுக்கு மாற்றவும் (Switch to Tamil)' : 'Switch to English'}
              aria-label={lang === 'en' ? 'Switch to Tamil' : 'Switch to English'}
              className={`h-10 px-3.5 rounded-xl flex items-center gap-1.5 border transition-all active:scale-95 shadow-sm text-xs font-bold ${
                isDark
                  ? 'bg-[#222030] border-[#3C384D] text-[#E8BE56] hover:border-[#D9A73A]'
                  : 'bg-gradient-to-br from-[#FAF5EB] to-[#F3E7D3] border-[#D9B562] text-[#5C3F18] hover:border-[#B8861B]'
              }`}
            >
              <Languages className="w-3.5 h-3.5 shrink-0 text-[#D9A73A]" />
              <span className="tracking-wide">
                {lang === 'en' ? 'தமிழ்' : 'English'}
              </span>
            </button>

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              type="button"
              title={isDark ? 'Switch to Light Mode (Beige & Gold)' : 'Switch to Dark Mode (Midnight & Gold)'}
              aria-label="Toggle Theme"
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-95 shadow-sm ${
                isDark
                  ? 'bg-[#222030] border-[#3C384D] text-[#E8BE56] hover:border-[#D9A73A]'
                  : 'bg-gradient-to-br from-[#FAF5EB] to-[#F3E7D3] border-[#D9B562] text-[#5C3F18] hover:border-[#B8861B]'
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-[#E8BE56] animate-spin-slow" />
              ) : (
                <Moon className="w-5 h-5 text-[#5C3F18]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Tab Navigation ── */}
      <div
        className={`sticky top-[57px] z-30 backdrop-blur-md border-b ${
          isDark ? 'bg-[#0E0E14]/95 border-[#2A2838]' : 'bg-[#FAF5EC]/95 border-[#E8DAC2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center py-4 px-3 text-xs sm:text-sm font-bold tracking-normal sm:tracking-wide transition-all border-b-2 relative [word-spacing:0.12em] leading-relaxed ${
                  activeTab === key
                    ? isDark
                      ? 'border-[#D9A73A] text-[#FAF6EE]'
                      : 'border-[#D9A73A] text-[#2A170E]'
                    : isDark
                      ? 'border-transparent text-[#8E899E] hover:text-[#FAF6EE]'
                      : 'border-transparent text-[#7C6556] hover:text-[#2A170E]'
                }`}
              >
                <span>{label}</span>
                {activeTab === key && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#D9A73A] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <OverviewSection
            studio={studio}
            services={services}
            isDark={isDark}
            lang={lang}
            t={t}
            onSelectCourses={() => setActiveTab('courses')}
            onSelectServices={() => setActiveTab('services')}
            onOpenStageSyllabus={(stageId) => {
              const found =
                stageSyllabuses.find((s) => s.id === stageId) || stageSyllabuses[0];
              setSelectedSyllabusStage(found);
            }}
          />
        )}

        {/* 2. STITCHING SERVICES TAB */}
        {activeTab === 'services' && (
          <section className="space-y-6 animate-fadeIn">
            {/* Header with Poster Tagline */}
            <div
              className={`rounded-3xl p-6 sm:p-8 border shadow-sm text-center space-y-3 relative overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-br from-[#1C1A27] via-[#14131D] to-[#0D0C13] border-[#383348]'
                  : 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E8] to-[#F2E5D0] border-[#E8DAC2]'
              }`}
            >
              <div
                className={`inline-block px-3 py-1 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
                  isDark
                    ? 'bg-gold-500/15 border-gold-400/30 text-gold-300'
                    : 'bg-[#EEDBBF] border-[#D9B562] text-[#634215]'
                }`}
              >
                {t('servicesTabBadge')}
              </div>

              <h3
                className={`text-2xl sm:text-3xl font-serif font-bold ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                {t('servicesTabTitle')}
              </h3>

              <p
                className={`text-xs sm:text-sm font-semibold tracking-wider uppercase ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#9B7120]'
                }`}
              >
                {t('servicesTagline')}
              </p>

              {/* 4 Pillars Badges from Poster */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 max-w-xl mx-auto">
                {[
                  t('pillarPerfect'),
                  t('pillarTrendy'),
                  t('pillarQuality'),
                  t('pillarSize'),
                ].map((label) => (
                  <div
                    key={label}
                    className={`rounded-xl border py-2 px-2.5 flex items-center justify-center text-[11px] font-bold shadow-2xs ${
                      isDark
                        ? 'bg-[#252233]/70 border-[#3C384D] text-[#E8DAC2]'
                        : 'bg-white/80 border-[#E5D7C3] text-[#5C3F18]'
                    }`}
                  >
                    <span className="truncate">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} isDark={isDark} lang={lang} />
              ))}
            </div>

            {/* Custom Inquiry CTA Banner */}
            <div
              className={`rounded-2xl p-5 border text-center space-y-3 shadow-sm ${
                isDark
                  ? 'bg-gradient-to-r from-[#201D2D] to-[#171622] border-[#383348]'
                  : 'bg-gradient-to-r from-[#FAF5EB] to-[#F3E7D3] border-[#E8DAC2]'
              }`}
            >
              <h4
                className={`font-serif font-bold text-base sm:text-lg ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                {t('customInquiryTitle')}
              </h4>
              <p
                className={`text-xs max-w-md mx-auto ${
                  isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'
                }`}
              >
                {t('customInquiryDesc')}
              </p>
              <div>
                <a
                  href={studio.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D9A73A] via-[#E8BE56] to-[#C9962A] text-[#160E07] text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{t('discussCustom')}</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* 3. COURSES TAB */}
        {activeTab === 'courses' && (
          <section className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div
              className={`rounded-3xl p-6 sm:p-8 border shadow-sm text-center space-y-3 relative overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-br from-[#1C1A27] via-[#14131D] to-[#0D0C13] border-[#383348]'
                  : 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E8] to-[#F2E5D0] border-[#E8DAC2]'
              }`}
            >
              <div
                className={`inline-block px-3 py-1 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
                  isDark
                    ? 'bg-gold-500/15 border-gold-400/30 text-gold-300'
                    : 'bg-[#EEDBBF] border-[#D9B562] text-[#634215]'
                }`}
              >
                {t('coursesTabBadge')}
              </div>

              <h3
                className={`text-2xl sm:text-3xl font-serif font-bold ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                {t('coursesTabTitle')}
              </h3>

              <p
                className={`text-xs sm:text-sm font-semibold tracking-wider uppercase ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#9B7120]'
                }`}
              >
                {t('coursesTagline')}
              </p>

              {/* 4 Pillars Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 max-w-xl mx-auto">
                {[
                  t('pillarPractical'),
                  t('pillarMachines'),
                  t('pillarCert'),
                  t('pillarBoutique'),
                ].map((label) => (
                  <div
                    key={label}
                    className={`rounded-xl border py-2 px-2.5 flex items-center justify-center text-[11px] font-bold shadow-2xs ${
                      isDark
                        ? 'bg-[#252233]/70 border-[#3C384D] text-[#E8DAC2]'
                        : 'bg-white/80 border-[#E5D7C3] text-[#5C3F18]'
                    }`}
                  >
                    <span className="truncate">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academy Specialities Spotlight */}
            <AcademySpecialities isDark={isDark} lang={lang} />

            {/* 3 Course Stages Syllabus Boxes (Beginner, Intermediate, Advanced) */}
            <CourseStagesSyllabusSection
              stages={stageSyllabuses}
              isDark={isDark}
              lang={lang}
              onOpenSyllabus={(stage) => setSelectedSyllabusStage(stage)}
            />

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  whatsappUrl={studio.whatsapp_url}
                  isDark={isDark}
                  lang={lang}
                />
              ))}
            </div>

            {/* Consultation CTA Banner */}
            <div
              className={`rounded-2xl p-5 border text-center space-y-3 shadow-sm ${
                isDark
                  ? 'bg-gradient-to-r from-[#201D2D] to-[#171622] border-[#383348]'
                  : 'bg-gradient-to-r from-[#FAF5EB] to-[#F3E7D3] border-[#E8DAC2]'
              }`}
            >
              <h4
                className={`font-serif font-bold text-base sm:text-lg ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                {t('enrollTitle')}
              </h4>
              <p
                className={`text-xs max-w-md mx-auto ${
                  isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'
                }`}
              >
                {t('enrollDesc')}
              </p>
              <div>
                <a
                  href={studio.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D9A73A] via-[#E8BE56] to-[#C9962A] text-[#160E07] text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{t('inquireAdmission')}</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer
          className={`text-center pt-8 pb-4 space-y-2 border-t ${
            isDark ? 'border-[#2A2838]' : 'border-[#E8DAC2]'
          }`}
        >
          <div
            className={`flex items-center justify-center gap-1.5 ${
              isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <p className="font-serif italic text-sm">
              "{studio.tagline}"
            </p>
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
          <div
            className={`text-[10px] ${
              isDark ? 'text-[#8E899E]' : 'text-[#8A7160]'
            }`}
          >
            © {new Date().getFullYear()} {studio.business_name}. {t('allRightsReserved')}
          </div>
          <a
            href="/admin"
            className={`text-[10px] underline transition-colors ${
              isDark
                ? 'text-[#8E899E] hover:text-[#E8BE56]'
                : 'text-[#8A7160] hover:text-[#B8861B]'
            }`}
          >
            {t('adminDashboard')}
          </a>
        </footer>
      </main>

      {/* ── Fixed Bottom Contact Bar ── */}
      <BottomBar studio={studio} isDark={isDark} t={t} />

      {/* ── Syllabus PDF Viewer & Download Modal ── */}
      {selectedSyllabusStage && (
        <SyllabusPdfModal
          stage={selectedSyllabusStage}
          whatsappUrl={studio.whatsapp_url}
          isDark={isDark}
          lang={lang}
          onClose={() => setSelectedSyllabusStage(null)}
        />
      )}

    </div>
  );
};
