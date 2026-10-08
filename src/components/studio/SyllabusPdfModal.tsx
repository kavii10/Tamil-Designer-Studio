import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Share2,
  Maximize2,
} from 'lucide-react';
import { CourseStageSyllabus } from '../../types';
import { generateStageSyllabusPdf, downloadPdf } from '../../utils/pdfGenerator';
import { Lang } from '../../i18n/translations';

interface SyllabusPdfModalProps {
  stage: CourseStageSyllabus | null;
  whatsappUrl: string;
  isDark?: boolean;
  lang?: Lang;
  onClose: () => void;
}

export const SyllabusPdfModal: React.FC<SyllabusPdfModalProps> = ({
  stage,
  whatsappUrl,
  isDark = false,
  lang = 'en',
  onClose,
}) => {
  const [activePdfUrl, setActivePdfUrl] = useState<string>('');
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!stage) {
      setActivePdfUrl('');
      return;
    }

    let objectUrlToRevoke: string | null = null;

    if (stage.pdf_url) {
      setActivePdfUrl(stage.pdf_url);
    } else {
      // Generate the official branded PDF on the fly
      const blob = generateStageSyllabusPdf(stage);
      const url = URL.createObjectURL(blob);
      objectUrlToRevoke = url;
      setActivePdfUrl(url);
    }

    // Disable background body scroll while fullscreen modal is active
    document.body.style.overflow = 'hidden';

    // Handle Escape key to close fullscreen
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [stage, onClose]);

  if (!stage) return null;

  const defaultFilename = `Tamil_Designer_Studio_${stage.id}_Course_Syllabus.pdf`;
  const filename = stage.pdf_name || defaultFilename;

  const handleDownload = () => {
    if (activePdfUrl) {
      downloadPdf(activePdfUrl, filename);
    } else {
      const blob = generateStageSyllabusPdf(stage);
      downloadPdf(blob, filename);
    }
  };

  const handleOpenInNewTab = () => {
    if (activePdfUrl) {
      window.open(activePdfUrl, '_blank');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${stage.title} Syllabus - Tamil Designer Studio`,
          text: `Check out the syllabus for ${stage.title} at Tamil Designer Studio Coimbatore!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } catch {
      // Ignore user cancellation
    }
  };

  const isTa = lang === 'ta';
  const displayTitle = (isTa && stage.title_ta) ? stage.title_ta : stage.title;
  const displayBadge = (isTa && stage.badge_ta) ? stage.badge_ta : stage.badge;

  const stageWhatsappLink = `${whatsappUrl}&text=${encodeURIComponent(
    isTa
      ? `வணக்கம் தமிழ் டிசைனர் ஸ்டூடியோ, நான் ${displayTitle} பாடத்திட்டத்தை பார்த்தேன். அடுத்த பேட்ச், கட்டணம் மற்றும் வகுப்புகள் நேரம் பற்றி அறிய விரும்புகிறேன்.`
      : `Hello Tamil Designer Studio, I reviewed the ${stage.title} syllabus and would like to inquire about the next batch, admission fees, and class timings.`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen bg-[#0E0C15] flex flex-col overflow-hidden animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
    >
      {/* ── Top Fullscreen Header Navigation Bar ── */}
      <header className="h-16 bg-[#161320] border-b border-[#2C273C] px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-lg z-20 text-white">
        {/* Left: Studio Branding & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#D9A73A] to-[#E8BE56] text-[#160E07] flex items-center justify-center shadow-md shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40">
                {displayBadge}
              </span>
              <span className="text-[10px] text-studio-400 hidden md:inline">
                {isTa ? '• முழுத்திரை PDF பார்வை' : '• Fullscreen PDF View'}
              </span>
            </div>
            <h2 className="font-serif font-bold text-sm sm:text-base truncate leading-tight text-white mt-0.5">
              {displayTitle}
            </h2>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Share Button (Desktop & Mobile) */}
          <button
            onClick={handleShare}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#3C384D] bg-[#221F2F] text-xs font-semibold text-[#DDD8E8] hover:text-white hover:bg-[#2C283B] transition-colors"
            title="Share Syllabus Link"
          >
            {copiedShare ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-gold-400" />
            )}
            <span>{copiedShare ? (isTa ? 'நகலெடுக்கப்பட்டது' : 'Copied') : (isTa ? 'பகிர்' : 'Share')}</span>
          </button>

          {/* Open In Native New Tab */}
          <button
            onClick={handleOpenInNewTab}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#3C384D] bg-[#221F2F] text-xs font-semibold text-[#DDD8E8] hover:text-white hover:bg-[#2C283B] transition-colors"
            title="Open in Browser Native Viewer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
            <span>{isTa ? 'தாவலில் திற' : 'Open in Tab'}</span>
          </button>

          {/* WhatsApp Inquiry Button */}
          <a
            href={stageWhatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>{isTa ? 'WhatsApp-ல் விசாரிக்க' : 'Inquire on WhatsApp'}</span>
          </a>

          {/* Download PDF Button */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#D9A73A] via-[#E8BE56] to-[#C9962A] text-[#160E07] text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
            title="Download Syllabus PDF"
          >
            <Download className="w-4 h-4" />
            <span className="hidden xs:inline">{isTa ? 'PDF பதிவிறக்கம்' : 'Download PDF'}</span>
          </button>

          {/* Close Fullscreen Button */}
          <button
            onClick={onClose}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#282436] hover:bg-[#38334C] text-[#C5BFD6] hover:text-white border border-[#3D3750] transition-colors flex items-center gap-1.5 text-xs font-bold"
            aria-label="Close Fullscreen View"
            title="Close Fullscreen (Esc)"
          >
            <X className="w-4 h-4 text-gold-400" />
            <span className="hidden sm:inline">{isTa ? 'மூடு' : 'Close'}</span>
          </button>
        </div>
      </header>

      {/* ── Main Fullscreen PDF Canvas (100% Height & Width) ── */}
      <main className="flex-1 w-full h-[calc(100vh-4rem)] relative bg-[#1B1924] flex flex-col overflow-hidden">
        {activePdfUrl ? (
          <iframe
            src={`${activePdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            title={`${stage.title} - Fullscreen Syllabus PDF`}
            className="w-full h-full border-0 bg-white"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 text-white">
            <FileText className="w-14 h-14 text-gold-400 animate-pulse" />
            <p className="text-sm font-semibold text-gold-200">
              Loading official syllabus in fullscreen PDF mode...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
