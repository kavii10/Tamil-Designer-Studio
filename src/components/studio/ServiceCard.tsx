import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { ServiceItem } from '../../types';
import { Lang } from '../../i18n/translations';

interface ServiceCardProps {
  service: ServiceItem;
  isDark?: boolean;
  lang?: Lang;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, isDark = false, lang = 'en' }) => {
  const [imgError, setImgError] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  const isTa = lang === 'ta';
  const displayTitle = (isTa && service.title_ta) ? service.title_ta : service.title;
  const displayDescription = (isTa && service.description_ta) ? service.description_ta : service.description;
  const rawItems = (isTa && service.items_ta && service.items_ta.length > 0) ? service.items_ta : service.items || [];

  const hasImage = service.image_url && !imgError;
  const items = rawItems;
  const visibleItems = showAllItems ? items : items.slice(0, 4);

  return (
      <div
        className={`group rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 flex flex-col h-full ${
          isDark
            ? 'bg-gradient-to-b from-[#171622] to-[#12111A] border-[#2C293A] hover:border-[#D9A73A]/60'
            : 'bg-gradient-to-b from-white to-[#FDFBF7] border-[#E8DAC2] hover:border-[#D9B562] hover:shadow-[0_12px_28px_-6px_rgba(212,175,55,0.22)]'
        }`}
      >
        {/* ── Service Image Frame (Taller & Clearer) ── */}
        <div className={`relative w-full h-64 sm:h-72 md:h-80 overflow-hidden ${isDark ? 'bg-[#1A1824]' : 'bg-[#F3EAD8]'}`}>
          {hasImage ? (
            <img
              src={service.image_url}
              alt={displayTitle}
              className="w-full h-full object-cover object-top"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
              <ImageIcon className={`w-8 h-8 ${isDark ? 'text-[#48445C]' : 'text-[#D9C8AD]'}`} />
              <span className={`text-xs font-medium ${isDark ? 'text-[#68637F]' : 'text-[#A89880]'}`}>
                {displayTitle}
              </span>
            </div>
          )}

          {/* Subtle gradient overlay at bottom of image */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-10 pointer-events-none ${
              isDark
                ? 'bg-gradient-to-t from-[#171622] to-transparent'
                : 'bg-gradient-to-t from-white to-transparent'
            }`}
          />
        </div>

        {/* ── Card Body ── */}
        <div className="flex flex-col flex-1 p-5 space-y-3.5">
          {/* Title */}
          <h4
            className={`font-serif font-bold text-base sm:text-lg leading-relaxed sm:leading-loose tracking-normal [word-spacing:0.14em] transition-colors ${
              isDark
                ? 'text-[#FAF6EE] group-hover:text-[#E8BE56]'
                : 'text-[#2A170E] group-hover:text-[#B8861B]'
            }`}
          >
            {displayTitle}
          </h4>

          {/* Description */}
          {displayDescription && (
            <p className={`text-xs sm:text-[13px] leading-relaxed sm:leading-loose [word-spacing:0.12em] ${isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'}`}>
              {displayDescription}
            </p>
          )}

          {/* Items list */}
          {items.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div
                className={`text-xs font-bold uppercase tracking-wide [word-spacing:0.1em] ${
                  isDark ? 'text-[#8E899E]' : 'text-[#9B7120]'
                }`}
              >
                {isTa ? 'சேர்க்கப்பட்டுள்ள வகைகள்' : 'Included Variations'}
              </div>
              <ul className="space-y-2 sm:space-y-2.5">
                {visibleItems.map((item) => (
                  <li
                    key={item}
                    className={`flex items-start gap-2 text-xs sm:text-[13px] font-medium leading-relaxed sm:leading-loose [word-spacing:0.12em] ${
                      isDark ? 'text-[#C5BFD5]' : 'text-[#4E3622]'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'
                      }`}
                    />
                    <span className="leading-relaxed sm:leading-loose">{item}</span>
                  </li>
                ))}
              </ul>

              {items.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllItems((p) => !p)}
                  className={`flex items-center gap-1 text-xs font-semibold mt-1 transition-colors ${
                    isDark ? 'text-[#E8BE56] hover:underline' : 'text-[#9B6E18] hover:underline'
                  }`}
                >
                  {showAllItems ? (
                    <>
                      {isTa ? 'குறைவாகக் காட்டு' : 'Show Less'} <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      +{items.length - 4} {isTa ? 'மேலும்' : 'More'} <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Footer badge */}
          <div
            className={`mt-auto pt-3.5 border-t flex items-center gap-1.5 text-[11px] font-semibold ${
              isDark ? 'border-[#252332] text-[#E8BE56]' : 'border-[#F2E7D5] text-[#A67817]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{isTa ? 'தையல் · அனைத்து அளவுகளிலும்' : 'Bespoke & Tailor Made · All Sizes'}</span>
          </div>
        </div>
      </div>

  );
};
