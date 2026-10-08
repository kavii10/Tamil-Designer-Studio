import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  Store,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  MessageCircle,
  Globe
} from 'lucide-react';
import { InstagramIcon } from '../../components/icons/InstagramIcon';
import { BusinessSettings } from '../../types';
import { db } from '../../services/db';
import { Lang } from '../../i18n/translations';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return fallback;
};

interface AdminBusinessProfileProps {
  editLang?: Lang;
  onLangChange?: (lang: Lang) => void;
}

export const AdminBusinessProfile: React.FC<AdminBusinessProfileProps> = ({
  editLang = 'en',
  onLangChange,
}) => {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [pendingSettings, setPendingSettings] = useState<BusinessSettings | null>(null);

  const isTa = editLang === 'ta';

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const data = await db.getBusinessSettings();
        setSettings(data);
        setPendingSettings(db.getPendingBusinessSettings());
      } catch (err) {
        console.error(err);
        setLoadError(getErrorMessage(err, 'Could not load business settings.'));
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (field: keyof BusinessSettings, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setSaveError('');
      const updated = await db.updateBusinessSettings(settings);
      setSettings(updated);
      setPendingSettings(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setSaveError(getErrorMessage(err, 'Could not save business settings.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-studio-500 text-xs">Loading profile settings...</div>;
  }

  if (!settings) {
    return <div role="alert" className="p-4 text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">{loadError || 'Business settings are unavailable.'}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-studio-900 tracking-tight">
            Business Profile & Digital Visiting Card
          </h1>
          <p className="text-xs sm:text-sm text-studio-500 mt-1">
            Customize contact details, timings, and social links displayed across your public digital card.
          </p>
        </div>

        <a
          href="/tamil-designer-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-beige-100 text-studio-800 border border-beige-300 px-3.5 py-2 rounded-xl transition-colors font-medium shadow-subtle"
        >
          <span>Preview Public Page</span>
          <ExternalLink className="w-3.5 h-3.5 text-gold-600" />
        </a>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm rounded-2xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            {db.isCloudEnabled()
              ? 'Business profile saved to the shared database.'
              : 'Business profile saved on this device only. Connect Supabase to sync across devices.'}
          </span>
        </div>
      )}
      {saveError && (
        <div role="alert" className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm rounded-xl">
          Business profile was not saved: {saveError}
        </div>
      )}
      {pendingSettings && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>Unsynced profile edits from this device were recovered.</span>
          <button
            type="button"
            onClick={() => setSettings(pendingSettings)}
            className="shrink-0 font-semibold underline underline-offset-2"
          >
            Restore recovered edits
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Studio Branding */}
        <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 border-b border-beige-100 pb-3">
            <Store className="w-4 h-4 text-gold-600" />
            <h3 className="font-serif font-bold text-studio-900 text-base">
              Core Identity & Branding
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                {isTa ? 'வணிகப் பெயர் (Business Name - Tamil)' : 'Business Name'}
              </label>
              <input
                type="text"
                value={isTa ? (settings.business_name_ta ?? '') : settings.business_name}
                onChange={(e) => handleChange(isTa ? 'business_name_ta' : 'business_name', e.target.value)}
                placeholder={isTa ? (settings.business_name || 'தமிழ் டிசைனர் ஸ்டூடியோ') : 'Tamil Designer Studio'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                required={!isTa}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                {isTa ? 'துணைத் தலைப்பு (Subtitle - Tamil)' : 'Subtitle'}
              </label>
              <input
                type="text"
                value={isTa ? (settings.subtitle_ta ?? '') : settings.subtitle}
                onChange={(e) => handleChange(isTa ? 'subtitle_ta' : 'subtitle', e.target.value)}
                placeholder={isTa ? (settings.subtitle || 'ஃபேஷன் டிசைன் & தையல் பள்ளி') : 'School of Fashion Design & Tailoring'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                required={!isTa}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                {isTa ? 'டேக்லைன் (Tagline - Tamil)' : 'Tagline'}
              </label>
              <input
                type="text"
                value={isTa ? (settings.tagline_ta ?? '') : settings.tagline}
                onChange={(e) => handleChange(isTa ? 'tagline_ta' : 'tagline', e.target.value)}
                placeholder={isTa ? (settings.tagline || 'கனவுகளை அணியுங்கள், வெறும் ஆடைகளை அல்ல.') : 'Wear Dreams, Not Just Clothes.'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                required={!isTa}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                {isTa ? 'மேற்கோள் (Studio Quote - Tamil)' : 'Studio Quote'}
              </label>
              <input
                type="text"
                value={isTa ? (settings.quote_ta ?? '') : settings.quote}
                onChange={(e) => handleChange(isTa ? 'quote_ta' : 'quote', e.target.value)}
                placeholder={isTa ? (settings.quote || 'துணி கற்பனையுடன் சந்திக்கும் இடம்') : 'Where Fabric Meets Imagination'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                required={!isTa}
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Channels */}
        <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 border-b border-beige-100 pb-3">
            <Phone className="w-4 h-4 text-gold-600" />
            <h3 className="font-serif font-bold text-studio-900 text-base">
              Phone & WhatsApp Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                Display Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="78452 64168"
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                Raw Phone with Country Code (For tel: & WhatsApp)
              </label>
              <input
                type="text"
                value={settings.phone_raw}
                onChange={(e) => handleChange('phone_raw', e.target.value)}
                placeholder="917845264168"
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono"
                required
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Direct Link (Pre-filled Message)
              </label>
              <input
                type="text"
                value={settings.whatsapp_url}
                onChange={(e) => handleChange('whatsapp_url', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Social & Maps Links */}
        <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 border-b border-beige-100 pb-3">
            <Globe className="w-4 h-4 text-gold-600" />
            <h3 className="font-serif font-bold text-studio-900 text-base">
              Social Media & Map Navigation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700 flex items-center gap-1">
                <InstagramIcon className="w-3.5 h-3.5 text-rose-600" />
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/tamil_designer_studio"
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Google Maps URL
              </label>
              <input
                type="text"
                value={settings.maps_url}
                onChange={(e) => handleChange('maps_url', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Physical Address & Timings */}
        <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 border-b border-beige-100 pb-3">
            <Clock className="w-4 h-4 text-gold-600" />
            <h3 className="font-serif font-bold text-studio-900 text-base">
              Location Details & Working Hours
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                {isTa ? 'முகவரி வரி 1 (Address Line 1 - Tamil)' : 'Address Line 1'}
              </label>
              <input
                type="text"
                value={isTa ? (settings.address_line1_ta ?? '') : settings.address_line1}
                onChange={(e) => handleChange(isTa ? 'address_line1_ta' : 'address_line1', e.target.value)}
                placeholder={isTa ? (settings.address_line1 || '1/208 C, ஜீவா தெரு') : '1/208C, Jeeva Street'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                required={!isTa}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                {isTa ? 'முகவரி வரி 2 (Area - Tamil)' : 'Address Line 2 (Area)'}
              </label>
              <input
                type="text"
                value={isTa ? (settings.address_line2_ta ?? '') : settings.address_line2}
                onChange={(e) => handleChange(isTa ? 'address_line2_ta' : 'address_line2', e.target.value)}
                placeholder={isTa ? (settings.address_line2 || 'சின்னியம்பாளையம்') : 'Chinniyampalayam'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                required={!isTa}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                {isTa ? 'நகரம் (City - Tamil)' : 'City'}
              </label>
              <input
                type="text"
                value={isTa ? (settings.address_city_ta ?? '') : settings.address_city}
                onChange={(e) => handleChange(isTa ? 'address_city_ta' : 'address_city', e.target.value)}
                placeholder={isTa ? (settings.address_city || 'கோயம்புத்தூர்') : 'Coimbatore'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                required={!isTa}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                Pincode
              </label>
              <input
                type="text"
                value={settings.address_pincode}
                onChange={(e) => handleChange('address_pincode', e.target.value)}
                placeholder="641062"
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-400"
                required
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                {isTa ? 'வகுப்பு & ஸ்டூடியோ நேரங்கள் (Timings - Tamil)' : 'Class & Studio Timings Description'}
              </label>
              <input
                type="text"
                value={isTa ? (settings.timings_weekdays_ta ?? '') : settings.timings_weekdays}
                onChange={(e) => handleChange(isTa ? 'timings_weekdays_ta' : 'timings_weekdays', e.target.value)}
                placeholder={isTa ? (settings.timings_weekdays || 'வேலைநாட்கள்: காலை 9:00 – மதியம் 1:00 & மதியம் 3:00 – இரவு 8:00') : 'Weekdays: 9:00 AM – 1:00 PM & 3:00 PM – 8:00 PM'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                required={!isTa}
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-studio-800 hover:bg-studio-900 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-subtle text-sm disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 text-gold-400" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
