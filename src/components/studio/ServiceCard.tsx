import React from 'react';
import { Scissors, Wrench, Sparkles, Heart, Shirt, CheckCircle } from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServiceCardProps {
  service: ServiceItem;
  isDark?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, isDark = false }) => {
  const getIcon = (name: string) => {
    const iconColor = isDark ? 'text-[#E8BE56]' : 'text-[#B8861B]';
    switch (name) {
      case 'Scissors':
        return <Scissors className={`w-5 h-5 ${iconColor}`} />;
      case 'Wrench':
        return <Wrench className={`w-5 h-5 ${iconColor}`} />;
      case 'Heart':
        return <Heart className={`w-5 h-5 ${iconColor}`} />;
      case 'Shirt':
        return <Shirt className={`w-5 h-5 ${iconColor}`} />;
      default:
        return <Sparkles className={`w-5 h-5 ${iconColor}`} />;
    }
  };

  return (
    <div
      className={`group rounded-2xl p-5 border shadow-sm transition-all duration-300 flex flex-col justify-between h-full ${
        isDark
          ? 'bg-gradient-to-b from-[#171622] to-[#12111A] border-[#2C293A] hover:border-[#D9A73A]/60'
          : 'bg-gradient-to-b from-white to-[#FDFBF7] border-[#E8DAC2] hover:border-[#D9B562] hover:shadow-[0_10px_25px_-5px_rgba(212,175,55,0.2)]'
      }`}
    >
      <div className="space-y-3">
        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-all shadow-sm ${
            isDark
              ? 'bg-gradient-to-br from-[#252233] to-[#1A1824] border-[#3C384D]'
              : 'bg-gradient-to-br from-[#FAF5EB] to-[#F3E7D3] border-[#E0D0B6] group-hover:bg-[#FAF0DC]'
          }`}
        >
          {getIcon(service.icon_name)}
        </div>
        <div>
          <h4
            className={`font-serif font-bold text-base transition-colors ${
              isDark
                ? 'text-[#FAF6EE] group-hover:text-[#E8BE56]'
                : 'text-[#2A170E] group-hover:text-[#B8861B]'
            }`}
          >
            {service.title}
          </h4>
          <p
            className={`text-xs leading-relaxed mt-1.5 ${
              isDark ? 'text-[#A7A2B8]' : 'text-[#6B5344]'
            }`}
          >
            {service.description}
          </p>
        </div>
      </div>

      <div
        className={`mt-4 pt-3 border-t flex items-center gap-1.5 text-[11px] font-semibold ${
          isDark
            ? 'border-[#252332] text-[#E8BE56]'
            : 'border-[#F2E7D5] text-[#A67817]'
        }`}
      >
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Bespoke &amp; Tailor Made</span>
      </div>
    </div>
  );
};
