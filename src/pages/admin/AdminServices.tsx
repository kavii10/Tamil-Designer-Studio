import React, { useState, useEffect } from 'react';
import {
  Scissors,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Heart,
  Shirt,
  Star,
  Image as ImageIcon,
  Tag,
  X,
  Upload,
  RotateCcw,
} from 'lucide-react';
import { ServiceItem } from '../../types';
import { db, DEFAULT_SERVICES } from '../../services/db';

const PRESET_IMAGES = [
  { label: 'Kids Pattu Lehenga', path: '/services/kids_pattu_lehenga.jpg' },
  { label: 'Kids Traditional Attire', path: '/services/kids_traditional_attire.jpg' },
  { label: 'Designer Gown & Anarkali', path: '/services/designer_gown_anarkali.jpg' },
  { label: 'Bridal Blouse Designs', path: '/services/bridal_blouse_designs.jpg' },
  { label: 'Aari & Embroidery Works', path: '/services/aari_embroidery_works.jpg' },
  { label: 'Blouse & Lehenga', path: '/services/blouse_lehenga_stitching.jpg' },
  { label: 'Anarkali & Gown', path: '/services/anarkali_gown_stitching.jpg' },
  { label: 'Trendy Blouse Designs', path: '/services/trendy_stylish_blouse.jpg' },
  { label: 'Saree Draping', path: '/services/saree_draping.jpg' },
  { label: 'Saree Prepleating', path: '/services/saree_prepleating.jpg' },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const details = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
    return [details.message, details.details, details.hint, details.code]
      .filter((part): part is string => typeof part === 'string' && part.length > 0)
      .join(' ')
      || fallback;
  }
  return fallback;
};

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [imageError, setImageError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [uploadingServiceId, setUploadingServiceId] = useState<string | null>(null);
  const [pendingServices, setPendingServices] = useState<ServiceItem[] | null>(null);
  const [newItemInputs, setNewItemInputs] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const data = await db.getServices(false); // all services including inactive
        setServices(data);
        setPendingServices(db.getPendingServices());
      } catch (err) {
        console.error(err);
        setLoadError(getErrorMessage(err, 'Could not load stitching services.'));
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleUpdate = (id: string, updates: Partial<ServiceItem>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleImageFileUpload = async (serviceId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');
    setUploadingServiceId(serviceId);
    try {
      if (db.isCloudEnabled()) {
        const imageUrl = await db.uploadServiceImage(file);
        handleUpdate(serviceId, { image_url: imageUrl });
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) handleUpdate(serviceId, { image_url: dataUrl });
          setUploadingServiceId(null);
        };
        reader.onerror = () => {
          setImageError('Could not read the selected image.');
          setUploadingServiceId(null);
        };
        reader.readAsDataURL(file);
        return;
      }
    } catch (err) {
      setImageError(getErrorMessage(err, 'Image upload failed.'));
    } finally {
      setUploadingServiceId(null);
    }
  };

  const handleAddItem = (serviceId: string) => {
    const text = (newItemInputs[serviceId] || '').trim();
    if (!text) return;

    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          const currentItems = s.items || [];
          return { ...s, items: [...currentItems, text] };
        }
        return s;
      })
    );
    setNewItemInputs((prev) => ({ ...prev, [serviceId]: '' }));
  };

  const handleRemoveItem = (serviceId: string, itemIndex: number) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          const currentItems = [...(s.items || [])];
          currentItems.splice(itemIndex, 1);
          return { ...s, items: currentItems };
        }
        return s;
      })
    );
  };

  const handleLoadPosterCategories = () => {
    if (
      window.confirm(
        'Load the 9 official stitching categories from the studio poster (with photos & included items)? You can still customize or add more before saving.'
      )
    ) {
      setServices(JSON.parse(JSON.stringify(DEFAULT_SERVICES)));
    }
  };

  const handleAddNew = () => {
    const newService: ServiceItem = {
      id: crypto.randomUUID(),
      title: 'New Stitching Category',
      description: 'Custom bespoke stitching tailored to your measurements and preferences.',
      icon_name: 'Scissors',
      image_url: '/services/bridal_blouse_designs.jpg',
      items: ['Custom Measurement', 'Finishing & Pressing', 'Perfect Fit Trial'],
      is_active: true,
      sort_order: services.length + 1,
    };
    setServices([...services, newService]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this stitching service?')) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const handleSaveAll = async () => {
    if (uploadingServiceId) return;
    try {
      setSaving(true);
      setSaveError('');
      await db.saveServices(services);
      setPendingServices(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setSaveError(getErrorMessage(err, 'Could not save stitching services.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-studio-500 text-xs">Loading stitching services...</div>;
  }

  if (loadError) {
    return <div role="alert" className="p-4 text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">Could not load stitching services: {loadError}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-studio-900 tracking-tight">
            Stitching Services Management
          </h1>
          <p className="text-xs sm:text-sm text-studio-500 mt-1">
            Manage custom stitching categories, photos, and included items displayed on the public digital card.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLoadPosterCategories}
            title="Load 9 categories from official poster"
            className="inline-flex items-center gap-1.5 text-xs bg-gold-50 hover:bg-gold-100 text-gold-950 border border-gold-300 px-3 py-2 rounded-xl transition-colors font-semibold shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gold-700" />
            <span>Load 9 Poster Categories</span>
          </button>

          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-beige-100 text-studio-800 border border-beige-300 px-3.5 py-2 rounded-xl transition-colors font-semibold shadow-subtle"
          >
            <Plus className="w-4 h-4 text-gold-600" />
            <span>Add Category</span>
          </button>

          {pendingServices && (
            <button
              type="button"
              onClick={() => setServices(pendingServices)}
              className="inline-flex items-center gap-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 px-3 py-2 rounded-xl font-semibold"
            >
              Restore recovered edits
            </button>
          )}

          <button
            onClick={handleSaveAll}
            disabled={saving || uploadingServiceId !== null}
            className="inline-flex items-center gap-1.5 text-xs bg-studio-800 hover:bg-studio-900 text-white px-4 py-2 rounded-xl transition-all shadow-subtle font-semibold"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 text-gold-400" />
                <span>Save All Services</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{db.isCloudEnabled()
            ? 'Stitching services saved to the shared database.'
            : 'Stitching services saved on this device only. Connect Supabase to sync across devices.'}</span>
        </div>
      )}
      {(saveError || imageError) && (
        <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl space-y-1">
          {saveError && <p>Services were not saved: {saveError}</p>}
          {imageError && <p>Image upload failed: {imageError}</p>}
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`bg-white rounded-2xl border transition-all p-5 space-y-4 shadow-sm flex flex-col justify-between ${
              service.is_active ? 'border-beige-200' : 'border-dashed border-studio-300 opacity-70 bg-cream-50/50'
            }`}
          >
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-beige-100 pb-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-gold-700 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded-md">
                    #{index + 1}
                  </span>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleUpdate(service.id, { title: e.target.value })}
                    placeholder="Category Title"
                    className="font-serif font-bold text-studio-900 text-base border-b border-transparent hover:border-beige-300 focus:border-gold-500 focus:outline-none bg-transparent flex-1 truncate"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    title={service.is_active ? 'Active on website' : 'Hidden from website'}
                    onClick={() => handleUpdate(service.id, { is_active: !service.is_active })}
                    className="flex items-center gap-1 text-xs"
                  >
                    {service.is_active ? (
                      <ToggleRight className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-studio-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    className="text-xs text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Photo Upload & Preview Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600">
                    Service Category Photo
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold text-gold-800 hover:text-gold-950 bg-gold-100/70 hover:bg-gold-200/80 px-2.5 py-1 rounded-lg border border-gold-300 transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-gold-700" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(service.id, e)}
                    />
                    {uploadingServiceId === service.id && <span className="text-[10px] text-studio-500">Uploading...</span>}
                  </label>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-beige-300 bg-cream-100 shrink-0 relative shadow-sm">
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-studio-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <input
                      type="text"
                      value={service.image_url || ''}
                      onChange={(e) => handleUpdate(service.id, { image_url: e.target.value })}
                      placeholder="Image path, URL, or upload via button above"
                      className="w-full px-3 py-1.5 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 font-mono text-studio-800"
                    />

                    {/* Quick Image Presets */}
                    <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-thin">
                      <span className="text-[10px] text-studio-500 whitespace-nowrap">Presets:</span>
                      {PRESET_IMAGES.slice(0, 4).map((p) => (
                        <button
                          key={p.path}
                          type="button"
                          onClick={() => handleUpdate(service.id, { image_url: p.path })}
                          className={`text-[9px] px-1.5 py-0.5 rounded border whitespace-nowrap transition-colors ${
                            service.image_url === p.path
                              ? 'bg-gold-500 text-white border-gold-600 font-bold'
                              : 'bg-cream-50 text-studio-700 border-beige-200 hover:bg-beige-100'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={service.description}
                  onChange={(e) => handleUpdate(service.id, { description: e.target.value })}
                  placeholder="Service description"
                  className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400 text-studio-800"
                />
              </div>

              {/* Included Items Checklist */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600">
                  Included Variations / Stitched Items ({service.items?.length || 0})
                </label>
                
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-cream-50/70 border border-beige-200 rounded-xl">
                  {(service.items || []).map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-white text-studio-800 border border-beige-300 px-2 py-0.5 rounded-lg shadow-2xs"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(service.id, idx)}
                        className="text-studio-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(!service.items || service.items.length === 0) && (
                    <span className="text-[11px] text-studio-400 italic">No items added yet</span>
                  )}
                </div>

                {/* Add Item Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newItemInputs[service.id] || ''}
                    onChange={(e) =>
                      setNewItemInputs((prev) => ({ ...prev, [service.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem(service.id);
                      }
                    }}
                    placeholder="Add variation (e.g. Silk Blouse) & press Enter"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItem(service.id)}
                    className="px-3 py-1.5 bg-studio-800 text-white text-xs font-semibold rounded-xl hover:bg-studio-900 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
