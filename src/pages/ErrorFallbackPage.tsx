import React, { useEffect, useState } from 'react';
import { Phone, MessageCircle, Home, AlertTriangle, Sparkles } from 'lucide-react';
import { db } from '../services/db';
import { BusinessSettings } from '../types';

export const ErrorFallbackPage: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    db.getBusinessSettings().then(setSettings);
  }, []);

  const phone = settings?.phone || '78452 64168';
  const whatsappUrl =
    settings?.whatsapp_url ||
    'https://wa.me/917845264168?text=Hello%20Tamil%20Designer%20Studio';

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-between items-center p-6 text-studio-900 selection:bg-gold-500/20">
      {/* Top Header */}
      <header className="w-full max-w-md pt-8 text-center">
        <img
          src="/logo.png"
          alt="Tamil Designer Studio Logo"
          className="w-44 h-auto object-contain mx-auto mb-2"
        />
        <h1 className="text-xl font-serif font-bold text-studio-900 tracking-tight">
          {settings?.business_name || 'Tamil Designer Studio'}
        </h1>
        <p className="text-xs text-studio-500 font-sans uppercase tracking-widest mt-1">
          {settings?.subtitle || 'School of Fashion Design & Tailoring'}
        </p>
      </header>

      {/* Main Alert Card */}
      <main className="w-full max-w-md bg-white rounded-3xl border border-beige-200 shadow-premium p-8 text-center my-8 space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-studio-900">
            Link Currently Unavailable
          </h2>
          <p className="text-sm text-studio-600 leading-relaxed">
            Sorry, this QR link is currently paused or undergoing maintenance. Please connect with us directly below:
          </p>
        </div>

        {/* Action Buttons as requested */}
        <div className="space-y-3 pt-2">
          <a
            href={`tel:+${settings?.phone_raw || '917845264168'}`}
            className="w-full flex items-center justify-center gap-3 bg-studio-800 hover:bg-studio-900 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all shadow-subtle text-sm"
          >
            <Phone className="w-4 h-4 text-gold-400" />
            <span>Call Us: {phone}</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all shadow-subtle text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href="/tamil-designer-studio"
            className="w-full flex items-center justify-center gap-2 bg-cream-50 hover:bg-beige-100 text-studio-800 border border-beige-300 font-semibold py-3 px-6 rounded-2xl transition-colors text-sm"
          >
            <Home className="w-4 h-4 text-gold-600" />
            <span>Visit Digital Studio Card</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-studio-400 pb-6">
        <p className="font-serif italic text-gold-600/90 text-sm">
          "{settings?.tagline || 'Wear Dreams, Not Just Clothes.'}"
        </p>
        <p className="text-[11px] mt-1 text-studio-400">
          Coimbatore, Tamil Nadu
        </p>
      </footer>
    </div>
  );
};
