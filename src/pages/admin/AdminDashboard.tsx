import React, { useEffect, useState } from 'react';
import {
  QrCode,
  TrendingUp,
  Clock,
  Eye,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { QRCodeItem, BusinessSettings, AnalyticsSummary } from '../../types';
import { db } from '../../services/db';
import { QRCodeCard } from '../../components/qr/QRCodeCard';
import { DestinationChanger } from '../../components/admin/DestinationChanger';
import { VisitingCardMockup } from '../../components/qr/VisitingCardMockup';

interface AdminDashboardProps {
  onNavigateToTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToTab }) => {
  const [qrs, setQrs] = useState<QRCodeItem[]>([]);
  const [activeQR, setActiveQR] = useState<QRCodeItem | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allQRs, loadedSettings, loadedAnalytics] = await Promise.all([
        db.getAllQRCodes(),
        db.getBusinessSettings(),
        db.getAnalytics(),
      ]);

      setQrs(allQRs);
      // Pick first active QR (e.g. visiting card QR)
      const primary = allQRs.find((q) => q.slug === 'tamil-designer-studio') || allQRs[0];
      setActiveQR(primary || null);
      setSettings(loadedSettings);
      setAnalytics(loadedAnalytics);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQRUpdated = (updated: QRCodeItem) => {
    setActiveQR(updated);
    setQrs((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  };

  if (loading || !activeQR || !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-3 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-studio-600 font-medium">Loading studio dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-studio-900 tracking-tight">
              Dynamic QR Console
            </h1>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Operational
            </span>
          </div>
          <p className="text-xs sm:text-sm text-studio-500 mt-1">
            Permanent physical QR routing system for {settings.business_name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-beige-100 text-studio-700 border border-beige-300 px-3 py-2 rounded-xl transition-colors font-medium shadow-subtle"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <a
            href="/tamil-designer-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs bg-studio-800 hover:bg-studio-900 text-white px-3.5 py-2 rounded-xl transition-all shadow-subtle font-medium"
          >
            <span>Live Digital Card</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
          </a>
        </div>
      </div>

      {/* Metric Cards Requested by Specification */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="bg-white rounded-2xl p-5 border border-beige-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-studio-500">
              Total Scans
            </span>
            <div className="w-8 h-8 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-studio-900">
              {analytics?.total_scans || activeQR.scan_count || 0}
            </span>
            <p className="text-[11px] text-studio-400 mt-0.5">All-time QR redirects</p>
          </div>
        </div>

        {/* Today's Scans */}
        <div className="bg-white rounded-2xl p-5 border border-beige-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-studio-500">
              Today's Scans
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-studio-900">
              {analytics?.today_scans || 0}
            </span>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">Scanned today</p>
          </div>
        </div>

        {/* Current Destination */}
        <div className="bg-white rounded-2xl p-5 border border-beige-200 shadow-subtle flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-studio-500">
              Current Target
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-mono text-xs sm:text-sm font-semibold text-studio-900 truncate">
              {activeQR.destination_url}
            </p>
            <p className="text-[11px] text-studio-400 mt-0.5 truncate">
              Live dynamic redirect target
            </p>
          </div>
        </div>

        {/* QR Status */}
        <div className="bg-white rounded-2xl p-5 border border-beige-200 shadow-subtle flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-studio-500">
              QR Status
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeQR.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span
                className={`text-base font-bold ${
                  activeQR.is_active ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {activeQR.is_active ? 'Active & Healthy' : 'Disabled'}
              </span>
              <p className="text-[11px] text-studio-400 mt-0.5">Permanent URL live</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Destination Changer Component */}
      <DestinationChanger
        qrCode={activeQR}
        settings={settings}
        onUpdated={handleQRUpdated}
      />

      {/* Primary Permanent QR Code Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-studio-900">
            Active Visiting Card QR Code
          </h2>
          <span className="text-xs text-studio-500 font-mono">
            Slug: /{activeQR.slug}
          </span>
        </div>
        <QRCodeCard
          slug={activeQR.slug}
          name={activeQR.name}
          destinationUrl={activeQR.destination_url}
          isActive={activeQR.is_active}
        />
      </div>

      {/* Two Column Section: Physical Card Print Simulation & Scan Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Physical Visiting Card Print Preview */}
        <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 sm:p-7">
          <VisitingCardMockup
            slug={activeQR.slug}
            businessName={settings.business_name}
            subtitle={settings.subtitle}
            tagline={settings.tagline}
            phone={settings.phone}
            addressLine1={settings.address_line1}
            addressLine2={settings.address_line2}
            city={settings.address_city}
            pincode={settings.address_pincode}
          />
        </div>

        {/* Scan Activity Overview & Trends */}
        <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-beige-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-studio-900 text-lg">
                Weekly Scan Activity
              </h3>
              <p className="text-xs text-studio-500 mt-0.5">
                Daily scans recorded over the last 7 days
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('analytics')}
              className="text-xs font-semibold text-gold-700 hover:text-gold-800"
            >
              Full Analytics →
            </button>
          </div>

          {/* Simple Visual SVG Chart */}
          <div className="pt-2">
            <div className="h-44 w-full flex items-end gap-2 sm:gap-3 px-2">
              {analytics?.daily_trends && analytics.daily_trends.length > 0 ? (
                analytics.daily_trends.map((item, idx) => {
                  const maxCount = Math.max(
                    ...analytics.daily_trends.map((d) => d.count),
                    5
                  );
                  const heightPercent = Math.max((item.count / maxCount) * 100, 6);

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                    >
                      <span className="text-[10px] font-bold text-studio-800 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[36px] bg-gradient-to-t from-studio-800 to-gold-500 rounded-t-lg group-hover:brightness-110 transition-all duration-300"
                      />
                      <span className="text-[10px] text-studio-500 font-medium whitespace-nowrap">
                        {item.date}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center text-xs text-studio-400 py-10">
                  No scan activity yet. Scan your QR code to record data.
                </div>
              )}
            </div>
          </div>

          {/* Quick Tip for the business owner */}
          <div className="bg-cream-50 rounded-xl p-3.5 border border-beige-200/80 text-xs text-studio-700 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-studio-900">Printing Tip:</span>
              <p className="mt-0.5 text-studio-600 text-[11px] leading-relaxed">
                Download the vector SVG file to provide to your printing vendor in Coimbatore for
                the crispest 300+ DPI physical visiting cards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
