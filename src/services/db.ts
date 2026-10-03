import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  QRCodeItem,
  BusinessSettings,
  CourseItem,
  ServiceItem,
  ScanLog,
  AnalyticsSummary,
} from '../types';

// Default initial state matching Tamil Designer Studio specifications
const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  id: '00000000-0000-0000-0000-000000000002',
  business_name: 'Tamil Designer Studio',
  subtitle: 'School of Fashion Design & Tailoring',
  tagline: 'Wear Dreams, Not Just Clothes.',
  quote: 'Where Fabric Meets Imagination',
  phone: '78452 64168',
  phone_raw: '917845264168',
  whatsapp_url: 'https://wa.me/917845264168?text=Hello%20Tamil%20Designer%20Studio%2C%20I%20would%20like%20to%20know%20more%20about%20your%20tailoring%20classes%20and%20stitching%20services.',
  instagram_url: 'https://instagram.com/tamil_designer_studio',
  maps_url: 'https://www.google.com/maps/place/11%C2%B003\'18.8%22N+77%C2%B003\'52.4%22E/@11.0552243,77.0619922,17z/data=!3m1!4b1!4m4!3m3!8m2!3d11.0552243!4d77.0645671?hl=en&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
  website_url: '',
  address_line1: '1/208 C, Jeeva Street',
  address_line2: 'Chinniyampalayam',
  address_city: 'Coimbatore',
  address_pincode: '641062',
  timings_weekdays: 'Weekdays: 9:00 AM – 1:00 PM & 3:00 PM – 8:00 PM',
  updated_at: new Date().toISOString(),
};

