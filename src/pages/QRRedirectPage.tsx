import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { ErrorFallbackPage } from './ErrorFallbackPage';
import { PublicStudioPage } from './PublicStudioPage';
import { ArrowRight } from 'lucide-react';

interface QRRedirectPageProps {
  slug: string;
}

export const QRRedirectPage: React.FC<QRRedirectPageProps> = ({ slug }) => {
  const [status, setStatus] = useState<'loading' | 'show_website' | 'redirecting' | 'inactive' | 'not_found'>('loading');
  const [destination, setDestination] = useState<string>('');

  useEffect(() => {
    let isCancelled = false;

    async function handleRedirect() {
      try {
        const qr = await db.getQRCodeBySlug(slug);

        if (isCancelled) return;

        if (!qr) {
          setStatus('not_found');
          return;
        }

        if (!qr.is_active) {
          setStatus('inactive');
          return;
        }

        // Asynchronously log scan without blocking the visitor
        db.recordScan(qr.id).catch((e) => console.warn('Failed to record scan log:', e));

        const targetUrl = qr.destination_url.trim();
        setDestination(targetUrl);

        // Check if destination points to the studio website/visiting card
        const isInternalWebsite =
          targetUrl === '/tamil-designer-studio' ||
          targetUrl === '/' ||
          targetUrl === '' ||
          targetUrl.endsWith('/tamil-designer-studio') ||
          (typeof window !== 'undefined' && (
            targetUrl === window.location.origin ||
            targetUrl === `${window.location.origin}/` ||
            targetUrl === `${window.location.origin}/tamil-designer-studio`
          ));

        if (isInternalWebsite) {
          window.history.replaceState({}, '', '/tamil-designer-studio');
          setStatus('show_website');
          return;
        }

        // External destination (e.g. Instagram, WhatsApp, external landing page)
        setStatus('redirecting');

        let finalUrl = targetUrl;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('/')) {
          finalUrl = 'https://' + finalUrl;
        }

        window.location.replace(finalUrl);
      } catch (err) {
        console.error('Redirect error:', err);
        if (!isCancelled) setStatus('not_found');
      }
    }

    handleRedirect();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  // When the QR points to the studio website, show all details immediately!
  if (status === 'show_website') {
    return <PublicStudioPage />;
  }

  if (status === 'inactive' || status === 'not_found') {
    return <ErrorFallbackPage />;
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-6 text-studio-900 selection:bg-gold-500/20">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-beige-200 shadow-premium p-8 text-center flex flex-col items-center space-y-5">
        {/* Official Studio Logo */}
        <div className="w-44 h-auto mx-auto p-2 rounded-2xl bg-cream-50 border border-gold-300/40 shadow-sm">
          <img
            src="/logo.png"
            alt="Tamil Designer Studio Logo"
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-serif font-bold text-studio-900 tracking-tight">
            Tamil Designer Studio
          </h2>
          <p className="text-xs text-studio-500 font-sans tracking-wide">
            Connecting you to our studio...
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center gap-2 text-xs font-medium text-studio-700 bg-cream-50 px-4 py-2 rounded-full border border-beige-200">
          <div className="w-3.5 h-3.5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <span>Opening destination</span>
        </div>

        {destination && (
          <div className="text-[11px] text-studio-400 font-mono truncate max-w-xs px-2">
            Target: {destination}
          </div>
        )}

        <div className="pt-2 border-t border-beige-100 w-full text-center">
          <a
            href={destination || '/tamil-designer-studio'}
            className="inline-flex items-center gap-1.5 text-xs text-gold-700 hover:text-gold-800 font-medium"
          >
            <span>Click here if not redirected automatically</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
