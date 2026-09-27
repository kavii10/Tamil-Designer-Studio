import QRCode from 'qrcode';

export interface QRGenerationOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Builds the canonical, permanent QR redirect URL.
 * Example: https://yourdomain.com/qr/tamil-designer-studio
 */
export function getPermanentQRUrl(slug: string): string {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://tamildesignerstudio.com';

  const appUrl = (import.meta.env.VITE_APP_URL || origin).replace(/\/$/, '');
  return `${appUrl}/qr/${slug}`;
}

/**
 * Generates high-res PNG data URL (Error Correction Level H).
 */
export async function generateQRPNGDataUrl(
  text: string,
  options: QRGenerationOptions = {}
): Promise<string> {
  const { width = 1024, margin = 3, errorCorrectionLevel = 'H' } = options;

  return QRCode.toDataURL(text, {
    width,
    margin,
    errorCorrectionLevel,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}

/**
 * Generates vector SVG markup string (Error Correction Level H).
 */
export async function generateQRSVGString(
  text: string,
  options: QRGenerationOptions = {}
): Promise<string> {
  const { margin = 3, errorCorrectionLevel = 'H' } = options;

  return QRCode.toString(text, {
    type: 'svg',
    margin,
    errorCorrectionLevel,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}

/**
 * Trigger file download in browser
 */
export function triggerDownload(content: string, filename: string, isDataUrl = false) {
  const link = document.createElement('a');
  link.download = filename;

  if (isDataUrl) {
    link.href = content;
  } else {
    const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
    link.href = URL.createObjectURL(blob);
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (!isDataUrl) {
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }
}