const DEFAULT_QR_CODES: QRCodeItem[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Tamil Designer Studio — Visiting Card QR',
    slug: 'tamil-designer-studio',
    destination_url: '/tamil-designer-studio',
    is_active: true,
    scan_count: 0,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Kids Pattu Lehenga Dress',
    description: 'Traditional Pattu Lehenga, Pavadai Sattai & ethnic girls outfits stitched to perfection for festivals and celebrations.',
    icon_name: 'Star',
    image_url: '/services/kids_pattu_lehenga.jpg',
    items: ['Pattu Pavadai', 'Langa Voni', 'Lehenga Blouse', 'Festive Frocks', 'Half Saree Sets'],
    is_active: true,
    sort_order: 1,
  },
  {
    id: 's2',
    title: 'Traditional Indian Attires for Kids',
    description: 'Classic Indian ethnic wear for children — churidars, salwars, and traditional dresses stitched with care.',
    icon_name: 'Sparkles',
    image_url: '/services/kids_traditional_attire.jpg',
    items: ['Churidar Sets', 'Salwar Kameez', 'Kurti & Pant', "Kid's Ethnic Wear", 'School Uniform Stitching'],
    is_active: true,
    sort_order: 2,
  },
  {
    id: 's3',
    title: 'Designer Gown & Anarkali Stitching',
    description: 'Stunning Anarkali suits, floor-length gowns, and designer party wear crafted with premium fabric.',
    icon_name: 'Sparkles',
    image_url: '/services/designer_gown_anarkali.jpg',
    items: ['Anarkali Suits', 'Long Gowns', 'Maxi Variations', 'Western Outfits', 'Party Wear Gowns'],
    is_active: true,
    sort_order: 3,
  },
  {
    id: 's4',
    title: 'Bridal Blouse Designs',
    description: 'Exquisite bridal blouses with intricate hand work, silk and brocade fabric stitching for your most special day.',
    icon_name: 'Heart',
    image_url: '/services/bridal_blouse_designs.jpg',
    items: ['Bridal Silk Blouse', 'Wedding Blouse', 'Embroidery Blouse', 'Stone Work Blouse', 'Zardosi Blouse'],
    is_active: true,
    sort_order: 4,
  },
  {
    id: 's5',
    title: 'Aari Works & Embroidery',
    description: 'Hand-crafted Aari embroidery work on blouses, dupattas, and garments with traditional patterns and modern elegance.',
    icon_name: 'Sparkles',
    image_url: '/services/aari_embroidery_works.jpg',
    items: ['Aari Thread Work', 'Zardosi Work', 'Cutdana Work', 'Mirror Work', 'Maggam Embroidery'],
    is_active: true,
    sort_order: 5,
  },
  {
    id: 's6',
    title: 'Blouse & Lehenga Stitching',
    description: 'Blouse variations, lehenga skirts, and matching sets with perfect fitting across all fabric types.',
    icon_name: 'Scissors',
    image_url: '/services/blouse_lehenga_stitching.jpg',
    items: ['Blouse Variations', 'Lehenga Skirts', 'Kurti Variations', 'Pant Variations', 'Nightwear'],
    is_active: true,
    sort_order: 6,
  },
  {
    id: 's7',
    title: 'Anarkali & Gown Stitching',
    description: 'Elegant Anarkali and gown stitching with fine-tuned draping, lining, and precision finishing.',
    icon_name: 'Sparkles',
    image_url: '/services/anarkali_gown_stitching.jpg',
    items: ['Anarkali Stitching', 'Long Gown', 'Cape Gown', 'Palazzo Suits', 'Sharara Sets'],
    is_active: true,
    sort_order: 7,
  },
  {
    id: 's8',
    title: 'Trendy & Stylish Blouse Designs',
    description: 'Contemporary and trendy blouse designs — backless, collar neck, off-shoulder, and latest pattern blouses.',
    icon_name: 'Shirt',
    image_url: '/services/trendy_stylish_blouse.jpg',
    items: ['Designer Blouse', 'Collar Neck', 'Puff Sleeve', 'Off-Shoulder', 'Backless Blouse'],
    is_active: true,
    sort_order: 8,
  },
  {
    id: 's9',
    title: 'Prepleating Services',
    description: 'Professional saree prepleating, expert draping, precision pinning, ironing, box & hanger folding, and buffy pleats.',
    icon_name: 'Scissors',
    image_url: '/services/saree_draping.jpg',
    items: ['Saree Draping', 'Saree Prepleating', 'Pinig Techniques', 'Ironing Method', 'Box Folding', 'Hanger Folding', 'Buffy Pleats'],
    is_active: true,
    sort_order: 9,
  },
];
export const DEFAULT_COURSES: CourseItem[] = [
  {
    id: 'c1',
    title: 'Blouse Variations',
    level: 'Advanced',
    badge: '18 Variations',
    description: 'Master 18 bespoke designer blouse patterns — from royal princess cuts and Sabyasachi styles to modern halter and tube blouses.',
    topics: [
      'Body analysis',
      'Armhole princess blouse',
      'Sleeveless princess blouse',
      'Halter neck blouse',
      'Tube blouse',
      'Boat neck blouse',
      'Shawl collar blouse',
      'Half Chinese collar blouse',
      'Princess cut with waist band',
      'One dart blouse',
      'Illusion neck blouse',
      '3 Dart blouse',
      '4 Dart blouse',
      'Madhubala blouse',
      'Katori blouse',
      'Sabyasachi blouse',
      'Blouse layout',
      'Elastic attachment blouse',
    ],
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'c2',
    title: 'Kurti Variations',
    level: 'Intermediate',
    badge: '12 Variations',
    description: 'Learn pattern drafting and stitching for 12 trending kurti styles, collars, asymmetric hemlines, and comfort fits.',
    topics: [
      'Straight kurti',
      'Packed neck kurti',
      'Side knot kurti',
      'Deep neck kurti',
      'Deep neck sleeveless kurti',
      'A-line kurti',
      'Flat collar kurti',
      'Shirt collar kurti',
      'Princess cut kurti',
      'High-low kurti',
      'Angrakha kurti',
      'Plus size kurti',
    ],
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'c3',
    title: 'Pant Variations',
    level: 'Intermediate',
    badge: '7 Variations',
    description: 'Master 7 bottom-wear styles including tailored cigarette pants, palazzo flare, and ethnic salwars with comfortable waistband finishes.',
    topics: [
      'Palazzo pants',
      'Cigarette pants',
      'High waist pants',
      'Patiala pants',
      'Salwar pants',
      'Jeans',
      'Leggings',
    ],
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'c4',
    title: 'Maxi Variations',
    level: 'Advanced',
    badge: '11 Variations',
    description: 'Create floor-length maxi dresses, circular flares, tiered panels, and stunning saree-to-gown upcycling creations.',
    topics: [
      'Full circular maxi',
      'Double circular maxi',
      'Half circular maxi',
      'Shoulder princess pleated maxi',
      'Gathered over coat maxi',
      'Pleated maxi',
      '3 Tiered maxi',
      'Full panel maxi',
      'Yoke panel maxi',
      'A-line maxi',
      'Saree to gown maxi',
    ],
    is_active: true,
    sort_order: 4,
  },
  {
    id: 'c5',
    title: 'Full Set & Ethnic Ensembles',
    level: 'Specialized',
    badge: 'Complete Sets',
    description: 'Craft matching festive wear ensembles, royal Madhubala co-ords, and trending sharara suits with precision draping.',
    topics: [
      'Madhubala set',
      '2 Piece set',
      'Sharara',
    ],
    is_active: true,
    sort_order: 5,
  },
  {
    id: 'c6',
    title: 'Western Outfits',
    level: 'Couture',
    badge: '9 Outfits',
    description: 'Contemporary western fashion techniques — shirts, corsetry, jumpsuits, peplum, kaftan, and structural outerwear.',
    topics: [
      'Women’s shirt',
      'Peplum top',
      'Kaftan',
      'Crop top',
      'One piece',
      'Corset',
      'Jumpsuit',
      'Shirred top',
      'Over coat',
    ],
    is_active: true,
    sort_order: 6,
  },
  {
    id: 'c7',
    title: 'Saree Prepleating Class',
    level: 'Specialized',
    badge: 'Signature Masterclass',
    description: 'Professional saree draping, precision pleating, pinning, ironing, box & hanger folding, and boutique packaging techniques.',
    topics: [
      'Saree draping',
      'Saree prepleating',
      'Pinning techniques',
      'Ironing method',
      'Box folding',
      'Hanger folding',
      'Buffy pleats',
    ],
    is_active: true,
    sort_order: 7,
  },
];

