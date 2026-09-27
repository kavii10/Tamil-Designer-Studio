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
  Wrench
} from 'lucide-react';
import { ServiceItem } from '../../types';
import { db } from '../../services/db';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const data = await db.getServices(false); // all services including inactive
        setServices(data);
      } catch (err) {
        console.error(err);
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

  const handleAddNew = () => {
    const newService: ServiceItem = {
      id: 'service-' + Date.now(),
      title: 'New Designer Service',
      description: 'Custom handcrafted tailoring and fitting service.',
      icon_name: 'Sparkles',
      is_active: true,
      sort_order: services.length + 1,
    };
    setServices([...services, newService]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this service?')) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      await db.saveServices(services);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-studio-500 text-xs">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-studio-900 tracking-tight">
            Tailoring & Stitching Services
          </h1>
          <p className="text-xs sm:text-sm text-studio-500 mt-1">
            Manage bespoke stitching, alterations, bridal, and couture services displayed on the digital card.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-beige-100 text-studio-800 border border-beige-300 px-3.5 py-2 rounded-xl transition-colors font-semibold shadow-subtle"
          >
            <Plus className="w-4 h-4 text-gold-600" />
            <span>Add Service</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
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
          <span>Services successfully updated! Changes are live on your digital card.</span>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-beige-200 shadow-premium p-5 space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-beige-100 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center">
                    {service.icon_name === 'Scissors' ? (
                      <Scissors className="w-4 h-4" />
                    ) : service.icon_name === 'Heart' ? (
                      <Heart className="w-4 h-4" />
                    ) : service.icon_name === 'Shirt' ? (
                      <Shirt className="w-4 h-4" />
                    ) : service.icon_name === 'Wrench' ? (
                      <Wrench className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleUpdate(service.id, { title: e.target.value })}
                    className="font-serif font-bold text-studio-900 text-base border-b border-transparent hover:border-beige-300 focus:border-gold-500 focus:outline-none bg-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate(service.id, { is_active: !service.is_active })}
                    className="text-xs"
                  >
                    {service.is_active ? (
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-studio-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    className="text-xs text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={service.description}
                  onChange={(e) => handleUpdate(service.id, { description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-500 mb-1">
                  Icon Identifier
                </label>
                <select
                  value={service.icon_name}
                  onChange={(e) => handleUpdate(service.id, { icon_name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 bg-white"
                >
                  <option value="Scissors">Scissors (Custom Stitching)</option>
                  <option value="Wrench">Wrench (Alterations)</option>
                  <option value="Sparkles">Sparkles (Designer Wear)</option>
                  <option value="Heart">Heart (Bridal Stitching)</option>
                  <option value="Shirt">Shirt (Women’s Wear)</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
