import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Link2,
  ArrowRight,
  Sparkles,
  Smartphone,
  MessageCircle,
  MapPin
} from 'lucide-react';
import { InstagramIcon } from '../icons/InstagramIcon';
import { QRCodeItem, BusinessSettings } from '../../types';
import { db } from '../../services/db';

interface DestinationChangerProps {
  qrCode: QRCodeItem;
  settings?: BusinessSettings;
  onUpdated: (updatedQR: QRCodeItem) => void;
}

export const DestinationChanger: React.FC<DestinationChangerProps> = ({
  qrCode,
  settings,
  onUpdated,
}) => {
  const [destinationInput, setDestinationInput] = useState(qrCode.destination_url);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate URL format
  const validateUrl = (url: string): boolean => {
    const trimmed = url.trim();
    if (!trimmed) return false;
    // Allow internal routes like /tamil-designer-studio or valid http/https URLs
    if (trimmed.startsWith('/')) return true;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const trimmed = destinationInput.trim();
    if (!validateUrl(trimmed)) {
      setError('Please enter a valid URL starting with https://, http://, or /');
      return;
    }

    try {
      setSaving(true);
      const updated = await db.updateQRDestination(qrCode.id, trimmed);
      onUpdated(updated);
      setIsEditing(false);
      setSuccessMessage(true);

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#C59B27', '#2D1E18', '#FAF7F2'],
        });
      } catch {
        // Safe fallback
      }

      // Hide success message after 6 seconds
      setTimeout(() => {
        setSuccessMessage(false);
      }, 6000);
    } catch (err) {
      console.error(err);
      setError('Failed to update destination. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePresetSelect = (presetUrl: string) => {
    setDestinationInput(presetUrl);
    setIsEditing(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-beige-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif font-bold text-studio-900">
              Change Destination Target
            </h3>
            <span className="text-[11px] bg-gold-100 text-gold-800 font-semibold px-2 py-0.5 rounded-full">
              Instant Sync
            </span>
          </div>
          <p className="text-xs text-studio-500 mt-0.5">
            Modify where people are redirected upon scanning your permanent QR code.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setDestinationInput(qrCode.destination_url);
              setIsEditing(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 bg-studio-800 hover:bg-studio-900 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-subtle"
          >
            <span>Change Destination</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
          </button>
        )}
      </div>

      {/* Success Notification Banner requested by user */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 transition-all animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-semibold text-emerald-800">
                ✓ Destination updated successfully.
              </p>
              <p className="text-emerald-700 font-medium">
                ✓ Existing QR code remains unchanged.
              </p>
              <p className="text-[11px] text-emerald-600/80 pt-0.5">
                All currently printed visiting cards will immediately route visitors to the new target.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Destination Display or Edit Mode */}
      {!isEditing ? (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-studio-600">
            Current Destination URL
          </div>
          <div className="flex items-center gap-3 bg-cream-50/80 border border-beige-200 p-3.5 rounded-xl">
            <Link2 className="w-4 h-4 text-gold-600 shrink-0" />
            <span className="font-mono text-sm text-studio-900 break-all select-all font-medium">
              {qrCode.destination_url}
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="destinationInput"
              className="block text-xs font-semibold uppercase tracking-wider text-studio-700"
            >
              New Destination Target (URL)
            </label>
            <div className="relative">
              <input
                id="destinationInput"
                type="text"
                value={destinationInput}
                onChange={(e) => {
                  setDestinationInput(e.target.value);
                  setError(null);
                }}
                placeholder="https://example.com/your-new-page"
                className={`w-full px-4 py-2.5 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-beige-300 focus:ring-gold-400 focus:border-gold-500'
                } bg-white text-studio-900`}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Quick Presets for Tamil Designer Studio */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-studio-500">
              Quick Studio Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePresetSelect('/tamil-designer-studio')}
                className="inline-flex items-center gap-1.5 text-xs bg-beige-100 hover:bg-beige-200 text-studio-800 px-3 py-1.5 rounded-lg border border-beige-300/80 transition-colors font-medium"
              >
                <Smartphone className="w-3 h-3 text-gold-600" />
                Digital Visiting Card Page
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePresetSelect(
                    settings?.whatsapp_url ||
                      'https://wa.me/917845264168?text=Hello%20Tamil%20Designer%20Studio'
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors font-medium"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                Direct WhatsApp
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePresetSelect(
                    settings?.instagram_url || 'https://instagram.com/tamil_designer_studio'
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs bg-rose-50 hover:bg-rose-100 text-rose-800 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors font-medium"
              >
                <InstagramIcon className="w-3 h-3 text-rose-600" />
                Instagram Page
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePresetSelect(
                    settings?.maps_url ||
                      'https://maps.google.com/?q=1/208C,+Jeeva+Street,+Chinniyampalayam,+Coimbatore+641062'
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors font-medium"
              >
                <MapPin className="w-3 h-3 text-blue-600" />
                Google Maps Location
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-studio-800 hover:bg-studio-900 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-subtle disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-gold-400" />
                  <span>Save New Destination</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setDestinationInput(qrCode.destination_url);
                setIsEditing(false);
                setError(null);
              }}
              className="text-xs sm:text-sm font-medium text-studio-600 hover:text-studio-900 px-4 py-2.5 rounded-xl hover:bg-beige-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
