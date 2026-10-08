import React from 'react';
import { Sparkles, Zap, CheckCircle2, Sliders, Cpu } from 'lucide-react';

interface AcademySpecialitiesProps {
  isDark: boolean;
  className?: string;
  showTitle?: boolean;
  lang?: 'en' | 'ta';
}

export const AcademySpecialities: React.FC<AcademySpecialitiesProps> = ({
  isDark,
  className = '',
  showTitle = true,
  lang = 'en',
}) => {
  const isTa = lang === 'ta';

  return (
    <div className={`space-y-6 sm:space-y-7 ${className}`}>
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isDark ? 'bg-[#E8BE56]/15 text-[#E8BE56]' : 'bg-[#D9A73A]/15 text-[#9E6E16]'
              }`}
            >
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3
                className={`text-sm sm:text-base font-bold tracking-normal sm:tracking-wide leading-relaxed ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                {isTa ? 'எங்கள் அகாடமி சிறப்பம்சங்கள்' : 'Our Academy Specialities'}
              </h3>
              <p className={`text-xs sm:text-[13px] mt-1 leading-relaxed [word-spacing:0.12em] ${isDark ? 'text-[#A7A2B8]' : 'text-[#7C6556]'}`}>
                {isTa
                  ? 'எங்களிடம் ஃபேஷன் டிசைனிங் கற்பது ஏன் தனித்துவமானது, விரைவானது மற்றும் உங்கள் விருப்பத்திற்கேற்ப வடிவமைக்கப்பட்டது'
                  : 'Why learning fashion designing with us is unique, faster, and tailored for you'}
              </p>
            </div>
          </div>

          <span
            className={`self-start sm:self-auto text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border shadow-2xs ${
              isDark
                ? 'bg-[#E8BE56]/10 border-[#E8BE56]/30 text-[#E8BE56]'
                : 'bg-[#D9A73A]/15 border-[#D9A73A]/40 text-[#8C6010]'
            }`}
          >
            {isTa ? 'சிறப்பு நன்மைகள்' : 'Exclusive Benefits'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* ── SPECIALITY 1: CUSTOMISED COURSE SELECTION ── */}
        <div
          className={`relative rounded-3xl p-5 sm:p-8 border-2 transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden group ${
            isDark
              ? 'bg-gradient-to-br from-[#232032] via-[#1B1927] to-[#14131D] border-[#423C56] hover:border-[#D9A73A]/60'
              : 'bg-gradient-to-br from-[#FFFDF9] via-[#FCF7ED] to-[#F5ECE0] border-[#E5D7C3] hover:border-[#D9B562]'
          }`}
        >
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#D9A73A]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D9A73A]/20 transition-all" />

          <div className="relative space-y-5 sm:space-y-6">
            {/* Badge & Number — with generous gap & width control so they never touch */}
            <div className="flex items-center justify-between gap-3 min-w-0">
              <span
                className={`inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold tracking-normal sm:tracking-wide px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border shadow-2xs min-w-0 shrink max-w-[calc(100%-3.5rem)] ${
                  isDark
                    ? 'bg-[#D9A73A]/15 border-[#D9A73A]/40 text-[#E8BE56]'
                    : 'bg-[#F2E5D0] border-[#D9B562] text-[#7A500C]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#D9A73A] shrink-0" />
                <span className="truncate">
                  {isTa ? 'சிறப்பம்சம் 1 • 100% விருப்பம்' : 'Speciality 1 • 100% Flexible'}
                </span>
              </span>
              <span
                className={`text-xs font-serif font-black tracking-widest shrink-0 ml-auto pl-2 ${
                  isDark ? 'text-[#5C5672]' : 'text-[#C5B49E]'
                }`}
              >
                01 / 02
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2">
              <h4
                className={`text-lg sm:text-xl font-serif font-bold leading-relaxed sm:leading-loose tracking-normal [word-spacing:0.14em] ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                {isTa
                  ? 'உங்கள் தேவைக்கேற்ப பாடத்திட்டத்தை நீங்களே தேர்ந்தெடுக்கலாம்'
                  : 'Customise Your Course Based On Your Need'}
              </h4>
              <p
                className={`text-xs sm:text-sm font-semibold leading-relaxed tracking-normal [word-spacing:0.12em] ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#9E6E16]'
                }`}
              >
                {isTa
                  ? 'உங்களுக்குத் தேவையானதை மட்டும் கற்றுக் கொள்ளுங்கள் — கட்டாய பேக்கேஜ் இல்லை!'
                  : 'Learn only what you want — zero forced packages!'}
              </p>
            </div>

            {/* Example Callout Box */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-[13px] leading-relaxed sm:leading-loose space-y-2.5 [word-spacing:0.12em] ${
                isDark
                  ? 'bg-[#181622]/90 border-[#383348] text-[#D1CADB]'
                  : 'bg-white/95 border-[#E8DAC2] text-[#4A392D]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs sm:text-[13px] text-[#D9A73A] tracking-wide">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{isTa ? 'உதாரணம்:' : 'Real Example:'}</span>
              </div>
              <p className="leading-relaxed sm:leading-loose">
                {isTa ? (
                  <>
                    உங்களுக்கு <strong className={isDark ? 'text-[#FAF6EE]' : 'text-[#160E07]'}>பிளவுஸ்</strong> மற்றும் <strong className={isDark ? 'text-[#FAF6EE]' : 'text-[#160E07]'}>குர்தி வகைகள்</strong> மட்டுமே கற்க வேண்டும் என்றால், அந்தப் பாடப் பிரிவுகளை மட்டும் தேர்வு செய்து படிக்கலாம்.
                  </>
                ) : (
                  <>
                    If you only need to learn <strong className={isDark ? 'text-[#FAF6EE]' : 'text-[#160E07]'}>Blouse Variations</strong> and <strong className={isDark ? 'text-[#FAF6EE]' : 'text-[#160E07]'}>Kurti Variations</strong>, you can enroll exclusively for those specific modules.
                  </>
                )}
              </p>
            </div>

            {/* Highlights List */}
            <ul className="space-y-3 sm:space-y-3.5 pt-2 text-xs sm:text-[13px] leading-relaxed sm:leading-loose [word-spacing:0.12em]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span className={`leading-relaxed sm:leading-loose ${isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}`}>
                  {isTa
                    ? 'தனித்தனி பாடப் பிரிவுகளை தேர்வு செய்யலாம் (பிளவுஸ், குர்தி, பேண்ட், மேக்ஸி கவுன் அல்லது வெஸ்டர்ன் ஆடைகள்)'
                    : 'Choose individual modules (Blouses, Kurtis, Pants, Maxi Gowns, or Western)'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span className={`leading-relaxed sm:leading-loose ${isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}`}>
                  {isTa
                    ? 'உங்கள் பொட்டிக் தேவைக்கு மட்டும் கவனம் செலுத்துவதன் மூலம் நேரத்தையும் பணத்தையும் மிச்சப்படுத்துங்கள்'
                    : 'Save time & money by focusing only on your boutique requirements'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span className={`leading-relaxed sm:leading-loose ${isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}`}>
                  {isTa
                    ? 'தனிப்பயனாக்கப்பட்ட பேட்டர்ன் வரைதல் & ஒருவருக்கு ஒருவர் தனிப்பட்ட நேரடி பயிற்சி'
                    : 'Tailored pattern drafting & personalized one-on-one attention'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── SPECIALITY 2: 100% POWER MACHINE TRAINING ── */}
        <div
          className={`relative rounded-3xl p-5 sm:p-8 border-2 transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden group ${
            isDark
              ? 'bg-gradient-to-br from-[#232032] via-[#1B1927] to-[#14131D] border-[#423C56] hover:border-[#D9A73A]/60'
              : 'bg-gradient-to-br from-[#FFFDF9] via-[#FCF7ED] to-[#F5ECE0] border-[#E5D7C3] hover:border-[#D9B562]'
          }`}
        >
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#E8BE56]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#E8BE56]/20 transition-all" />

          <div className="relative space-y-5 sm:space-y-6">
            {/* Badge & Number — with generous gap & width control so they never touch */}
            <div className="flex items-center justify-between gap-3 min-w-0">
              <span
                className={`inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold tracking-normal sm:tracking-wide px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border shadow-2xs min-w-0 shrink max-w-[calc(100%-3.5rem)] ${
                  isDark
                    ? 'bg-[#E8BE56]/15 border-[#E8BE56]/40 text-[#E8BE56]'
                    : 'bg-[#F2E5D0] border-[#D9B562] text-[#7A500C]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#E8BE56] fill-current shrink-0" />
                <span className="truncate">
                  {isTa ? 'சிறப்பம்சம் 2 • 100% பவர் மெஷின்' : 'Speciality 2 • 100% Power Machines'}
                </span>
              </span>
              <span
                className={`text-xs font-serif font-black tracking-widest shrink-0 ml-auto pl-2 ${
                  isDark ? 'text-[#5C5672]' : 'text-[#C5B49E]'
                }`}
              >
                02 / 02
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2">
              <h4
                className={`text-lg sm:text-xl font-serif font-bold leading-relaxed sm:leading-loose tracking-normal [word-spacing:0.14em] ${
                  isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
                }`}
              >
                {isTa
                  ? 'முழு வகுப்பும் நவீன இண்டஸ்ட்ரியல் பவர் மெஷின்களில் மட்டுமே'
                  : 'Full Class On Industrial Power Machines'}
              </h4>
              <p
                className={`text-xs sm:text-sm font-semibold leading-relaxed tracking-normal [word-spacing:0.12em] ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#9E6E16]'
                }`}
              >
                {isTa
                  ? 'தொடக்கத்திலிருந்து இறுதி வரை பவர் மெஷின்கள் • கால் பெடல் மெஷின் தாமதம் இல்லை!'
                  : 'From start to end we use power machines • Zero pedal machine delay!'}
              </p>
            </div>

            {/* Advantage Callout Box */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-[13px] leading-relaxed sm:leading-loose space-y-2.5 [word-spacing:0.12em] ${
                isDark
                  ? 'bg-[#181622]/90 border-[#383348] text-[#D1CADB]'
                  : 'bg-white/95 border-[#E8DAC2] text-[#4A392D]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs sm:text-[13px] text-[#E8BE56] tracking-wide">
                <Cpu className="w-4 h-4 shrink-0" />
                <span>{isTa ? 'பழைய பெடல் மெஷின் பயிற்சி இல்லை:' : 'No Outdated Pedal Machines:'}</span>
              </div>
              <p className="leading-relaxed sm:leading-loose">
                {isTa ? (
                  <>
                    பழைய கால் பெடல் மெஷினில் அடிப்படை கற்க பல வாரங்களை வீணடிக்க வேண்டியதில்லை. முதல் நாளிலிருந்தே <strong className={isDark ? 'text-[#FAF6EE]' : 'text-[#160E07]'}>நவீன தொழில்துறை பவர் மெஷினில்</strong> நேரடியாக பயிற்சி பெறுங்கள்!
                  </>
                ) : (
                  <>
                    No need for wasting precious weeks learning basics on manual pedal machines. You train directly on <strong className={isDark ? 'text-[#FAF6EE]' : 'text-[#160E07]'}>modern industrial electric power machines</strong> from Day 1!
                  </>
                )}
              </p>
            </div>

            {/* Highlights List */}
            <ul className="space-y-3 sm:space-y-3.5 pt-2 text-xs sm:text-[13px] leading-relaxed sm:leading-loose [word-spacing:0.12em]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span className={`leading-relaxed sm:leading-loose ${isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}`}>
                  {isTa
                    ? 'அதிவேக இண்டஸ்ட்ரியல் சர்வோ மோட்டார்கள் மற்றும் கால் கட்டுப்பாடு நேரடி தேர்ச்சி'
                    : 'Direct mastery of high-speed industrial servo motors & foot control'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span className={`leading-relaxed sm:leading-loose ${isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}`}>
                  {isTa
                    ? 'தொழில்முறை பொட்டிக் & கார்மென்ட்ஸ் தரத்திலான தையல் ஃபினிஷிங் மற்றும் வேகத்தை உடனடியாக அடையுங்கள்'
                    : 'Attain professional boutique & factory-level finish and speed immediately'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span className={`leading-relaxed sm:leading-loose ${isDark ? 'text-[#D1CADB]' : 'text-[#5C4535]'}`}>
                  {isTa
                    ? 'முழு நேர செய்முறை பயிற்சிக்காக ஒவ்வொரு மாணவிகளுக்கும் தனித்தனி பவர் மெஷின் ஒதுக்கீடு'
                    : 'Individual power machine assigned per student for full hands-on hours'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
