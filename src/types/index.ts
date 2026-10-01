export interface QRCodeItem {
  id: string;
  name: string;
  slug: string;
  destination_url: string;
  is_active: boolean;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  subtitle: string;
  tagline: string;
  quote: string;
  phone: string;
  phone_raw: string;
  whatsapp_url: string;
  instagram_url: string;
  maps_url: string;
  website_url: string;
  address_line1: string;
  address_line2: string;
  address_city: string;
  address_pincode: string;
  timings_weekdays: string;
  updated_at: string;
}

export interface CourseItem {
  id: string;
  title: string;
  level: string;
  badge?: string;
  description: string;
  topics: string[];
  is_active: boolean;
  sort_order: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url?: string;
  items?: string[];
  is_active: boolean;
  sort_order: number;
}

export interface ScanLog {
  id: string;
  qr_code_id: string;
  scanned_at: string;
  device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser: string;
  os: string;
  referrer: string;
  user_agent?: string;
}

export interface AnalyticsSummary {
  total_scans: number;
  today_scans: number;
  week_scans: number;
  month_scans: number;
  scans_by_device: {
    mobile: number;
    tablet: number;
    desktop: number;
    unknown: number;
  };
  recent_scans: ScanLog[];
  daily_trends: { date: string; count: number }[];
}

export interface AdminUser {
  email: string;
  role: 'admin';
  isAuthenticated: boolean;
}
