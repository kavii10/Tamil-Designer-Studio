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

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Custom Stitching',
    description: 'Bespoke tailoring crafted to your precise measurements, personal aesthetics, and comfort.',
    icon_name: 'Scissors',
    is_active: true,
    sort_order: 1,
  },
  {
    id: 's2',
    title: 'Alterations',
    description: 'Flawless precision alterations, reshaping, sizing adjustments, and garment restoration.',
    icon_name: 'Wrench',
    is_active: true,
    sort_order: 2,
  },
  {
    id: 's3',
    title: 'Designer Wear',
    description: 'Exclusive handcrafted gowns, luxury party wear, ethnic ensembles, and modern couture.',
    icon_name: 'Sparkles',
    is_active: true,
    sort_order: 3,
  },
  {
    id: 's4',
    title: 'Bridal Stitching',
    description: 'Opulent bridal blouses, intricate hand aari embroidery, and bespoke wedding couture.',
    icon_name: 'Heart',
    is_active: true,
    sort_order: 4,
  },
  {
    id: 's5',
    title: 'Women’s Wear',
    description: 'Everyday chic to festive kurtis, salwars, anarkalis, lehengas, and designer outfits.',
    icon_name: 'Shirt',
    is_active: true,
    sort_order: 5,
  },
];

const DEFAULT_COURSES: CourseItem[] = [
  {
    id: 'c1',
    title: 'Beginner Level',
    level: 'Beginner',
    badge: 'Foundations',
    description: 'Master sewing machines, fundamental stitch mechanics, hand tools, and beginner garment assembly.',
    topics: ['Machine Basics', 'Basic Stitching', 'Tools Knowledge', 'Simple Garments'],
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'c2',
    title: 'Intermediate Level',
    level: 'Intermediate',
    badge: 'Core Skills',
    description: 'Learn accurate body measurements, precise pattern drafting, women’s wear creation, and fitting techniques.',
    topics: ['Pattern Drafting', 'Women’s Wear Stitching', 'Fitting Techniques'],
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'c3',
    title: 'Advanced Level',
    level: 'Advanced',
    badge: 'Couture Mastery',
    description: 'Design high-end designer garments, bridal masterpieces, and acquire business growth mastery.',
    topics: [
      'Designer Garments',
      'Bridal Stitching',
      'Marketing Strategy',
      'Social Media Marketing',
    ],
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'c4',
    title: 'Saree Prepleting Class',
    level: 'Specialized',
    badge: 'Signature Masterclass',
    description: 'Professional saree draping, precision pleating, pinning, ironing, and boutique packaging techniques.',
    topics: [
      'Saree draping',
      'Saree prepleting',
      'Pinig techniques',
      'Iorning medhod',
      'Box folding',
      'Hanger folding',
      'Buffy pleats',
    ],
    is_active: true,
    sort_order: 4,
  },
];

// Helper to load/save localStorage
const STORAGE_KEYS = {
  SETTINGS: 'tds_business_settings',
  QR_CODES: 'tds_qr_codes',
  SERVICES: 'tds_services',
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

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('qr_codes')
          .update({ destination_url: newDestination, updated_at })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as QRCodeItem;
      } catch (err) {
        console.warn('Supabase update failed, saving locally:', err);
      }
    }

    const items = getLocalData<QRCodeItem[]>(STORAGE_KEYS.QR_CODES, DEFAULT_QR_CODES);
    const index = items.findIndex((q) => q.id === id);
    if (index === -1) throw new Error('QR Code not found');

    items[index] = {
      ...items[index],
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
    const CORRECT_MAPS_URL =
      'https://www.google.com/maps/place/11%C2%B003\'18.8%22N+77%C2%B003\'52.4%22E/@11.0552243,77.0619922,17z/data=!3m1!4b1!4m4!3m3!8m2!3d11.0552243!4d77.0645671?hl=en&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D';

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('business_settings')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) return data as BusinessSettings;
      } catch (err) {
        console.warn('Supabase fetch failed:', err);
      }
    }

    const settings = getLocalData<BusinessSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);

    // ── Auto-migration: always force-fix old/wrong maps URL ──
    const OLD_MAPS_PATTERNS = [
      'maps.google.com/?q=',
      'maps/dir/?api=1',
      'Peelamedu',
      '641004',
    ];
    const needsFix = OLD_MAPS_PATTERNS.some((pattern) =>
      settings.maps_url?.includes(pattern)
    ) || settings.maps_url !== CORRECT_MAPS_URL;

    if (needsFix) {
      settings.maps_url = CORRECT_MAPS_URL;
      setLocalData(STORAGE_KEYS.SETTINGS, settings);
    }

    return settings;
  },


  async updateBusinessSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const updated_at = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('business_settings')
          .update({ ...updates, updated_at })
          .eq('id', DEFAULT_BUSINESS_SETTINGS.id)
          .select()
          .single();
        if (!error && data) return data as BusinessSettings;
      } catch (err) {
        console.warn('Supabase settings update failed:', err);
      }
    }

    const current = getLocalData<BusinessSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
    const updated = { ...current, ...updates, updated_at };
    setLocalData(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // ==================== SERVICES ====================
  async getServices(activeOnly = true): Promise<ServiceItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let q = supabase.from('services').select('*').order('sort_order', { ascending: true });
        if (activeOnly) q = q.eq('is_active', true);
        const { data, error } = await q;
        if (!error && data) return data as ServiceItem[];
      } catch (err) {
        console.warn('Supabase services fetch failed:', err);
      }
    }

    const items = getLocalData<ServiceItem[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    return activeOnly ? items.filter((s) => s.is_active) : items;
  },

  async saveServices(services: ServiceItem[]): Promise<ServiceItem[]> {
    setLocalData(STORAGE_KEYS.SERVICES, services);
    return services;
  },

  // ==================== COURSES ====================
  async getCourses(activeOnly = true): Promise<CourseItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let q = supabase.from('courses').select('*').order('sort_order', { ascending: true });
        if (activeOnly) q = q.eq('is_active', true);
        const { data, error } = await q;
        if (!error && data) return data as CourseItem[];
      } catch (err) {
        console.warn('Supabase courses fetch failed:', err);
      }
    }

    const items = getLocalData<CourseItem[]>(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    return activeOnly ? items.filter((c) => c.is_active) : items;
  },

  async saveCourses(courses: CourseItem[]): Promise<CourseItem[]> {
    setLocalData(STORAGE_KEYS.COURSES, courses);
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
