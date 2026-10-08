import React, { useState } from 'react';
import { GraduationCap, ArrowUpRight, Sparkles, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { CourseItem } from '../../types';
import { Lang } from '../../i18n/translations';

interface CourseCardProps {
  course: CourseItem;
  whatsappUrl: string;
  isDark?: boolean;
  lang?: Lang;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  whatsappUrl,
  isDark = false,
  lang = 'en',
}) => {
  const [showAllTopics, setShowAllTopics] = useState(false);
  const isSignature = course.level === 'Specialized' || course.title.toLowerCase().includes('blouse') || course.title.toLowerCase().includes('saree');

  const isTa = lang === 'ta';
  const displayTitle = (isTa && course.title_ta) ? course.title_ta : course.title;
  const displayLevel = (isTa && course.level_ta) ? course.level_ta : course.level;
  const displayBadge = (isTa && course.badge_ta) ? course.badge_ta : course.badge;
  const displayDescription = (isTa && course.description_ta) ? course.description_ta : course.description;
  const displayTopics = (isTa && course.topics_ta && course.topics_ta.length > 0) ? course.topics_ta : course.topics;

  const inquiryUrl = `${whatsappUrl}&text=${encodeURIComponent(
    isTa
      ? `வணக்கம் தமிழ் டிசைனர் ஸ்டூடியோ, உங்கள் ${displayTitle} படிப்பு பாடத்திட்டம் பற்றி விசாரிக்க அல்லது சேர விரும்புகிறேன்.`
      : `Hello Tamil Designer Studio, I would like to enroll in or inquire about your ${course.title} course syllabus.`
  )}`;

  const visibleTopics = showAllTopics ? displayTopics : displayTopics.slice(0, 6);

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border ${
        isDark
          ? isSignature
            ? 'bg-gradient-to-br from-[#201D2E] via-[#191724] to-[#12111A] border-[#D9A73A]/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)] ring-1 ring-[#D9A73A]/30 text-[#FAF6EE]'
            : 'bg-gradient-to-b from-[#171622] to-[#12111A] border-[#2C293A] shadow-sm hover:border-[#D9A73A]/60 text-[#FAF6EE]'
          : isSignature
            ? 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF4EA] to-[#F3E7D3] border-[#D9B562] shadow-[0_8px_30px_rgba(212,175,55,0.18)] ring-1 ring-[#D9B562]/30 text-[#2A170E]'
            : 'bg-gradient-to-b from-white to-[#FDFBF7] border-[#E8DAC2] shadow-sm hover:shadow-[0_10px_25px_-5px_rgba(212,175,55,0.18)] hover:border-[#D9B562] text-[#2A170E]'
      }`}
    >
      <div className="space-y-4">
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isSignature
                  ? 'bg-gradient-to-r from-[#D9A73A] to-[#B8861B] text-[#160E07] shadow-sm'
                  : isDark
                    ? 'bg-[#252233] text-[#E8DAC2]'
                    : 'bg-[#F2E7D5] text-[#2A170E]'
              }`}
            >
              {displayLevel}
            </span>
            {displayBadge && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                  isDark
                    ? 'text-[#E8BE56] bg-[#2E2818] border-[#524424]'
                    : 'text-[#8C6010] bg-[#FAF0DC] border-[#DFC99C]'
                }`}
              >
                <Sparkles className={`w-3 h-3 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`} />
                {displayBadge}
              </span>
            )}
          </div>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
              isDark
                ? 'text-[#A7A2B8] bg-[#1D1B29] border-[#322F42]'
                : 'text-[#7C6556] bg-[#FAF5EB] border-[#E8DAC2]'
            }`}
          >
            {isTa ? 'நடைமுறை & சான்றிதழ்' : 'Practical & Certified'}
          </span>
        </div>

        <div className="space-y-2">
          <h4
            className={`font-serif font-bold text-lg sm:text-xl leading-relaxed sm:leading-loose tracking-normal [word-spacing:0.14em] ${
              isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
            }`}
          >
            {displayTitle}
          </h4>
          {displayDescription && (
            <p
              className={`text-xs sm:text-[13px] leading-relaxed sm:leading-loose mt-2 [word-spacing:0.12em] ${
                isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'
              }`}
            >
              {displayDescription}
            </p>
          )}
        </div>

        {/* Topics / Syllabus Checklist */}
        <div
          className={`pt-3 border-t space-y-3 ${
            isDark ? 'border-[#252332]' : 'border-[#F2E7D5]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wide [word-spacing:0.1em] ${
                isDark ? 'text-[#8E899E]' : 'text-[#8A7160]'
              }`}
            >
              {isTa ? `பாடத்திட்ட தலைப்புகள் (${displayTopics.length}):` : `Curriculum Topics (${displayTopics.length}):`}
            </span>
            {displayTopics.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAllTopics(!showAllTopics)}
                className={`text-xs font-bold flex items-center gap-1 ${
                  isDark ? 'text-[#E8BE56]' : 'text-[#8C6010]'
                }`}
              >
                {showAllTopics ? (
                  <>{isTa ? 'குறைவாகக் காட்டு' : 'Show Less'} <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>{isTa ? `அனைத்து ${displayTopics.length} தலைப்புகள்` : `All ${displayTopics.length} Topics`} <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            )}
          </div>

          <ul className="space-y-2 sm:space-y-2.5">
            {visibleTopics.map((topic, index) => (
              <li
                key={index}
                className={`flex items-start gap-2.5 text-xs sm:text-[13px] ${
                  isDark ? 'text-[#DDD8E8]' : 'text-[#3E291C]'
                }`}
              >
                <span
                  className={`text-[10px] font-mono font-bold w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    isDark
                      ? 'bg-[#2E2818] text-[#E8BE56] border-[#524424]'
                      : 'bg-[#FAF0DC] text-[#8C6010] border-[#DFC99C]'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="leading-relaxed sm:leading-loose pt-0.5 [word-spacing:0.12em]">{topic}</span>
              </li>
            ))}
          </ul>

          {displayTopics.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllTopics(!showAllTopics)}
              className={`inline-flex items-center gap-1 text-xs font-semibold pt-1 transition-colors ${
                isDark ? 'text-[#E8BE56] hover:underline' : 'text-[#9B6E18] hover:underline'
              }`}
            >
              {showAllTopics ? (
                <>
                  {isTa ? 'குறைவாகக் காட்டு' : 'Show Less'} <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  {isTa
                    ? `+${displayTopics.length - 6} கூடுதல் தலைப்புகள் (முழு பாடத்திட்டம் காண்க)`
                    : `+${displayTopics.length - 6} More Topics (View Full Syllabus)`}{' '}
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Inquiry Footer */}
      <div
        className={`mt-6 pt-3.5 border-t flex items-center justify-between ${
          isDark ? 'border-[#252332]' : 'border-[#F2E7D5]'
        }`}
      >
        <span
          className={`text-[11px] flex items-center gap-1.5 font-medium ${
            isDark ? 'text-[#A7A2B8]' : 'text-[#7C6556]'
          }`}
        >
          <GraduationCap
            className={`w-3.5 h-3.5 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`}
          />
          {isTa ? 'நடைமுறை பயிற்சி' : 'Practical Training'}
        </span>
        <div className="flex items-center gap-2">
          {course.pdf_url && (
            <a
              href={course.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-700 dark:text-gold-300 hover:underline px-2 py-1 rounded-lg bg-gold-50 dark:bg-gold-950/40 border border-gold-300/60"
            >
              <FileText className="w-3 h-3" />
              <span>PDF</span>
            </a>
          )}
          <a
            href={inquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F1108] bg-gradient-to-r from-[#D9A73A] via-[#E8BE56] to-[#C9962A] hover:brightness-105 px-3.5 py-1.5 rounded-xl transition-all shadow-[0_2px_10px_rgba(217,167,58,0.3)] active:scale-95"
          >
            <span>{isTa ? 'பாடத்திட்டம் விசாரிக்க' : 'Inquire Syllabus'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
