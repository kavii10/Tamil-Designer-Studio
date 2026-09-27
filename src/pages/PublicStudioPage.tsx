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
} from 'lucide-react';
import { InstagramIcon } from '../components/icons/InstagramIcon';
import { db } from '../services/db';
import { BusinessSettings, CourseItem, ServiceItem } from '../types';
import { ServiceCard } from '../components/studio/ServiceCard';
import { CourseCard } from '../components/studio/CourseCard';

/* ═══════════════════════════════════════════════
   SPLASH SCREEN (Clean Large Logo, No Star Above)
═══════════════════════════════════════════════ */
const SplashScreen: React.FC<{ onDone: () => void; isDark: boolean }> = ({ onDone, isDark }) => {
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
            className={`font-serif font-bold text-xl sm:text-2xl tracking-tight ${
              isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
            }`}
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
            School of Fashion Design &amp; Tailoring
          </div>
          <p
            className={`text-xs font-serif italic pt-1 ${
              isDark ? 'text-[#A8A3B8]' : 'text-[#87654C]'
            }`}
          >
            "Wear Dreams, Not Just Clothes"
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
   OVERVIEW TAB (Beige & Gold / Midnight & Gold)
═══════════════════════════════════════════════ */
const OverviewSection: React.FC<{
  studio: BusinessSettings;
  services: ServiceItem[];
  isDark: boolean;
  onSelectCourses: () => void;
  onSelectServices: () => void;
}> = ({ studio, services, isDark, onSelectCourses, onSelectServices }) => {
  const features = [
    { icon: Users, label: 'Personalised Guidance', desc: '1-on-1 attention for every student' },
    { icon: BookOpen, label: 'Industry-Ready Syllabus', desc: 'Practical modern syllabus' },
    { icon: Zap, label: '100% Practical Training', desc: 'Real stitching on live garments' },
    { icon: Award, label: 'Expert Mentorship', desc: 'Master boutique techniques' },
  ];

  const levels = [
    {
      name: 'Beginner Level',
      desc: 'Machine basics, fundamental stitching & hand tools',
      badge: 'Foundations',
      bg: isDark
        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
        : 'bg-emerald-50/90 border-emerald-300/80 text-emerald-950',
    },
    {
      name: 'Intermediate Level',
      desc: 'Pattern drafting, women’s wear creation & fitting',
      badge: 'Core Skills',
      bg: isDark
        ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
        : 'bg-amber-50/90 border-amber-300/80 text-amber-950',
    },
    {
      name: 'Advanced Level',
      desc: 'Designer garments, bridal stitching & boutique mastery',
      badge: 'Couture Mastery',
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
          <span>ISEIT India Federation · Govt. Regd. &amp; ISO Certified</span>
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

        <div className="relative z-10 text-center space-y-4">
          <div
            className={`inline-block px-3 py-1 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-sm ${
              isDark
                ? 'bg-gold-500/15 border-gold-400/30 text-gold-300'
                : 'bg-[#EEDBBF] border-[#D9B562] text-[#634215]'
            }`}
          >
            School of Fashion Design &amp; Tailoring
          </div>

          <h2
            className={`text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight leading-tight ${
              isDark ? 'text-[#FDFCF9]' : 'text-[#26150D]'
            }`}
          >
            Tamil Designer Studio
          </h2>

          <p
            className={`font-serif italic text-base sm:text-xl ${
              isDark ? 'text-[#E8BE56]' : 'text-[#9B7120]'
            }`}
          >
            Learn · Create · Master
          </p>

          <p
            className={`text-xs sm:text-sm max-w-lg mx-auto leading-relaxed ${
              isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'
            }`}
          >
            Turn your passion for fashion into a profession. We offer certified, hands-on courses for beginners to advanced designers, along with bespoke custom tailoring.
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
                Levels
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
                Practical
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
                Certified
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
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Course Levels Overview ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className={`w-4 h-4 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`} />
            <h3
              className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-[#A7A2B8]' : 'text-[#7C6556]'
              }`}
            >
              Course Curriculum Levels
            </h3>
          </div>
          <button
            onClick={onSelectCourses}
            className={`text-xs font-bold hover:underline flex items-center gap-1 ${
              isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
            }`}
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {levels.map((lvl) => (
            <div
              key={lvl.name}
              onClick={onSelectCourses}
              className={`cursor-pointer rounded-2xl border p-4 transition-all hover:scale-[1.02] hover:shadow-md ${lvl.bg} flex flex-col justify-between`}
            >
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 mb-2">
                  {lvl.badge}
                </span>
                <h4 className="font-serif font-bold text-sm sm:text-base leading-snug">
                  {lvl.name}
                </h4>
                <p className="text-xs opacity-80 mt-1 leading-relaxed">{lvl.desc}</p>
              </div>
              <span
                className={`text-[11px] font-bold mt-3 flex items-center gap-1 ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                }`}
              >
                Explore syllabus <ChevronRight className="w-3 h-3" />
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
            Specialized Masterclass
          </span>
          <h4
            className={`font-serif font-bold text-sm sm:text-base mt-0.5 ${
              isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
            }`}
          >
            Saree Prepleting Class
          </h4>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'
            }`}
          >
            Master professional draping, precision box folding, hanger folding &amp; buffy pleats.
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
          Why Choose Tamil Designer Studio
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* ── Batch Timings Card ── */}
      <div
        className={`rounded-2xl border p-5 shadow-sm space-y-3 ${
          isDark ? 'bg-[#171622] border-[#2C293A]' : 'bg-white border-[#E8DAC2]'
        }`}
      >
        <div
          className={`font-bold text-xs uppercase tracking-wider flex items-center gap-2 ${
            isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
          }`}
        >
          <Clock className="w-4 h-4" />
          Batch &amp; Class Timings
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
              Morning Batch
            </p>
            <p
              className={`font-semibold text-xs mt-0.5 ${
                isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
              }`}
            >
              9:00 AM – 1:00 PM
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
              Evening Batch
            </p>
            <p
              className={`font-semibold text-xs mt-0.5 ${
                isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
              }`}
            >
              3:00 PM – 8:00 PM
            </p>
          </div>
        </div>
        <p
          className={`text-[11px] text-center ${
            isDark ? 'text-[#8E899E]' : 'text-[#7C6556]'
          }`}
        >
          Monday to Friday · Regular &amp; Weekend batches available
        </p>
      </div>

      {/* ── Custom Stitching Services Preview ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className={`w-4 h-4 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`} />
            <h3
              className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-[#A7A2B8]' : 'text-[#7C6556]'
              }`}
            >
              Custom Stitching &amp; Tailoring Services
            </h3>
          </div>
          <button
            onClick={onSelectServices}
            className={`text-xs font-bold hover:underline flex items-center gap-1 ${
              isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
            }`}
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.slice(0, 4).map((service) => (
            <div
              key={service.id}
              onClick={onSelectServices}
              className={`cursor-pointer rounded-2xl border p-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-all ${
                isDark
                  ? 'bg-[#171622] border-[#2C293A]'
                  : 'bg-white border-[#E8DAC2] hover:border-[#D9B562]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                  isDark
                    ? 'bg-gradient-to-br from-[#252233] to-[#1A1824] border-[#3C384D] text-[#E8BE56]'
                    : 'bg-gradient-to-br from-[#FAF5EB] to-[#F3E7D3] border-[#E0D0B6] text-[#B8861B]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                  }`}
                >
                  {service.title}
                </p>
                {service.description && (
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isDark ? 'text-[#8E899E]' : 'text-[#7C6556]'
                    }`}
                  >
                    {service.description}
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
const BottomBar: React.FC<{ studio: BusinessSettings; isDark: boolean }> = ({ studio, isDark }) => {
  const actions = [
    {
      href: studio.whatsapp_url,
      icon: MessageCircle,
      label: 'WhatsApp',
      color: isDark ? 'text-emerald-400' : 'text-emerald-700',
      activeBg: isDark ? 'hover:bg-emerald-950/40' : 'hover:bg-emerald-50',
    },
    {
      href: `tel:+${studio.phone_raw}`,
      icon: Phone,
      label: 'Call',
      color: isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]',
      activeBg: isDark ? 'hover:bg-[#252233]' : 'hover:bg-[#FAF5EB]',
    },
    {
      href: studio.instagram_url,
      icon: InstagramIcon,
      label: 'Instagram',
      color: isDark ? 'text-rose-400' : 'text-rose-700',
      activeBg: isDark ? 'hover:bg-rose-950/40' : 'hover:bg-rose-50',
    },
    {
      href: studio.maps_url,
      icon: MapPin,
      label: 'Directions',
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
      <div className="max-w-4xl mx-auto px-4 py-2 grid grid-cols-4 gap-1">
        {actions.map(({ href, icon: Icon, label, color, activeBg }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('tel') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all active:scale-95 ${color} ${activeBg}`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-bold tracking-tight">{label}</span>
          </a>
        ))}
      </div>
      <div
        className={`text-center text-[9px] pb-2 px-4 truncate ${
          isDark ? 'text-[#8E899E]' : 'text-[#8A7160]'
        }`}
      >
        1/208C, Jeeva St, Chinniyampalayam, Coimbatore – 641062 &nbsp;·&nbsp; Mon–Fri: 9–1 &amp; 3–8
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN PUBLIC STUDIO PAGE
═══════════════════════════════════════════════ */
export const PublicStudioPage: React.FC = () => {
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'courses'>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSettings, loadedServices, loadedCourses] = await Promise.all([
          db.getBusinessSettings(),
          db.getServices(true),
          db.getCourses(true),
        ]);
        setSettings(loadedSettings);
        setServices(loadedServices);
        // Exclude Boutique Business Training per user request
        setCourses(
          loadedCourses.filter(
            (c) => c.id !== 'c5' && !c.title.toLowerCase().includes('boutique business')
          )
        );
      } catch (err) {
        console.error('Failed to load studio details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} isDark={isDark} />;
  }

  const studio = settings!;

  const tabs: { key: 'overview' | 'services' | 'courses'; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: Star },
    { key: 'services', label: `Services (${services.length})`, icon: Scissors },
    { key: 'courses', label: `Courses (${courses.length})`, icon: GraduationCap },
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">

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
                className={`text-sm sm:text-base font-serif font-bold tracking-tight ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                Tamil Designer Studio
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider hidden sm:block ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                }`}
              >
                School of Fashion Design &amp; Tailoring
              </span>
            </div>
          </div>

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
      </header>

      {/* ── Tab Navigation ── */}
      <div
        className={`sticky top-[57px] z-30 backdrop-blur-md border-b ${
          isDark ? 'bg-[#0E0E14]/95 border-[#2A2838]' : 'bg-[#FAF5EC]/95 border-[#E8DAC2]'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 relative ${
                  activeTab === key
                    ? isDark
                      ? 'border-[#D9A73A] text-[#FAF6EE]'
                      : 'border-[#D9A73A] text-[#2A170E]'
                    : isDark
                      ? 'border-transparent text-[#8E899E] hover:text-[#FAF6EE]'
                      : 'border-transparent text-[#7C6556] hover:text-[#2A170E]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`}
                />
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <OverviewSection
            studio={studio}
            services={services}
            isDark={isDark}
            onSelectCourses={() => setActiveTab('courses')}
            onSelectServices={() => setActiveTab('services')}
          />
        )}

        {/* 2. SERVICES TAB */}
        {activeTab === 'services' && (
          <section className="space-y-4 animate-fadeIn">
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDark ? 'border-[#2A2838]' : 'border-[#E8DAC2]'
              }`}
            >
              <div>
                <h3
                  className={`text-xl sm:text-2xl font-serif font-bold ${
                    isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                  }`}
                >
                  Bespoke Stitching &amp; Designer Services
                </h3>
                <p
                  className={`text-xs mt-0.5 ${
                    isDark ? 'text-[#8E899E]' : 'text-[#7C6556]'
                  }`}
                >
                  High-precision craftsmanship tailored to your unique elegance
                </p>
              </div>
              <Scissors
                className={`w-6 h-6 shrink-0 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} isDark={isDark} />
              ))}
            </div>
          </section>
        )}

        {/* 3. COURSES TAB */}
        {activeTab === 'courses' && (
          <section className="space-y-4 animate-fadeIn">
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDark ? 'border-[#2A2838]' : 'border-[#E8DAC2]'
              }`}
            >
              <div>
                <h3
                  className={`text-xl sm:text-2xl font-serif font-bold ${
                    isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                  }`}
                >
                  School of Fashion Design &amp; Tailoring
                </h3>
                <p
                  className={`text-xs mt-0.5 ${
                    isDark ? 'text-[#8E899E]' : 'text-[#7C6556]'
                  }`}
                >
                  Hands-on professional training with certification &amp; boutique mentorship
                </p>
              </div>
              <GraduationCap
                className={`w-6 h-6 shrink-0 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  whatsappUrl={studio.whatsapp_url}
                  isDark={isDark}
                />
              ))}
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
            © {new Date().getFullYear()} {studio.business_name}. All rights reserved.
          </div>
          <a
            href="/admin"
            className={`text-[10px] underline transition-colors ${
              isDark
                ? 'text-[#8E899E] hover:text-[#E8BE56]'
                : 'text-[#8A7160] hover:text-[#B8861B]'
            }`}
          >
            Admin Dashboard
          </a>
        </footer>
      </main>

      {/* ── Fixed Bottom Contact Bar ── */}
      <BottomBar studio={studio} isDark={isDark} />

    </div>
  );
};
