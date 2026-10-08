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
  business_name_ta?: string;
  subtitle: string;
  subtitle_ta?: string;
  tagline: string;
  tagline_ta?: string;
  quote: string;
  quote_ta?: string;
  phone: string;
  phone_raw: string;
  whatsapp_url: string;
  instagram_url: string;
  maps_url: string;
  website_url: string;
  address_line1: string;
  address_line1_ta?: string;
  address_line2: string;
  address_line2_ta?: string;
  address_city: string;
  address_city_ta?: string;
  address_pincode: string;
  timings_weekdays: string;
  timings_weekdays_ta?: string;
  updated_at: string;
}

export interface CourseStageSyllabus {
  id: 'beginner' | 'intermediate' | 'advanced';
  stage_key: 'beginner' | 'intermediate' | 'advanced';
  level: string; // e.g. "Basic / Beginner"
  level_ta?: string;
  title: string; // e.g. "Basic / Beginner Tailoring Course"
  title_ta?: string;
  badge: string; // e.g. "Stage 1 • Foundations"
  badge_ta?: string;
  duration: string; // e.g. "Foundational Practical Training"
  duration_ta?: string;
  description: string;
  description_ta?: string;
  highlights: string[];
  highlights_ta?: string[];
  pdf_url?: string; // Data URL or remote URL
  pdf_name?: string; // File name e.g. "Beginner_Course_Syllabus.pdf"
  pdf_size?: string; // e.g. "450 KB"
  updated_at?: string;
}

export interface CourseItem {
  id: string;
  title: string;
  title_ta?: string;
  level: string;
  level_ta?: string;
  badge?: string;
  badge_ta?: string;
  description: string;
  description_ta?: string;
  topics: string[];
  topics_ta?: string[];
  is_active: boolean;
  sort_order: number;
  pdf_url?: string;
  pdf_name?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  title_ta?: string;
  description: string;
  description_ta?: string;
  icon_name: string;
  image_url?: string;
  items?: string[];
  items_ta?: string[];
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
