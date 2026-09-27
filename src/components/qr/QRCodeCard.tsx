import React, { useEffect, useState } from 'react';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileCode2,
  Sparkles,
  QrCode as QrIcon
} from 'lucide-react';
import {
  getPermanentQRUrl,
  generateQRPNGDataUrl,
  generateQRSVGString,
  triggerDownload
} from '../../utils/qrGenerator';

interface QRCodeCardProps {
  slug: string;
  name: string;
  destinationUrl: string;
  isActive: boolean;
  onDestinationChange?: (newUrl: string) => void;
  showCardMockup?: boolean;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  slug,
  name,
  destinationUrl,
  isActive,
  showCardMockup = false,
}) => {
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const permanentUrl = getPermanentQRUrl(slug);

  // Generate QR code based strictly on the PERMANENT URL
  useEffect(() => {
    let isMounted = true;
    async function renderQR() {
      try {
        setLoading(true);
        const [png, svg] = await Promise.all([
          generateQRPNGDataUrl(permanentUrl, { width: 1024, margin: 3 }),
          generateQRSVGString(permanentUrl, { margin: 3 }),
        ]);
        if (isMounted) {
          setPngDataUrl(png);
          setSvgString(svg);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error rendering QR:', err);
        if (isMounted) setLoading(false);
      }
    }

    renderQR();
    return () => {
      isMounted = false;
    };
  }, [permanentUrl]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(permanentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPNG = () => {
    if (!pngDataUrl) return;
    const filename = `${slug}-qr-print-ready.png`;
    triggerDownload(pngDataUrl, filename, true);
  };

  const handleDownloadSVG = () => {
    if (!svgString) return;
    const filename = `${slug}-qr-vector.svg`;
    triggerDownload(svgString, filename, false);
  };

  return (
    <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center">
      {/* QR Code Frame / Visiting Card Mockup */}
      <div className="w-full md:w-auto flex flex-col items-center">
        <div
          className={`relative p-5 rounded-2xl bg-white border ${
            isActive ? 'border-gold-300/80 shadow-gold' : 'border-gray-300 opacity-60'
          } flex flex-col items-center justify-center transition-all duration-300`}
        >
          {/* Studio Logo Header on QR card */}
          <div className="flex items-center gap-2 mb-2.5">
            <img src="/logo.png" alt="Tamil Designer Studio Logo" className="h-7 w-auto object-contain" />
            <span className="text-[10px] font-serif font-bold tracking-wider uppercase text-studio-800">
              Tamil Designer Studio
            </span>
          </div>

          {/* QR Canvas / Image */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 bg-white flex items-center justify-center rounded-xl p-2 border border-beige-100">
            {loading ? (
              <div className="flex flex-col items-center gap-2 text-studio-400">
                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Generating High-Res QR...</span>
              </div>
            ) : pngDataUrl ? (
              <img
                src={pngDataUrl}
                alt={`QR code for ${permanentUrl}`}
                className="w-full h-full object-contain select-none"
              />
            ) : (
              <span className="text-xs text-red-500">Failed to generate QR</span>
            )}
          </div>

          <p className="mt-3 text-center text-xs font-medium text-studio-600 tracking-wide">
            Scan to connect with Tamil Designer Studio
          </p>

          {!isActive && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 text-center">
              <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-medium mb-1">
                Inactive
              </span>
              <p className="text-xs text-studio-600">
                This QR is currently disabled and won't redirect visitors.
              </p>
            </div>
          )}
        </div>

        {/* Print Quality Badge */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-studio-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Level H Error Correction (30% Recovery)</span>
        </div>
      </div>

      {/* Details & Actions */}
      <div className="flex-1 w-full flex flex-col justify-between space-y-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <h3 className="text-xl font-serif font-bold text-studio-900">{name}</h3>
            <span
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {isActive ? 'Active & Redirecting' : 'Paused / Inactive'}
            </span>
          </div>
          <p className="text-sm text-studio-500">
            Permanently printed on visiting cards. Even if your destination URL changes 100 times,
            this physical QR code remains 100% functional.
          </p>
        </div>

        {/* Permanent URL Box */}
        <div className="bg-cream-50 p-4 rounded-xl border border-beige-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-studio-700 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <QrIcon className="w-3.5 h-3.5 text-gold-600" />
              Permanent QR URL (Printed on Card)
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
              Never Changes
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-beige-200">
            <code className="text-xs sm:text-sm font-mono text-studio-900 truncate flex-1 font-medium">
              {permanentUrl}
            </code>
            <button
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1 text-xs font-medium text-studio-700 hover:text-gold-700 bg-beige-100 hover:bg-beige-200 px-2.5 py-1.5 rounded-md transition-colors shrink-0"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current Destination Display */}
        <div className="bg-cream-50/70 p-4 rounded-xl border border-beige-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-studio-700 uppercase tracking-wider">
            <span>Current Live Destination</span>
            <span className="text-[10px] text-gold-700 bg-gold-100 px-2 py-0.5 rounded">
              Dynamic Target
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="truncate font-mono text-xs sm:text-sm text-studio-800">
              {destinationUrl}
            </div>
            <a
              href={permanentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-gold-700 hover:text-gold-800 shrink-0"
            >
              Test Scan
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Download & Action Buttons */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            onClick={handleDownloadPNG}
            disabled={loading || !pngDataUrl}
            className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 bg-studio-800 hover:bg-studio-900 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-subtle hover:shadow"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            disabled={loading || !svgString}
            className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 bg-white hover:bg-beige-50 text-studio-800 border border-beige-300 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all"
          >
            <FileCode2 className="w-4 h-4 text-studio-600" />
            <span>Download SVG</span>
          </button>

          <a
            href={permanentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-gold-50 hover:bg-gold-100 text-gold-800 border border-gold-300 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all"
          >
            <ExternalLink className="w-4 h-4 text-gold-600" />
            <span>Open Link</span>
          </a>
        </div>
      </div>
    </div>
  );
};