// Helper to load/save localStorage
const STORAGE_KEYS = {
  SETTINGS: 'tds_business_settings',
  PENDING_SETTINGS: 'tds_pending_business_settings',
  QR_CODES: 'tds_qr_codes',
  SERVICES: 'tds_services',
  PENDING_SERVICES: 'tds_pending_services',
  COURSES: 'tds_courses',
  SCAN_LOGS: 'tds_scan_logs',
};

function getLocalData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocalData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to write to localStorage', err);
  }
}

function getPendingData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

// User Agent Device Parser
export function parseUserAgent(ua: string): {
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser: string;
  os: string;
} {
  const lowerUA = ua.toLowerCase();
  let deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown' = 'desktop';

  if (/ipad|tablet|(android(?!.*mobile))/i.test(lowerUA)) {
    deviceType = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(lowerUA)) {
    deviceType = 'mobile';
  }

  let browser = 'Unknown Browser';
  if (/edg/i.test(lowerUA)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(lowerUA)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(lowerUA)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(lowerUA) && !/chrome/i.test(lowerUA)) browser = 'Apple Safari';
  else if (/opera|opr/i.test(lowerUA)) browser = 'Opera';

  let os = 'Unknown OS';
  if (/windows/i.test(lowerUA)) os = 'Windows';
  else if (/iphone|ipad|ipod/i.test(lowerUA)) os = 'iOS';
  else if (/macintosh|mac os x/i.test(lowerUA)) os = 'macOS';
  else if (/android/i.test(lowerUA)) os = 'Android';
  else if (/linux/i.test(lowerUA)) os = 'Linux';

  return { deviceType, browser, os };
}

