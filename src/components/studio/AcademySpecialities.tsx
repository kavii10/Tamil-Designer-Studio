import React from 'react';
import { Sparkles, Zap, CheckCircle2, Sliders, Cpu } from 'lucide-react';

interface AcademySpecialitiesProps {
  isDark: boolean;
  className?: string;
  showTitle?: boolean;
}

export const AcademySpecialities: React.FC<AcademySpecialitiesProps> = ({
  isDark,
  className = '',
  showTitle = true,
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${
                isDark ? 'bg-[#E8BE56]/15 text-[#E8BE56]' : 'bg-[#D9A73A]/15 text-[#9E6E16]'
              }`}
            >
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3
                className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                Our Academy Specialities
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-[#A7A2B8]' : 'text-[#7C6556]'}`}>
                Why learning fashion designing with us is unique, faster, and tailored for you
              </p>
            </div>
          </div>

          <span
            className={`self-start sm:self-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isDark
                ? 'bg-[#E8BE56]/10 border-[#E8BE56]/30 text-[#E8BE56]'
                : 'bg-[#D9A73A]/15 border-[#D9A73A]/40 text-[#8C6010]'
            }`}
          >
            Exclusive Benefits
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── SPECIALITY 1: CUSTOMISED COURSE SELECTION ── */}
        <div
          className={`relative rounded-2xl p-5 sm:p-6 border transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden group ${
            isDark
              ? 'bg-gradient-to-br from-[#232032] via-[#1B1927] to-[#14131D] border-[#423C56] hover:border-[#D9A73A]/60'
              : 'bg-gradient-to-br from-[#FFFDF9] via-[#FCF7ED] to-[#F5ECE0] border-[#E5D7C3] hover:border-[#D9B562]'
          }`}
        >
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9A73A]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D9A73A]/20 transition-all" />

          <div className="relative space-y-3">
            {/* Badge & Number */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isDark
                    ? 'bg-[#D9A73A]/15 border-[#D9A73A]/40 text-[#E8BE56]'
                    : 'bg-[#F2E5D0] border-[#D9B562] text-[#7A500C]'
                }`}
              >
                <Sliders className="w-3 h-3 text-[#D9A73A]" />
                Speciality 1 &bull; 100% Flexible
              </span>
              <span
                className={`text-xs font-serif font-black tracking-widest ${
                  isDark ? 'text-[#5C5672]' : 'text-[#C5B49E]'
                }`}
              >
                01 / 02
              </span>
            </div>

            {/* Title */}
            <div>
              <h4
                className={`text-base sm:text-lg font-serif font-bold leading-tight ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                Customise Your Course Based On Your Need
              </h4>
              <p
                className={`text-xs font-semibold mt-1 ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#9E6E16]'
                }`}
              >
                Learn only what you want — zero forced packages!
              </p>
            </div>

            {/* Example Callout Box */}
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                isDark
                  ? 'bg-[#181622]/90 border-[#383348] text-[#D1CADB]'
                  : 'bg-white/90 border-[#E8DAC2] text-[#4A392D]'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#D9A73A]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real Example:</span>
              </div>
              <p>
                If you only need to learn <strong className={isDark ? 'text-[#FAF6EE]' : 'text-[#160E07]'}>Blouse Variations</strong> and <strong className={isDark ? 'text-[#FAF6EE]' : 'text-[#160E07]'}>Kurti Variations</strong>, you can enroll exclusively for those specific modules.
              </p>
            </div>

            {/* Highlights List */}
            <ul className="space-y-1.5 pt-1 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className={isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}>
                  Choose individual modules (Blouses, Kurtis, Pants, Maxi Gowns, or Western)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className={isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}>
                  Save time &amp; money by focusing only on your boutique requirements
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className={isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}>
                  Tailored pattern drafting &amp; personalized one-on-one attention
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── SPECIALITY 2: 100% POWER MACHINE TRAINING ── */}
        <div
          className={`relative rounded-2xl p-5 sm:p-6 border transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden group ${
            isDark
              ? 'bg-gradient-to-br from-[#232032] via-[#1B1927] to-[#14131D] border-[#423C56] hover:border-[#D9A73A]/60'
              : 'bg-gradient-to-br from-[#FFFDF9] via-[#FCF7ED] to-[#F5ECE0] border-[#E5D7C3] hover:border-[#D9B562]'
          }`}
        >
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8BE56]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#E8BE56]/20 transition-all" />

          <div className="relative space-y-3">
            {/* Badge & Number */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isDark
                    ? 'bg-[#E8BE56]/15 border-[#E8BE56]/40 text-[#E8BE56]'
                    : 'bg-[#F2E5D0] border-[#D9B562] text-[#7A500C]'
                }`}
              >
                <Zap className="w-3 h-3 text-[#E8BE56] fill-current" />
                Speciality 2 &bull; 100% Power Machines
              </span>
              <span
                className={`text-xs font-serif font-black tracking-widest ${
                  isDark ? 'text-[#5C5672]' : 'text-[#C5B49E]'
                }`}
              >
                02 / 02
              </span>
            </div>

            {/* Title */}
            <div>
              <h4
                className={`text-base sm:text-lg font-serif font-bold leading-tight ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                Full Class On Industrial Power Machines
              </h4>
              <p
                className={`text-xs font-semibold mt-1 ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#9E6E16]'
                }`}
              >
                From start to end we use power machines &bull; Zero pedal machine delay!
              </p>
            </div>

            {/* Advantage Callout Box */}
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                isDark
                  ? 'bg-[#181622]/90 border-[#383348] text-[#D1CADB]'
                  : 'bg-white/90 border-[#E8DAC2] text-[#4A392D]'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#E8BE56]">
                <Cpu className="w-3.5 h-3.5" />
                <span>No Outdated Pedal Machines:</span>
              </div>
              <p>
                No need for wasting precious weeks learning basics on manual pedal machines. You train directly on <strong className={isDark ? 'text-[#FAF6EE]' : 'text-[#160E07]'}>modern industrial electric power machines</strong> from Day 1!
              </p>
            </div>

            {/* Highlights List */}
            <ul className="space-y-1.5 pt-1 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className={isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}>
                  Direct mastery of high-speed industrial servo motors &amp; foot control
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className={isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}>
                  Attain professional boutique &amp; factory-level finish and speed immediately
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className={isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}>
                  Individual power machine assigned per student for full hands-on hours
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
