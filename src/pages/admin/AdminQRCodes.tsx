import React, { useState, useEffect } from 'react';
import {
  Plus,
  QrCode,
  Download,
  Copy,
  ExternalLink,
  Check,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Link as LinkIcon,
  Search,
  FileCode2
} from 'lucide-react';
import { QRCodeItem } from '../../types';
import { db } from '../../services/db';
import {
  getPermanentQRUrl,
  generateQRPNGDataUrl,
  generateQRSVGString,
  triggerDownload
} from '../../utils/qrGenerator';

export const AdminQRCodes: React.FC = () => {
  const [qrs, setQrs] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');

  // Form states for new QR
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [creatingLoading, setCreatingLoading] = useState(false);

  // Edit destination modal/inline state
  const [editingQRId, setEditingQRId] = useState<string | null>(null);
  const [editDestInput, setEditDestInput] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);

  const loadQRs = async () => {
    try {
      setLoading(true);
      const data = await db.getAllQRCodes();
      setQrs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQRs();
  }, []);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDownload = async (qr: QRCodeItem, format: 'png' | 'svg') => {
    const permanentUrl = getPermanentQRUrl(qr.slug);
    if (format === 'png') {
      const png = await generateQRPNGDataUrl(permanentUrl, { width: 1024, margin: 3 });
      triggerDownload(png, `${qr.slug}-qr.png`, true);
    } else {
      const svg = await generateQRSVGString(permanentUrl, { margin: 3 });
      triggerDownload(svg, `${qr.slug}-qr.svg`, false);
    }
  };

  const handleToggleActive = async (qr: QRCodeItem) => {
    try {
      const updated = await db.toggleQRActive(qr.id, !qr.is_active);
      setQrs((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveDestination = async (id: string) => {
    const trimmed = editDestInput.trim();
    if (!trimmed) return;

    try {
      const updated = await db.updateQRDestination(id, trimmed);
      setQrs((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      setEditingQRId(null);
      setEditSuccessMsg(id);
      setTimeout(() => setEditSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const slugClean = newSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-');
    const destClean = newDestination.trim();

    if (!newName.trim()) {
      setFormError('Please provide a QR name.');
      return;
    }
    if (!slugClean) {
      setFormError('Please provide a valid slug (letters, numbers, hyphens).');
      return;
    }
    if (!destClean) {
      setFormError('Please provide a valid destination URL.');
      return;
    }

    try {
      setCreatingLoading(true);
      const created = await db.createQRCode({
        name: newName.trim(),
        slug: slugClean,
        destination_url: destClean,
        is_active: true,
      });

      setQrs((prev) => [created, ...prev]);
      setIsCreating(false);
      setNewName('');
      setNewSlug('');
      setNewDestination('');
    } catch (err) {
      console.error(err);
      setFormError('Failed to create QR code. The slug might already be in use.');
    } finally {
      setCreatingLoading(false);
    }
  };

  const filteredQRs = qrs.filter(
    (q) =>
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.slug.toLowerCase().includes(search.toLowerCase()) ||
      q.destination_url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-studio-900 tracking-tight">
            Dynamic QR Codes Manager
          </h1>
          <p className="text-xs sm:text-sm text-studio-500 mt-1">
            Manage permanent QR codes and re-route their destinations on the fly.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center justify-center gap-2 bg-studio-800 hover:bg-studio-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-subtle"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Create New QR</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-beige-200 shadow-subtle">
        <Search className="w-4 h-4 text-studio-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter QR codes by name, slug, or destination..."
          className="w-full text-xs sm:text-sm text-studio-900 placeholder-studio-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Create New QR Modal / Box */}
      {isCreating && (
        <div className="bg-white rounded-2xl border border-gold-300 shadow-premium p-6 sm:p-7 animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-beige-200 pb-3">
            <h3 className="font-serif font-bold text-studio-900 text-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              Create New Dynamic QR Code
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs text-studio-500 hover:text-studio-800"
            >
              Cancel
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateNew} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                  QR Code Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (!newSlug) {
                      setNewSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '')
                      );
                    }
                  }}
                  placeholder="e.g. Saree Prepleting Poster QR"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                  Permanent URL Slug
                </label>
                <div className="flex items-center rounded-xl border border-beige-300 overflow-hidden bg-cream-50 focus-within:ring-2 focus-within:ring-gold-400">
                  <span className="text-xs font-mono text-studio-500 px-3 py-2 bg-beige-100 border-r border-beige-300">
                    /qr/
                  </span>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="saree-prepleting-poster"
                    className="w-full px-3 py-2 text-sm font-mono text-studio-900 bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-studio-700">
                Initial Destination Target URL
              </label>
              <input
                type="text"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder="https://instagram.com/tamil_designer_studio or /tamil-designer-studio"
                className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={creatingLoading}
                className="bg-studio-800 hover:bg-studio-900 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-subtle disabled:opacity-50"
              >
                {creatingLoading ? 'Generating QR...' : 'Create & Generate QR'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs sm:text-sm font-medium text-studio-600 px-4 py-2.5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QR Code Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-studio-500 text-xs">Loading QR codes...</div>
        ) : filteredQRs.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-beige-200">
            <QrCode className="w-10 h-10 text-studio-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-studio-800">No QR codes found</p>
            <p className="text-xs text-studio-500 mt-1">Try another search or create a new QR.</p>
          </div>
        ) : (
          filteredQRs.map((qr) => {
            const permUrl = getPermanentQRUrl(qr.slug);
            const isEditingThis = editingQRId === qr.id;
            const hasSuccessMsg = editSuccessMsg === qr.id;

            return (
              <div
                key={qr.id}
                className="bg-white rounded-2xl border border-beige-200 shadow-premium p-5 sm:p-6 space-y-4 transition-all"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-beige-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-bold text-studio-900 text-base sm:text-lg">
                        {qr.name}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          qr.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {qr.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-studio-500 font-mono">
                      Slug: /{qr.slug} • Scans: <span className="font-bold text-studio-900">{qr.scan_count || 0}</span>
                    </p>
                  </div>

                  {/* Toggle Active Button */}
                  <button
                    onClick={() => handleToggleActive(qr)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-studio-600 hover:text-studio-900"
                  >
                    {qr.is_active ? (
                      <>
                        <ToggleRight className="w-6 h-6 text-emerald-600" />
                        <span className="text-emerald-700">Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-6 h-6 text-studio-400" />
                        <span className="text-studio-500">Disabled</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Permanent URL box */}
                <div className="bg-cream-50 p-3 rounded-xl border border-beige-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5 truncate">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-studio-500">
                      Permanent Printed QR URL (Never Changes)
                    </span>
                    <p className="font-mono text-xs sm:text-sm text-studio-900 truncate">
                      {permUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(qr.id, permUrl)}
                      className="inline-flex items-center gap-1 text-xs bg-white hover:bg-beige-100 text-studio-800 border border-beige-300 px-2.5 py-1.5 rounded-lg transition-colors font-medium shadow-subtle"
                    >
                      {copiedId === qr.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <a
                      href={permUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs bg-gold-50 hover:bg-gold-100 text-gold-900 border border-gold-300 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test</span>
                    </a>
                  </div>
                </div>

                {/* Live Destination Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-studio-600">
                      Live Destination Target
                    </span>
                    {!isEditingThis && (
                      <button
                        onClick={() => {
                          setEditingQRId(qr.id);
                          setEditDestInput(qr.destination_url);
                        }}
                        className="text-xs font-semibold text-gold-700 hover:text-gold-900 underline"
                      >
                        Change Destination
                      </button>
                    )}
                  </div>

                  {hasSuccessMsg && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        ✓ Destination updated successfully. Existing QR code remains unchanged.
                      </span>
                    </div>
                  )}

                  {!isEditingThis ? (
                    <div className="p-3 bg-white rounded-xl border border-beige-200 font-mono text-xs sm:text-sm text-studio-900 truncate">
                      {qr.destination_url}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <input
                        type="text"
                        value={editDestInput}
                        onChange={(e) => setEditDestInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gold-400 rounded-xl font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveDestination(qr.id)}
                          className="bg-studio-800 hover:bg-studio-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-subtle"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingQRId(null)}
                          className="text-xs font-medium text-studio-600 px-3 py-2 hover:bg-beige-100 rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-beige-100">
                  <button
                    onClick={() => handleDownload(qr, 'png')}
                    className="inline-flex items-center gap-1.5 text-xs bg-studio-800 hover:bg-studio-900 text-white font-semibold px-3.5 py-2 rounded-xl transition-all shadow-subtle"
                  >
                    <Download className="w-3.5 h-3.5 text-gold-400" />
                    <span>Download PNG (1024px)</span>
                  </button>

                  <button
                    onClick={() => handleDownload(qr, 'svg')}
                    className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-beige-50 text-studio-800 border border-beige-300 font-semibold px-3.5 py-2 rounded-xl transition-colors"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-studio-600" />
                    <span>Download Vector SVG</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
