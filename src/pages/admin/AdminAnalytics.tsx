import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Smartphone,
  Laptop,
  Tablet,
  HelpCircle,
  Clock,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Eye,
  Calendar
} from 'lucide-react';
import { AnalyticsSummary, QRCodeItem } from '../../types';
import { db } from '../../services/db';

export const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [qrs, setQrs] = useState<QRCodeItem[]>([]);
  const [selectedQRId, setSelectedQRId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadData = async (qrId?: string) => {
    try {
      setLoading(true);
      const [allQRs, data] = await Promise.all([
        db.getAllQRCodes(),
        db.getAnalytics(qrId === 'all' ? undefined : qrId),
      ]);
      setQrs(allQRs);
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedQRId);
  }, [selectedQRId]);

  const handleSeedData = () => {
    if (qrs.length > 0) {
      db.seedSampleScans(qrs[0].id);
      loadData(selectedQRId);
    }
  };

  if (loading || !analytics) {
    return <div className="text-center py-12 text-studio-500 text-xs">Loading scan analytics...</div>;
  }

  const total = analytics.total_scans || 1;
  const mobilePct = Math.round((analytics.scans_by_device.mobile / total) * 100);
  const tabletPct = Math.round((analytics.scans_by_device.tablet / total) * 100);
  const desktopPct = Math.round((analytics.scans_by_device.desktop / total) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-studio-900 tracking-tight">
            Scan Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-studio-500 mt-1">
            Anonymous scan metrics recorded when visitors scan your printed visiting card QR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* QR Code Filter Selector */}
          <select
            value={selectedQRId}
            onChange={(e) => setSelectedQRId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-beige-300 text-xs bg-white text-studio-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            <option value="all">All QR Codes</option>
            {qrs.map((q) => (
              <option key={q.id} value={q.id}>
                {q.name} (/{q.slug})
              </option>
            ))}
          </select>

          <button
            onClick={() => loadData(selectedQRId)}
            className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-beige-100 text-studio-700 border border-beige-300 px-3 py-2 rounded-xl transition-colors font-medium shadow-subtle"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {analytics.total_scans < 5 && (
            <button
              onClick={handleSeedData}
              className="inline-flex items-center gap-1.5 text-xs bg-gold-100 hover:bg-gold-200 text-gold-900 border border-gold-300 px-3 py-2 rounded-xl transition-colors font-semibold"
              title="Populate test scan data to preview graphs"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Simulate Sample Scans</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards requested by Spec: Total Scans, Today's Scans, This Week, This Month */}
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
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-studio-900">
              {analytics.total_scans}
            </span>
            <p className="text-[11px] text-studio-400 mt-0.5">All-time redirects</p>
          </div>
        </div>

        {/* Today's Scans */}
        <div className="bg-white rounded-2xl p-5 border border-beige-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-studio-500">
              Today's Scans
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-studio-900">
              {analytics.today_scans}
            </span>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">Recorded today</p>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-2xl p-5 border border-beige-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-studio-500">
              This Week
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-studio-900">
              {analytics.week_scans}
            </span>
            <p className="text-[11px] text-studio-400 mt-0.5">Last 7 days</p>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-2xl p-5 border border-beige-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-studio-500">
              This Month
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-studio-900">
              {analytics.month_scans}
            </span>
            <p className="text-[11px] text-studio-400 mt-0.5">Last 30 days</p>
          </div>
        </div>
      </div>

      {/* Device Breakdown & Daily Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Breakdown Card */}
        <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 space-y-5">
          <div className="border-b border-beige-100 pb-3">
            <h3 className="font-serif font-bold text-studio-900 text-base">
              Device Distribution
            </h3>
            <p className="text-xs text-studio-500">Visitors by hardware type</p>
          </div>

          <div className="space-y-4">
            {/* Mobile */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-studio-800">
                  <Smartphone className="w-3.5 h-3.5 text-gold-600" />
                  Mobile Phones
                </span>
                <span className="font-mono text-studio-600 font-bold">
                  {analytics.scans_by_device.mobile} ({mobilePct}%)
                </span>
              </div>
              <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gold-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${mobilePct}%` }}
                />
              </div>
            </div>

            {/* Tablet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-studio-800">
                  <Tablet className="w-3.5 h-3.5 text-blue-600" />
                  Tablets & iPads
                </span>
                <span className="font-mono text-studio-600 font-bold">
                  {analytics.scans_by_device.tablet} ({tabletPct}%)
                </span>
              </div>
              <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${tabletPct}%` }}
                />
              </div>
            </div>

            {/* Desktop */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-studio-800">
                  <Laptop className="w-3.5 h-3.5 text-studio-600" />
                  Desktop / Laptops
                </span>
                <span className="font-mono text-studio-600 font-bold">
                  {analytics.scans_by_device.desktop} ({desktopPct}%)
                </span>
              </div>
              <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-studio-800 h-full rounded-full transition-all duration-500"
                  style={{ width: `${desktopPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-beige-100 flex items-center gap-2 text-[11px] text-studio-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Anonymous & Privacy-Preserving</span>
          </div>
        </div>

        {/* Scan Frequency Graph */}
        <div className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-beige-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-studio-900 text-base">
                Daily Scan Trends (Last 7 Days)
              </h3>
              <p className="text-xs text-studio-500">Frequency of scans over time</p>
            </div>
            <span className="text-[10px] font-semibold bg-cream-100 text-studio-700 px-2.5 py-1 rounded-full border border-beige-200">
              Live Real-Time
            </span>
          </div>

          <div className="h-48 w-full flex items-end gap-2 sm:gap-4 pt-4 px-2">
            {analytics.daily_trends.map((item, idx) => {
              const maxVal = Math.max(...analytics.daily_trends.map((d) => d.count), 6);
              const heightPct = Math.max((item.count / maxVal) * 100, 8);

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                >
                  <span className="text-[11px] font-bold text-studio-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-studio-900 to-gold-500 rounded-t-lg group-hover:brightness-110 transition-all duration-300"
                  />
                  <span className="text-[10px] text-studio-500 font-medium whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Scan Logs Table */}
      <div className="bg-white rounded-2xl border border-beige-200 shadow-premium overflow-hidden">
        <div className="p-5 border-b border-beige-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-studio-900 text-base">
            Recent Scans Stream
          </h3>
          <span className="text-xs text-studio-500">
            Latest {analytics.recent_scans.length} events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 text-studio-600 font-semibold border-b border-beige-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Browser</th>
                <th className="py-3 px-4">Platform (OS)</th>
                <th className="py-3 px-4">Referrer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100 text-studio-800">
              {analytics.recent_scans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-studio-400">
                    No scans logged yet. Test your QR link at /qr/tamil-designer-studio!
                  </td>
                </tr>
              ) : (
                analytics.recent_scans.map((log) => {
                  const d = new Date(log.scanned_at);
                  const formatted = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`;

                  return (
                    <tr key={log.id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-studio-700 whitespace-nowrap">
                        {formatted}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 capitalize font-medium">
                          {log.device_type === 'mobile' && (
                            <Smartphone className="w-3 h-3 text-gold-600" />
                          )}
                          {log.device_type === 'tablet' && (
                            <Tablet className="w-3 h-3 text-blue-600" />
                          )}
                          {log.device_type === 'desktop' && (
                            <Laptop className="w-3 h-3 text-studio-600" />
                          )}
                          {log.device_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">{log.browser}</td>
                      <td className="py-3 px-4">{log.os}</td>
                      <td className="py-3 px-4 text-studio-500 truncate max-w-xs">
                        {log.referrer}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
