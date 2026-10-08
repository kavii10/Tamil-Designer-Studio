import React from 'react';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Scissors,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { CourseStageSyllabus } from '../../types';
import { downloadPdf, generateStageSyllabusPdf } from '../../utils/pdfGenerator';
import { Lang } from '../../i18n/translations';

interface CourseStagesSyllabusSectionProps {
  stages: CourseStageSyllabus[];
  isDark?: boolean;
  lang?: Lang;
  onOpenSyllabus: (stage: CourseStageSyllabus) => void;
}

export const CourseStagesSyllabusSection: React.FC<CourseStagesSyllabusSectionProps> = ({
  stages,
  isDark = false,
  lang = 'en',
  onOpenSyllabus,
}) => {
  const isTa = lang === 'ta';
  const handleDirectDownload = (e: React.MouseEvent, stage: CourseStageSyllabus) => {
    e.stopPropagation();
    const filename =
      stage.pdf_name || `Tamil_Designer_Studio_${stage.id}_Course_Syllabus.pdf`;
    if (stage.pdf_url) {
      downloadPdf(stage.pdf_url, filename);
    } else {
      const blob = generateStageSyllabusPdf(stage);
      downloadPdf(blob, filename);
    }
  };

  // Color schemes and icons for each stage box
  const stageStyling: Record<
    string,
    {
      borderColor: string;
      cardBg: string;
      badgeBg: string;
      badgeText: string;
      icon: React.ElementType;
      accentText: string;
      glowColor: string;
    }
  > = {
    beginner: {
      borderColor: isDark ? 'border-emerald-700/50 hover:border-emerald-500' : 'border-emerald-300 hover:border-emerald-500',
      cardBg: isDark
        ? 'bg-gradient-to-b from-[#14231E]/90 to-[#101916]/95'
        : 'bg-gradient-to-b from-[#F0FBF6] to-[#E5F7EE]',
      badgeBg: isDark ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-emerald-100 border-emerald-300',
      badgeText: isDark ? 'text-emerald-300' : 'text-emerald-900',
      icon: Scissors,
      accentText: isDark ? 'text-emerald-400' : 'text-emerald-800',
      glowColor: 'rgba(16, 185, 129, 0.15)',
    },
    intermediate: {
      borderColor: isDark ? 'border-amber-700/50 hover:border-amber-500' : 'border-amber-300 hover:border-amber-500',
      cardBg: isDark
        ? 'bg-gradient-to-b from-[#241F14]/90 to-[#1A1610]/95'
        : 'bg-gradient-to-b from-[#FFF9EE] to-[#FFF1D6]',
      badgeBg: isDark ? 'bg-amber-500/20 border-amber-500/40' : 'bg-amber-100 border-amber-300',
      badgeText: isDark ? 'text-amber-300' : 'text-amber-900',
      icon: BookOpen,
      accentText: isDark ? 'text-amber-400' : 'text-amber-800',
      glowColor: 'rgba(245, 158, 11, 0.15)',
    },
    advanced: {
      borderColor: isDark ? 'border-purple-700/50 hover:border-purple-500' : 'border-rose-300 hover:border-rose-500',
      cardBg: isDark
        ? 'bg-gradient-to-b from-[#261726]/90 to-[#19111C]/95'
        : 'bg-gradient-to-b from-[#FFF2F5] to-[#FFE2E9]',
      badgeBg: isDark ? 'bg-purple-500/20 border-purple-500/40' : 'bg-rose-100 border-rose-300',
      badgeText: isDark ? 'text-purple-300' : 'text-rose-900',
      icon: Award,
      accentText: isDark ? 'text-purple-300' : 'text-rose-900',
      glowColor: 'rgba(217, 70, 239, 0.15)',
    },
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2.5">
            <GraduationCap className={`w-5 h-5 shrink-0 ${isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'}`} />
            <h3
              className={`text-lg sm:text-xl font-serif font-bold leading-relaxed tracking-normal [word-spacing:0.14em] ${
                isDark ? 'text-[#FAF6EE]' : 'text-[#2A170E]'
              }`}
            >
              {isTa ? 'படிப்பு பாடத்திட்ட நிலைகள் & விவரங்கள்' : 'Course Curriculum Levels & Syllabus'}
            </h3>
          </div>
          <p
            className={`text-xs sm:text-[13px] mt-1.5 leading-relaxed [word-spacing:0.12em] ${
              isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'
            }`}
          >
            {isTa ? (
              <>பாடத்திட்டத்தைப் பார்க்கவும் & PDF-ஐ பதிவிறக்கவும். <strong className="font-semibold text-gold-600 dark:text-gold-400">சிலபஸ் காண்க</strong> என்பதை கிளிக் செய்யுங்கள்.</>
            ) : (
              <>Click <strong className="font-semibold text-gold-600 dark:text-gold-400">See Syllabus</strong> on any course level to view and download the official PDF booklet.</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-2xs ${
              isDark
                ? 'bg-[#252233] border-[#3C384D] text-[#E8DAC2]'
                : 'bg-white border-[#E8DAC2] text-[#5C3F18]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-gold-500" />
            <span>{isTa ? 'பாடத்திட்ட PDF-கள் கிடைக்கின்றன' : 'PDF Syllabuses Available'}</span>
          </span>
        </div>
      </div>

      {/* 3 Course Boxes: Beginner, Intermediate, Advanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {stages.map((stage) => {
          const style = stageStyling[stage.id] || stageStyling.beginner;
          const IconComponent = style.icon;
          const hasCustomPdf = Boolean(stage.pdf_url);
          const displayTitle = (isTa && stage.title_ta) ? stage.title_ta : stage.title;
          const displayBadge = (isTa && stage.badge_ta) ? stage.badge_ta : stage.badge;
          const displayDescription = (isTa && stage.description_ta) ? stage.description_ta : stage.description;

          return (
            <div
              key={stage.id}
              className={`rounded-3xl border-2 p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:scale-[1.015] flex flex-col justify-between relative group ${style.borderColor} ${style.cardBg}`}
              style={{
                boxShadow: `0 8px 24px ${style.glowColor}`,
              }}
            >
              <div className="space-y-5">
                {/* Header: Badge & Icon */}
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border shadow-2xs ${style.badgeBg} ${style.badgeText}`}
                  >
                    {displayBadge}
                  </span>

                  <div className="w-9 h-9 rounded-2xl bg-white/70 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center shadow-xs">
                    <IconComponent className={`w-4 h-4 ${style.accentText}`} />
                  </div>
                </div>

                {/* Course Title & Level */}
                <div className="space-y-2">
                  <h4
                    className={`font-serif font-bold text-lg sm:text-xl leading-relaxed sm:leading-loose tracking-normal [word-spacing:0.14em] ${
                      isDark ? 'text-white' : 'text-[#1F140E]'
                    }`}
                  >
                    {displayTitle}
                  </h4>
                  <p
                    className={`text-xs sm:text-[13px] leading-relaxed sm:leading-loose [word-spacing:0.12em] ${
                      isDark ? 'text-[#C5BFD6]' : 'text-[#5A4537]'
                    }`}
                  >
                    {displayDescription}
                  </p>
                </div>
              </div>

              {/* Action Buttons: See Syllabus & Download PDF */}
              <div className="pt-4 mt-3 border-t border-black/10 dark:border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] px-1">
                  <span
                    className={`flex items-center gap-1 font-semibold ${
                      hasCustomPdf
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : isDark
                        ? 'text-[#A7A2B8]'
                        : 'text-[#7C6556]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {hasCustomPdf
                      ? (isTa ? 'ஸ்டூடியோ PDF புதுப்பிக்கப்பட்டது' : 'Studio PDF Updated')
                      : (isTa ? 'அதிகாரப்பூர்வ சிலபஸ் PDF' : 'Official Syllabus PDF')}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">
                    {stage.pdf_size || (isTa ? 'உடனடி PDF' : 'Instant PDF')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Primary "See Syllabus" Button */}
                  <button
                    type="button"
                    onClick={() => onOpenSyllabus(stage)}
                    className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D9A73A] via-[#E8BE56] to-[#C9962A] text-[#160E07] font-bold text-xs py-2.5 px-3 rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isTa ? 'சிலபஸ் காண்க' : 'See Syllabus'}</span>
                  </button>

                  {/* Direct "Download" Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDirectDownload(e, stage)}
                    className={`w-full flex items-center justify-center gap-1.5 border font-bold text-xs py-2.5 px-3 rounded-xl transition-all active:scale-95 ${
                      isDark
                        ? 'bg-[#252233] hover:bg-[#302B40] border-[#3C384D] text-[#FAF6EE]'
                        : 'bg-white hover:bg-cream-100 border-[#D4C3AC] text-[#2A170E] shadow-2xs'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5 text-gold-500" />
                    <span>{isTa ? 'பதிவிறக்கம்' : 'Download'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
