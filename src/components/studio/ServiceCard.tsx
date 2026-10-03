import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServiceCardProps {
  service: ServiceItem;
  isDark?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, isDark = false }) => {
  const [imgError, setImgError] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  const hasImage = service.image_url && !imgError;
  const items = service.items || [];
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
              alt={service.title}
              className="w-full h-full object-cover object-top"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
              <ImageIcon className={`w-8 h-8 ${isDark ? 'text-[#48445C]' : 'text-[#D9C8AD]'}`} />
              <span className={`text-xs font-medium ${isDark ? 'text-[#68637F]' : 'text-[#A89880]'}`}>
                {service.title}
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
            className={`font-serif font-bold text-base leading-snug transition-colors ${
              isDark
                ? 'text-[#FAF6EE] group-hover:text-[#E8BE56]'
                : 'text-[#2A170E] group-hover:text-[#B8861B]'
            }`}
          >
            {service.title}
          </h4>

          {/* Description */}
          <p className={`text-xs leading-relaxed ${isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'}`}>
            {service.description}
          </p>

          {/* Items list */}
          {items.length > 0 && (
            <div className="space-y-2 pt-1">
              <div
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-[#8E899E]' : 'text-[#9B7120]'
                }`}
              >
                Included Variations
              </div>
              <ul className="space-y-1.5">
                {visibleItems.map((item) => (
                  <li
                    key={item}
                    className={`flex items-center gap-2 text-xs font-medium ${
                      isDark ? 'text-[#C5BFD5]' : 'text-[#4E3622]'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]'
                      }`}
                    />
                    <span>{item}</span>
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
                      Show Less <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      +{items.length - 4} More <ChevronDown className="w-3.5 h-3.5" />
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
            <span>Bespoke &amp; Tailor Made · All Sizes</span>
          </div>
        </div>
      </div>

  );
};