// Unified Database Provider
export const db = {
  isCloudEnabled: () => isSupabaseConfigured,

  // ==================== QR CODES ====================
  async getQRCodeBySlug(slug: string): Promise<QRCodeItem | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) return data as QRCodeItem;
      } catch (err) {
        console.warn('Supabase query failed, falling back to local store:', err);
      }
    }

    const items = getLocalData<QRCodeItem[]>(STORAGE_KEYS.QR_CODES, DEFAULT_QR_CODES);
    return items.find((q) => q.slug === slug) || null;
  },

  async getAllQRCodes(): Promise<QRCodeItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as QRCodeItem[];
      } catch (err) {
        console.warn('Supabase query failed, falling back to local store:', err);
      }
    }

    return getLocalData<QRCodeItem[]>(STORAGE_KEYS.QR_CODES, DEFAULT_QR_CODES);
  },

  async updateQRDestination(id: string, newDestination: string): Promise<QRCodeItem> {
    const updated_at = new Date().toISOString();
    let updatedItem: QRCodeItem | null = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('qr_codes')
          .update({ destination_url: newDestination, updated_at })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          updatedItem = data as QRCodeItem;
        }
      } catch (err) {
        console.warn('Supabase update failed, saving locally:', err);
      }
    }

    const items = getLocalData<QRCodeItem[]>(STORAGE_KEYS.QR_CODES, DEFAULT_QR_CODES);
    const index = items.findIndex((q) => q.id === id);
    if (index === -1) {
      const fallbackItem: QRCodeItem = updatedItem || {
        id,
        name: 'Tamil Designer Studio — Visiting Card QR',
        slug: 'tamil-designer-studio',
        destination_url: newDestination,
        is_active: true,
        scan_count: 0,
        created_at: updated_at,
        updated_at,
      };
      items.push(fallbackItem);
      setLocalData(STORAGE_KEYS.QR_CODES, items);
      return fallbackItem;
    }

    items[index] = {
      ...items[index],
      ...(updatedItem || {}),
      destination_url: newDestination,
      updated_at,
    };
    setLocalData(STORAGE_KEYS.QR_CODES, items);
    return items[index];
  },

  async toggleQRActive(id: string, is_active: boolean): Promise<QRCodeItem> {
    const updated_at = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('qr_codes')
          .update({ is_active, updated_at })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as QRCodeItem;
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    const items = getLocalData<QRCodeItem[]>(STORAGE_KEYS.QR_CODES, DEFAULT_QR_CODES);
    const index = items.findIndex((q) => q.id === id);
    if (index === -1) throw new Error('QR Code not found');

    items[index] = { ...items[index], is_active, updated_at };
    setLocalData(STORAGE_KEYS.QR_CODES, items);
    return items[index];
  },

  async createQRCode(qr: Omit<QRCodeItem, 'id' | 'scan_count' | 'created_at' | 'updated_at'>): Promise<QRCodeItem> {
    const now = new Date().toISOString();
    const newQR: QRCodeItem = {
      ...qr,
      id: crypto.randomUUID ? crypto.randomUUID() : 'qr-' + Date.now(),
      scan_count: 0,
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('qr_codes')
          .insert([newQR])
          .select()
          .single();
        if (!error && data) return data as QRCodeItem;
      } catch (err) {
        console.warn('Supabase insert failed:', err);
      }
    }

    const items = getLocalData<QRCodeItem[]>(STORAGE_KEYS.QR_CODES, DEFAULT_QR_CODES);
    items.unshift(newQR);
    setLocalData(STORAGE_KEYS.QR_CODES, items);
    return newQR;
  },

  // ==================== SCAN LOGGING & ANALYTICS ====================
  async recordScan(qrId: string, userAgentStr?: string, referrerStr?: string): Promise<void> {
    const ua = userAgentStr || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
    const ref = referrerStr || (typeof document !== 'undefined' ? document.referrer : '');
    const { deviceType, browser, os } = parseUserAgent(ua);

    const logEntry: ScanLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'scan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      qr_code_id: qrId,
      scanned_at: new Date().toISOString(),
      device_type: deviceType,
      browser,
      os,
      referrer: ref || 'Direct / Visiting Card QR',
      user_agent: ua,
    };

    // Increment scan count in qr_codes
    const client = isSupabaseConfigured ? supabase : null;
    if (client) {
      try {
        await client.from('scan_logs').insert([logEntry]);
        const { data } = await client.from('qr_codes').select('scan_count').eq('id', qrId).single();
        if (data) {
          await client.from('qr_codes').update({ scan_count: (data.scan_count || 0) + 1 }).eq('id', qrId);
        }
        return;
      } catch (err) {
        console.warn('Failed to record scan in Supabase:', err);
      }
    }

    // Local fallback
    const logs = getLocalData<ScanLog[]>(STORAGE_KEYS.SCAN_LOGS, []);
    logs.unshift(logEntry);
    setLocalData(STORAGE_KEYS.SCAN_LOGS, logs.slice(0, 500)); // Keep latest 500 logs

    const qrItems = getLocalData<QRCodeItem[]>(STORAGE_KEYS.QR_CODES, DEFAULT_QR_CODES);
    const targetIdx = qrItems.findIndex((q) => q.id === qrId);
    if (targetIdx !== -1) {
      qrItems[targetIdx].scan_count = (qrItems[targetIdx].scan_count || 0) + 1;
      setLocalData(STORAGE_KEYS.QR_CODES, qrItems);
    }
  },

  async getAnalytics(qrId?: string): Promise<AnalyticsSummary> {
    let logs: ScanLog[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('scan_logs').select('*').order('scanned_at', { ascending: false });
        if (qrId) query = query.eq('qr_code_id', qrId);
        const { data, error } = await query.limit(500);
        if (!error && data) logs = data as ScanLog[];
      } catch (err) {
        console.warn('Supabase analytics fetch failed:', err);
      }
    }

    if (logs.length === 0) {
      logs = getLocalData<ScanLog[]>(STORAGE_KEYS.SCAN_LOGS, []);
      if (qrId) logs = logs.filter((l) => l.qr_code_id === qrId);
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = todayStart - 7 * 86400000;
    const monthStart = todayStart - 30 * 86400000;

    let today_scans = 0;
    let week_scans = 0;
    let month_scans = 0;

    const scans_by_device = {
      mobile: 0,
      tablet: 0,
      desktop: 0,
      unknown: 0,
    };

    // Calculate daily trends for last 7 days
    const dailyMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap.set(dateStr, 0);
    }

    logs.forEach((log) => {
      const time = new Date(log.scanned_at).getTime();
      if (time >= todayStart) today_scans++;
      if (time >= weekStart) week_scans++;
      if (time >= monthStart) month_scans++;

      if (log.device_type in scans_by_device) {
        scans_by_device[log.device_type]++;
      } else {
        scans_by_device.unknown++;
      }

      const dateStr = new Date(log.scanned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
      }
    });

    const daily_trends = Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return {
      total_scans: logs.length,
      today_scans,
      week_scans,
      month_scans,
      scans_by_device,
      recent_scans: logs.slice(0, 20),
      daily_trends,
    };
  },

  // ==================== BUSINESS SETTINGS ====================
  async getBusinessSettings(): Promise<BusinessSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      if (!data) throw new Error('Business settings were not found in Supabase.');

      const cached = getPendingData<BusinessSettings>(STORAGE_KEYS.SETTINGS);
      if (cached) {
        const { id: _cachedId, updated_at: _cachedUpdatedAt, ...cachedValues } = cached;
        const { id: _defaultId, updated_at: _defaultUpdatedAt, ...defaultValues } = DEFAULT_BUSINESS_SETTINGS;
        const { id: _cloudId, updated_at: _cloudUpdatedAt, ...cloudValues } = data as BusinessSettings;
        if (
          JSON.stringify(cachedValues) !== JSON.stringify(defaultValues) &&
          JSON.stringify(cachedValues) !== JSON.stringify(cloudValues)
        ) {
          setLocalData(STORAGE_KEYS.PENDING_SETTINGS, cached);
        }
      }
      setLocalData(STORAGE_KEYS.SETTINGS, data);
      return data as BusinessSettings;
    }

    const settings = getLocalData<BusinessSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
    return settings;
  },

  async updateBusinessSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const updated_at = new Date().toISOString();
    let result: BusinessSettings | null = null;

    if (isSupabaseConfigured && supabase) {
      const { data: updateData, error: updateError } = await supabase
        .from('business_settings')
        .update({ ...updates, updated_at })
        .eq('id', DEFAULT_BUSINESS_SETTINGS.id)
        .select()
        .maybeSingle();

      if (updateError) throw updateError;
      if (updateData) {
        result = updateData as BusinessSettings;
      } else {
        const { data: upsertData, error: upsertError } = await supabase
          .from('business_settings')
          .upsert({ ...DEFAULT_BUSINESS_SETTINGS, ...updates, updated_at })
          .select()
          .single();
        if (upsertError) throw upsertError;
        if (!upsertData) throw new Error('Supabase did not return the saved business settings.');
        result = upsertData as BusinessSettings;
      }
    }

    const current = getLocalData<BusinessSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
    const updated = { ...current, ...(result || updates), updated_at };
    setLocalData(STORAGE_KEYS.SETTINGS, updated);
    if (result && typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.PENDING_SETTINGS);
    }

    // Dispatch event to inform live UI components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tds_settings_updated', { detail: updated }));
    }

    return updated;
  },

  // ==================== SERVICES ====================
  async getServices(activeOnly = true): Promise<ServiceItem[]> {
    if (isSupabaseConfigured && supabase) {
      let q = supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (activeOnly) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw error;
      const services = (data || []) as ServiceItem[];
      if (!activeOnly) {
        const cached = getPendingData<ServiceItem[]>(STORAGE_KEYS.SERVICES);
        if (
          cached &&
          JSON.stringify(cached) !== JSON.stringify(DEFAULT_SERVICES) &&
          JSON.stringify(cached) !== JSON.stringify(services)
        ) {
          setLocalData(STORAGE_KEYS.PENDING_SERVICES, cached);
        }
        setLocalData(STORAGE_KEYS.SERVICES, services);
      }
      return services;
    }

    let items = getLocalData<ServiceItem[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    if (items.length <= 5 || !items.some((s) => s.image_url)) {
      items = DEFAULT_SERVICES;
      setLocalData(STORAGE_KEYS.SERVICES, items);
    }
    return activeOnly ? items.filter((s) => s.is_active) : items;
  },

  async saveServices(services: ServiceItem[]): Promise<ServiceItem[]> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('services')
        .upsert(services, { onConflict: 'id' });
      if (error) throw error;
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.PENDING_SERVICES);
      }
    }

    setLocalData(STORAGE_KEYS.SERVICES, services);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tds_services_updated', { detail: services }));
    }

    return services;
  },

  async uploadServiceImage(file: File): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Connect Supabase to upload an image that is available on all devices.');
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      throw new Error('Choose a JPEG, PNG, WebP, or GIF image.');
    }
    if (file.size > 10 * 1024 * 1024) throw new Error('Image must be 10 MB or smaller.');

    const extension = file.name.split('.').pop()?.toLowerCase() || 'img';
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from('studio-images')
      .upload(path, file, { cacheControl: '31536000', contentType: file.type });
    if (error) throw error;

    return supabase.storage.from('studio-images').getPublicUrl(path).data.publicUrl;
  },

  getPendingBusinessSettings(): BusinessSettings | null {
    return getPendingData<BusinessSettings>(STORAGE_KEYS.PENDING_SETTINGS);
  },

  getPendingServices(): ServiceItem[] | null {
    return getPendingData<ServiceItem[]>(STORAGE_KEYS.PENDING_SERVICES);
  },

    // ==================== COURSES ====================
  async getCourses(activeOnly = true): Promise<CourseItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let q = supabase.from('courses').select('*').order('sort_order', { ascending: true });
        if (activeOnly) q = q.eq('is_active', true);
        const { data, error } = await q;
        if (!error && data && data.length > 0) {
          const hasSyllabus = data.some((c: any) => c.title && c.title.toLowerCase().includes('blouse'));
          if (hasSyllabus) {
            if (!activeOnly) {
              setLocalData(STORAGE_KEYS.COURSES, data);
            }
            return data as CourseItem[];
          }
        }
      } catch (err) {
        console.warn('Supabase courses fetch failed:', err);
      }
    }

    let items = getLocalData<CourseItem[]>(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    if (!items || items.length <= 4 || !items.some((c) => c.title && c.title.toLowerCase().includes('blouse'))) {
      items = DEFAULT_COURSES;
      setLocalData(STORAGE_KEYS.COURSES, items);
    }
    return activeOnly ? items.filter((c) => c.is_active) : items;
  },

  async saveCourses(courses: CourseItem[]): Promise<CourseItem[]> {
    setLocalData(STORAGE_KEYS.COURSES, courses);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('courses')
          .upsert(courses, { onConflict: 'id' });
        if (error) {
          console.warn('Supabase saveCourses error:', error);
        }
      } catch (err) {
        console.warn('Supabase saveCourses failed:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tds_courses_updated', { detail: courses }));
    }

    return courses;
  },

  // Seed sample analytics for demonstration/test visualization
  seedSampleScans(qrId: string): void {
    const logs = getLocalData<ScanLog[]>(STORAGE_KEYS.SCAN_LOGS, []);
    if (logs.length > 5) return; // Already has scans

    const devices: ('mobile' | 'tablet' | 'desktop')[] = ['mobile', 'mobile', 'mobile', 'tablet', 'desktop'];
    const browsers = ['Safari (iPhone)', 'Chrome Mobile', 'Firefox', 'Chrome'];
    const now = Date.now();

    for (let i = 0; i < 48; i++) {
      const timeOffset = Math.floor(Math.random() * 7 * 86400000);
      const dev = devices[Math.floor(Math.random() * devices.length)];
      logs.push({
        id: 'seed-scan-' + i,
        qr_code_id: qrId,
        scanned_at: new Date(now - timeOffset).toISOString(),
        device_type: dev,
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        os: dev === 'mobile' ? 'iOS' : dev === 'tablet' ? 'iPadOS' : 'Windows',
        referrer: 'Visiting Card Print Scan',
      });
    }

    logs.sort((a, b) => new Date(b.scanned_at).getTime() - new Date(a.scanned_at).getTime());
    setLocalData(STORAGE_KEYS.SCAN_LOGS, logs);

    const qrs = getLocalData<QRCodeItem[]>(STORAGE_KEYS.QR_CODES, DEFAULT_QR_CODES);
    const target = qrs.find((q) => q.id === qrId);
    if (target) {
      target.scan_count = logs.length;
      setLocalData(STORAGE_KEYS.QR_CODES, qrs);
    }
  },
};
