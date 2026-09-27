import React, { useEffect, useState } from 'react';
import { Sparkles, Phone, MapPin, Compass, QrCode } from 'lucide-react';
import { generateQRPNGDataUrl, getPermanentQRUrl } from '../../utils/qrGenerator';

interface VisitingCardMockupProps {
  slug: string;
  businessName: string;
  subtitle: string;
  tagline: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
}

export const VisitingCardMockup: React.FC<VisitingCardMockupProps> = ({
  slug,
  businessName,
  subtitle,
  tagline,
  phone,
  addressLine1,
  addressLine2,
  city,
  pincode,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const permanentUrl = getPermanentQRUrl(slug);

  useEffect(() => {
    generateQRPNGDataUrl(permanentUrl, { width: 512, margin: 2 }).then(setQrDataUrl);
  }, [permanentUrl]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-serif font-bold text-studio-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-gold-500" />
          Physical Visiting Card Print Simulation
        </h4>
        <span className="text-[11px] font-medium text-studio-500 bg-cream-200 px-2 py-0.5 rounded">
          Standard 3.5" × 2" Ratio
        </span>
      </div>

      <div className="relative w-full max-w-md mx-auto aspect-[1.75/1] rounded-2xl p-6 bg-gradient-to-br from-[#2D1E18] via-[#241712] to-[#1A100C] text-cream-100 shadow-2xl border border-gold-600/30 overflow-hidden flex flex-col justify-between">
        {/* Subtle gold foil border ornament */}
        <div className="absolute inset-1.5 rounded-xl border border-gold-400/20 pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-gold-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase tracking-widest font-semibold">
                Haute Couture & Academy
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-cream-50 mt-0.5">
              {businessName}
            </h3>
            <p className="text-[10px] text-gold-300/80 font-sans tracking-wide">
              {subtitle}
            </p>
          </div>

          {/* Official Logo on Visiting Card */}
          <div className="shrink-0 bg-cream-100/95 rounded-xl p-1 border border-gold-400/50 shadow-md">
            <img
              src="/logo.png"
              alt="Tamil Designer Studio Logo"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </div>
        </div>

        {/* Card Body: Contact & Permanent QR Code */}
        <div className="relative z-10 flex items-end justify-between gap-4 mt-2">
          {/* Contact Details */}
          <div className="space-y-1.5 text-[10px] text-cream-200/90 leading-tight">
            <p className="text-gold-200 italic font-serif text-[11px] mb-1">
              "{tagline}"
            </p>
            <div className="flex items-center gap-1.5">
              <Phone className="w-2.5 h-2.5 text-gold-400 shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin className="w-2.5 h-2.5 text-gold-400 shrink-0 mt-0.5" />
              <span>
                {addressLine1}, {addressLine2}, {city} – {pincode}
              </span>
            </div>
          </div>

          {/* Embedded Permanent QR Box */}
          <div className="bg-white p-1.5 rounded-lg border border-gold-300/60 shadow-lg flex flex-col items-center shrink-0">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Printed QR"
                className="w-16 h-16 sm:w-18 sm:h-18 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-white animate-pulse" />
            )}
            <span className="text-[7px] text-studio-800 font-bold uppercase tracking-tight mt-0.5">
              Scan For Studio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
