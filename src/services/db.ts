import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  QRCodeItem,
  BusinessSettings,
  CourseItem,
  CourseStageSyllabus,
  ServiceItem,
  ScanLog,
  AnalyticsSummary,
} from '../types';
import {
  savePdfToStorage,
  getPdfFromStorage,
  removePdfFromStorage,
} from '../utils/pdfStorage';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  return 'Unknown storage error.';
}

// Default initial state matching Tamil Designer Studio specifications
const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  id: '00000000-0000-0000-0000-000000000002',
  business_name: 'Tamil Designer Studio',
  business_name_ta: 'Tamil Designer Studio',
  subtitle: 'School of Fashion Design & Tailoring',
  subtitle_ta: 'ஃபேஷன் டிசைன் & தையல் பள்ளி',
  tagline: 'Wear Dreams, Not Just Clothes.',
  tagline_ta: 'கனவுகளை அணியுங்கள், வெறும் ஆடைகளை அல்ல.',
  quote: 'Where Fabric Meets Imagination',
  quote_ta: 'துணி கற்பனையுடன் சந்திக்கும் இடம்',
  phone: '78452 64168',
  phone_raw: '917845264168',
  whatsapp_url: 'https://wa.me/917845264168?text=Hello%20Tamil%20Designer%20Studio%2C%20I%20would%20like%20to%20know%20more%20about%20your%20tailoring%20classes%20and%20stitching%20services.',
  instagram_url: 'https://instagram.com/tamil_designer_studio',
  maps_url: 'https://www.google.com/maps/place/11%C2%B003\'18.8%22N+77%C2%B003\'52.4%22E/@11.0552243,77.0619922,17z/data=!3m1!4b1!4m4!3m3!8m2!3d11.0552243!4d77.0645671?hl=en&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
  website_url: '',
  address_line1: '1/208 C, Jeeva Street',
  address_line1_ta: '1/208 C, ஜீவா தெரு',
  address_line2: 'Chinniyampalayam',
  address_line2_ta: 'சின்னியம்பாளையம்',
  address_city: 'Coimbatore',
  address_city_ta: 'கோயம்புத்தூர்',
  address_pincode: '641062',
  timings_weekdays: 'Weekdays: 9:00 AM – 1:00 PM & 3:00 PM – 8:00 PM',
  timings_weekdays_ta: 'வேலைநாட்கள்: காலை 9:00 – மதியம் 1:00 & மதியம் 3:00 – இரவு 8:00',
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
    title_ta: 'குழந்தைகள் பட்டு லெஹங்கா உடை',
    description: 'Traditional Pattu Lehenga, Pavadai Sattai & ethnic girls outfits stitched to perfection for festivals and celebrations.',
    description_ta: 'பாரம்பரிய பட்டு லெஹங்கா, பாவாடை சட்டை & பெண் குழந்தைகளுக்கான பாரம்பரிய ஆடைகள் பண்டிகைகளுக்கு துல்லியமாக தைக்கப்படும்.',
    icon_name: 'Star',
    image_url: '/services/kids_pattu_lehenga.jpg',
    items: ['Pattu Pavadai', 'Langa Voni', 'Lehenga Blouse', 'Festive Frocks', 'Half Saree Sets'],
    items_ta: ['பட்டு பாவாடை', 'லங்கா வோணி', 'லெஹங்கா பிளவுஸ்', 'பண்டிகை ஃபிராக்', 'தாவணி செட்கள்'],
    is_active: true,
    sort_order: 1,
  },
  {
    id: 's2',
    title: 'Traditional Indian Attires for Kids',
    title_ta: 'குழந்தைகளுக்கான பாரம்பரிய இந்திய உடைகள்',
    description: 'Classic Indian ethnic wear for children — churidars, salwars, and traditional dresses stitched with care.',
    description_ta: 'குழந்தைகளுக்கான கிளாசிக் இந்திய பாரம்பரிய உடைகள் — சுடிதார், சல்வார், மற்றும் பாரம்பரிய உடைகள் அக்கறையுடன் தைக்கப்படும்.',
    icon_name: 'Sparkles',
    image_url: '/services/kids_traditional_attire.jpg',
    items: ['Churidar Sets', 'Salwar Kameez', 'Kurti & Pant', "Kid's Ethnic Wear", 'School Uniform Stitching'],
    items_ta: ['சுடிதார் செட்', 'சல்வார் கமீஸ்', 'குர்த்தி & பேண்ட்', 'குழந்தைகள் பாரம்பரிய உடை', 'பள்ளி சீருடை தையல்'],
    is_active: true,
    sort_order: 2,
  },
  {
    id: 's3',
    title: 'Designer Gown & Anarkali Stitching',
    title_ta: 'டிசைனர் கவுன் & அனார்கலி தையல்',
    description: 'Stunning Anarkali suits, floor-length gowns, and designer party wear crafted with premium fabric.',
    description_ta: 'அற்புதமான அனார்கலி உடைகள், தரை நீள கவுன்கள் மற்றும் பிரீமியம் துணியில் உருவாக்கப்பட்ட பார்ட்டி உடைகள்.',
    icon_name: 'Sparkles',
    image_url: '/services/designer_gown_anarkali.jpg',
    items: ['Anarkali Suits', 'Long Gowns', 'Maxi Variations', 'Western Outfits', 'Party Wear Gowns'],
    items_ta: ['அனார்கலி சூட்கள்', 'நீண்ட கவுன்கள்', 'மேக்ஸி வகைகள்', 'மேற்கத்திய உடைகள்', 'பார்ட்டி வேர் கவுன்கள்'],
    is_active: true,
    sort_order: 3,
  },
  {
    id: 's4',
    title: 'Bridal Blouse Designs',
    title_ta: 'பிரைடல் பிளவுஸ் டிசைன்கள்',
    description: 'Exquisite bridal blouses with intricate hand work, silk and brocade fabric stitching for your most special day.',
    description_ta: 'உங்கள் சிறப்பு நாளுக்காக நுணுக்கமான கை வேலைப்பாடு, பட்டு மற்றும் புரோக்கேட் துணி தையலுடன் கூடிய திருமண ஜாக்கெட்டுகள்.',
    icon_name: 'Heart',
    image_url: '/services/bridal_blouse_designs.jpg',
    items: ['Bridal Silk Blouse', 'Wedding Blouse', 'Embroidery Blouse', 'Stone Work Blouse', 'Zardosi Blouse'],
    items_ta: ['பிரைடல் பட்டு பிளவுஸ்', 'திருமண பிளவுஸ்', 'எம்பிராய்டரி பிளவுஸ்', 'ஸ்டோன் ஒர்க் பிளவுஸ்', 'ஜர்தோசி பிளவுஸ்'],
    is_active: true,
    sort_order: 4,
  },
  {
    id: 's5',
    title: 'Aari Works & Embroidery',
    title_ta: 'ஆரி வேலை & எம்பிராய்டரி',
    description: 'Hand-crafted Aari embroidery work on blouses, dupattas, and garments with traditional patterns and modern elegance.',
    description_ta: 'பாரம்பரிய வடிவங்கள் மற்றும் நவீன நேர்த்தியுடன் பிளவுஸ், துப்பட்டாக்களில் கைவினை ஆரி எம்பிராய்டரி வேலை.',
    icon_name: 'Sparkles',
    image_url: '/services/aari_embroidery_works.jpg',
    items: ['Aari Thread Work', 'Zardosi Work', 'Cutdana Work', 'Mirror Work', 'Maggam Embroidery'],
    items_ta: ['ஆரி நூல் வேலை', 'ஜர்தோசி வேலை', 'கட்டடானா வேலை', 'மிரர் ஒர்க்', 'மக்கம் எம்பிராய்டரி'],
    is_active: true,
    sort_order: 5,
  },
  {
    id: 's6',
    title: 'Blouse & Lehenga Stitching',
    title_ta: 'பிளவுஸ் & லெஹங்கா தையல்',
    description: 'Blouse variations, lehenga skirts, and matching sets with perfect fitting across all fabric types.',
    description_ta: 'அனைத்து துணி வகைகளிலும் சரியான அளவுடன் பிளவுஸ் வகைகள், லெஹங்கா பாவாடைகள் மற்றும் மேட்சிங் செட்கள்.',
    icon_name: 'Scissors',
    image_url: '/services/blouse_lehenga_stitching.jpg',
    items: ['Blouse Variations', 'Lehenga Skirts', 'Kurti Variations', 'Pant Variations', 'Nightwear'],
    items_ta: ['பிளவுஸ் வகைகள்', 'லெஹங்கா பாவாடை', 'குர்த்தி வகைகள்', 'பேண்ட் வகைகள்', 'இரவு ஆடை'],
    is_active: true,
    sort_order: 6,
  },
  {
    id: 's7',
    title: 'Anarkali & Gown Stitching',
    title_ta: 'அனார்கலி & கவுன் தையல்',
    description: 'Elegant Anarkali and gown stitching with fine-tuned draping, lining, and precision finishing.',
    description_ta: 'நேர்த்தியான அனார்கலி மற்றும் கவுன் தையல், துல்லியமான லைனிங் மற்றும் ஃபினிஷிங் உடன்.',
    icon_name: 'Sparkles',
    image_url: '/services/anarkali_gown_stitching.jpg',
    items: ['Anarkali Stitching', 'Long Gown', 'Cape Gown', 'Palazzo Suits', 'Sharara Sets'],
    items_ta: ['அனார்கலி தையல்', 'நீண்ட கவுன்', 'கேப் கவுன்', 'பலாஸோ சூட்கள்', 'ஷராரா செட்கள்'],
    is_active: true,
    sort_order: 7,
  },
  {
    id: 's8',
    title: 'Trendy & Stylish Blouse Designs',
    title_ta: 'ட்ரெண்டி & ஸ்டைலிஷ் பிளவுஸ் டிசைன்கள்',
    description: 'Contemporary and trendy blouse designs — backless, collar neck, off-shoulder, and latest pattern blouses.',
    description_ta: 'நவீன மற்றும் ட்ரெண்டி பிளவுஸ் வடிவமைப்புகள் — பேக்லெஸ், காலர் நெக், ஆஃப்-ஷோல்டர் மற்றும் லேட்டஸ்ட் பேட்டர்ன்கள்.',
    icon_name: 'Shirt',
    image_url: '/services/trendy_stylish_blouse.jpg',
    items: ['Designer Blouse', 'Collar Neck', 'Puff Sleeve', 'Off-Shoulder', 'Backless Blouse'],
    items_ta: ['டிசைனர் பிளவுஸ்', 'காலர் நெக்', 'பஃப் ஸ்லீவ்', 'ஆஃப்-ஷோல்டர்', 'பேக்லெஸ் பிளவுஸ்'],
    is_active: true,
    sort_order: 8,
  },
  {
    id: 's9',
    title: 'Prepleating Services',
    title_ta: 'சேலை முன்மடிப்பு சேவைகள்',
    description: 'Professional saree prepleating, expert draping, precision pinning, ironing, box & hanger folding, and buffy pleats.',
    description_ta: 'தொழில்முறை சேலை முன்மடிப்பு, நிபுணர் டிராப்பிங், துல்லியமான பின்னிங், அயர்னிங், பாக்ஸ் & ஹேங்கர் மடிப்பு.',
    icon_name: 'Scissors',
    image_url: '/services/saree_draping.jpg',
    items: ['Saree Draping', 'Saree Prepleating', 'Pinig Techniques', 'Ironing Method', 'Box Folding', 'Hanger Folding', 'Buffy Pleats'],
    items_ta: ['சேலை அணிவிப்பு', 'சேலை முன்மடிப்பு', 'பின்னிங் நுட்பங்கள்', 'அயர்னிங் முறை', 'பாக்ஸ் ஃபோல்டிங்', 'ஹேங்கர் ஃபோல்டிங்', 'பஃபி மடிப்புகள்'],
    is_active: true,
    sort_order: 9,
  },
];
export const DEFAULT_COURSES: CourseItem[] = [
  {
    id: 'c1',
    title: 'Blouse Variations',
    title_ta: 'பிளவுஸ் வகைகள்',
    level: 'Advanced',
    level_ta: 'மேம்பட்ட நிலை',
    badge: '18 Variations',
    badge_ta: '18 வகைகள்',
    description: 'Master 18 bespoke designer blouse patterns — from royal princess cuts and Sabyasachi styles to modern halter and tube blouses.',
    description_ta: '18 தனிப்பயன் டிசைனர் பிளவுஸ் பேட்டர்ன்கள் — பிரின்சஸ் கட், சப்யசாச்சி முதல் நவீன ஹால்டர் மற்றும் டியூப் பிளவுஸ் வரை கற்றுக்கொள்ளுங்கள்.',
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
    topics_ta: [
      'உடல் பகுப்பாய்வு',
      'ஆர்ம்ஹோல் பிரின்சஸ் பிளவுஸ்',
      'ஸ்லீவ்லெஸ் பிரின்சஸ் பிளவுஸ்',
      'ஹால்டர் நெக் பிளவுஸ்',
      'டியூப் பிளவுஸ்',
      'போட் நெக் பிளவுஸ்',
      'ஷால் காலர் பிளவுஸ்',
      'ஹாஃப் சைனீஸ் காலர் பிளவுஸ்',
      'இடுப்பு பட்டி பிரின்சஸ் கட்',
      'ஒன் டார்ட் பிளவுஸ்',
      'இல்லுஷன் நெக் பிளவுஸ்',
      '3 டார்ட் பிளவுஸ்',
      '4 டார்ட் பிளவுஸ்',
      'மதுபாலா பிளவுஸ்',
      'கடோரி பிளவுஸ்',
      'சப்யசாச்சி பிளவுஸ்',
      'பிளவுஸ் தளவமைப்பு',
      'எலாஸ்டிக் இணைப்பு பிளவுஸ்',
    ],
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'c2',
    title: 'Kurti Variations',
    title_ta: 'குர்த்தி வகைகள்',
    level: 'Intermediate',
    level_ta: 'இடைநிலை',
    badge: '12 Variations',
    badge_ta: '12 வகைகள்',
    description: 'Learn pattern drafting and stitching for 12 trending kurti styles, collars, asymmetric hemlines, and comfort fits.',
    description_ta: '12 ட்ரெண்டி குர்த்தி பாணிகள், காலர்கள், சமச்சீரற்ற ஹெம்லைன்கள் மற்றும் வசதியான பொருத்தங்களுக்கான பேட்டர்ன் வரைவு மற்றும் தையல்.',
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
    topics_ta: [
      'நேரான குர்த்தி',
      'பேக்டு நெக் குர்த்தி',
      'சைடு நாட் குர்த்தி',
      'டீப் நெக் குர்த்தி',
      'டீப் நெக் ஸ்லீவ்லெஸ் குர்த்தி',
      'ஏ-லைன் குர்த்தி',
      'பிளாட் காலர் குர்த்தி',
      'ஷர்ட் காலர் குர்த்தி',
      'பிரின்சஸ் கட் குர்த்தி',
      'ஹை-லோ குர்த்தி',
      'அங்கரகா குர்த்தி',
      'பிளஸ் சைஸ் குர்த்தி',
    ],
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'c3',
    title: 'Pant Variations',
    title_ta: 'பேண்ட் வகைகள்',
    level: 'Intermediate',
    level_ta: 'இடைநிலை',
    badge: '7 Variations',
    badge_ta: '7 வகைகள்',
    description: 'Master 7 bottom-wear styles including tailored cigarette pants, palazzo flare, and ethnic salwars with comfortable waistband finishes.',
    description_ta: 'சிகரெட் பேண்ட், பலாஸோ மற்றும் வசதியான இடுப்புப் பட்டி கொண்ட பாரம்பரிய சல்வார்களுக்கான 7 பாட்டம்-வேர் பாணிகள்.',
    topics: [
      'Palazzo pants',
      'Cigarette pants',
      'High waist pants',
      'Patiala pants',
      'Salwar pants',
      'Jeans',
      'Leggings',
    ],
    topics_ta: [
      'பலாஸோ பேண்ட்',
      'சிகரெட் பேண்ட்',
      'ஹை வேஸ்ட் பேண்ட்',
      'பாட்டியாலா பேண்ட்',
      'சல்வார் பேண்ட்',
      'ஜீன்ஸ்',
      'லெக்கின்ஸ்',
    ],
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'c4',
    title: 'Maxi Variations',
    title_ta: 'மேக்ஸி வகைகள்',
    level: 'Advanced',
    level_ta: 'மேம்பட்ட நிலை',
    badge: '11 Variations',
    badge_ta: '11 வகைகள்',
    description: 'Create floor-length maxi dresses, circular flares, tiered panels, and stunning saree-to-gown upcycling creations.',
    description_ta: 'தரை நீள மேக்ஸி ஆடைகள், வட்ட வடிவ விரிவுகள், அடுக்கு பேனல்கள் மற்றும் சேலை-முதல்-கவுன் மறுசுழற்சி ஆடைகள்.',
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
    topics_ta: [
      'முழு வட்ட மேக்ஸி',
      'இரட்டை வட்ட மேக்ஸி',
      'அரை வட்ட மேக்ஸி',
      'தோள்பட்டை பிரின்சஸ் ப்ளீட்டட் மேக்ஸி',
      'ஓவர் கோட் மேக்ஸி',
      'ப்ளீட்டட் மேக்ஸி',
      '3 அடுக்கு மேக்ஸி',
      'முழு பேனல் மேக்ஸி',
      'யோக் பேனல் மேக்ஸி',
      'ஏ-லைன் மேக்ஸி',
      'சேலை முதல் கவுன் மேக்ஸி',
    ],
    is_active: true,
    sort_order: 4,
  },
  {
    id: 'c5',
    title: 'Full Set & Ethnic Ensembles',
    title_ta: 'முழு செட் & பாரம்பரிய உடைகள்',
    level: 'Specialized',
    level_ta: 'சிறப்பு நிலை',
    badge: 'Complete Sets',
    badge_ta: 'முழு செட்கள்',
    description: 'Craft matching festive wear ensembles, royal Madhubala co-ords, and trending sharara suits with precision draping.',
    description_ta: 'பண்டிகை கால மேட்சிங் உடைகள், ராஜரீக மதுபாலா கோ-ஆர்ட்கள் மற்றும் ட்ரெண்டி ஷராரா சூட்கள்.',
    topics: [
      'Madhubala set',
      '2 Piece set',
      'Sharara',
    ],
    topics_ta: [
      'மதுபாலா செட்',
      '2 பீஸ் செட்',
      'ஷராரா',
    ],
    is_active: true,
    sort_order: 5,
  },
  {
    id: 'c6',
    title: 'Western Outfits',
    title_ta: 'மேற்கத்திய உடைகள்',
    level: 'Couture',
    level_ta: 'கௌட்டர்',
    badge: '9 Outfits',
    badge_ta: '9 உடைகள்',
    description: 'Contemporary western fashion techniques — shirts, corsetry, jumpsuits, peplum, kaftan, and structural outerwear.',
    description_ta: 'நவீன மேற்கத்திய ஃபேஷன் நுட்பங்கள் — ஷர்ட், கார்செட், ஜம்ப்சூட், பெப்ளம், கஃப்தான் மற்றும் கோட்.',
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
    topics_ta: [
      'மகளிர் சட்டை',
      'பெப்ளம் டாப்',
      'கஃப்தான்',
      'கிராப் டாப்',
      'ஒன் பீஸ்',
      'கார்செட்',
      'ஜம்ப்சூட்',
      'ஷிர்ட் டாப்',
      'ஓவர் கோட்',
    ],
    is_active: true,
    sort_order: 6,
  },
  {
    id: 'c7',
    title: 'Saree Prepleating Class',
    title_ta: 'சேலை முன்மடிப்பு வகுப்பு',
    level: 'Specialized',
    level_ta: 'சிறப்பு நிலை',
    badge: 'Signature Masterclass',
    badge_ta: 'சிக்னேச்சர் மாஸ்டர் கிளாஸ்',
    description: 'Professional saree draping, precision pleating, pinning, ironing, box & hanger folding, and boutique packaging techniques.',
    description_ta: 'தொழில்முறை சேலை அணிவிப்பு, துல்லியமான மடிப்பு, பின்னிங், அயர்னிங், பாக்ஸ் & ஹேங்கர் மடிப்பு மற்றும் பேக்கேஜிங்.',
    topics: [
      'Saree draping',
      'Saree prepleating',
      'Pinning techniques',
      'Ironing method',
      'Box folding',
      'Hanger folding',
      'Buffy pleats',
    ],
    topics_ta: [
      'சேலை அணிவிப்பு',
      'சேலை முன்மடிப்பு',
      'பின்னிங் நுட்பங்கள்',
      'அயர்னிங் முறை',
      'பாக்ஸ் மடிப்பு',
      'ஹேங்கர் மடிப்பு',
      'பஃபி மடிப்புகள்',
    ],
    is_active: true,
    sort_order: 7,
  },
];

export const DEFAULT_STAGE_SYLLABUSES: CourseStageSyllabus[] = [
  {
    id: 'beginner',
    stage_key: 'beginner',
    level: 'Basic / Beginner',
    level_ta: 'அடிப்படை / ஆரம்ப நிலை',
    title: 'Basic & Beginner Tailoring Course',
    title_ta: 'அடிப்படை & ஆரம்ப தையல் படிப்பு',
    badge: 'Stage 1 • Foundations',
    badge_ta: 'நிலை 1 • அடிப்படைகள்',
    duration: 'Foundational Practical Training',
    duration_ta: 'அடிப்படை நடைமுறை பயிற்சி',
    description: 'Learn sewing machine operation, needle & tension mastery, precise body measurements, fundamental garment cutting, and essential stitching techniques.',
    description_ta: 'தையல் இயந்திர இயக்கம், ஊசி & டென்ஷன் மாஸ்டரி, துல்லியமான உடல் அளவீடுகள், அடிப்படை ஆடை வெட்டல் மற்றும் அத்தியாவசிய தையல் நுட்பங்களை கற்றுக்கொள்ளுங்கள்.',
    highlights: [
      'Industrial power sewing machine speed & motor control',
      'Body anatomy analysis & accurate inch tape measurement',
      'Straight lines, curved stitching, and professional seam finishes',
      'Neckline finishing, piping, can-can & elastic attachments',
      'Fundamental fabric cutting techniques, safety & grain alignment',
      'Basic hand stitches, button holes & hook fittings',
    ],
    highlights_ta: [
      'தொழில்துறை பவர் தையல் இயந்திர வேகம் & மோட்டார் கட்டுப்பாடு',
      'உடல் பகுப்பாய்வு & துல்லியமான இன்ச் டேப் அளவீடு',
      'நேர்கோடு, வளைவு தையல் மற்றும் தொழில்முறை தையல் முடிப்புகள்',
      'கழுத்து வடிவமைப்பு, பைப்பிங், கேன்-கேன் & எலாஸ்டிக் இணைப்புகள்',
      'அடிப்படை துணி வெட்டும் நுட்பங்கள் & பாதுகாப்பு வழிகாட்டல்',
      'அடிப்படை கைத் தையல்கள், பட்டன் துளைகள் & கொக்கி பொருத்துதல்',
    ],
    pdf_name: 'Tamil_Designer_Studio_Basic_Course_Syllabus.pdf',
    pdf_size: 'Official Studio Syllabus',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'intermediate',
    stage_key: 'intermediate',
    level: 'Intermediate',
    level_ta: 'இடைநிலை',
    title: 'Intermediate Pattern Drafting & Garments',
    title_ta: 'இடைநிலை பேட்டர்ன் வரைவு & ஆடைகள்',
    badge: 'Stage 2 • Core Garments',
    badge_ta: 'நிலை 2 • மைய ஆடைகள்',
    duration: 'Core Pattern & Cutting Masterclass',
    duration_ta: 'மைய பேட்டர்ன் & வெட்டும் மாஸ்டர் கிளாஸ்',
    description: 'Master commercial pattern drafting, fabric calculation, cutting, and stitching for 12 trending kurti variations, 7 pant variations, and ethnic salwars with perfect fitting.',
    description_ta: 'வணிக பேட்டர்ன் வரைவு, துணி கணக்கீடு, வெட்டல் மற்றும் 12 ட்ரெண்டி குர்த்தி வகைகள், 7 பேண்ட் வகைகள் மற்றும் சரியான அளவுடன் தையல் மாஸ்டர் செய்யுங்கள்.',
    highlights: [
      '12 Trending Kurti variations (Straight, A-line, Deep neck, Angrakha, Collar)',
      '7 Bottom wear styles (Palazzo, Cigarette, High-waist, Salwar, Patiala)',
      'Dart manipulation, armhole shaping & princess cut seams',
      'Flawless fitting, posture adjustment & alteration fixes',
      'Fabric calculation, grainlines & yardage planning',
      'Industrial speed finishing and pressing techniques',
    ],
    highlights_ta: [
      '12 ட்ரெண்டி குர்த்தி வகைகள் (ஸ்ட்ரெய்ட், ஏ-லைன், டீப் நெக், அங்கரகா, காலர்)',
      '7 பாட்டம் வேர் பாணிகள் (பலாஸோ, சிகரெட், ஹை-வேஸ்ட், சல்வார், பாட்டியாலா)',
      'டார்ட் கையாளுதல், ஆர்ம்ஹோல் வடிவம் & பிரின்சஸ் கட் தையல்கள்',
      'குறைபாடற்ற பொருத்தம், தோரணை சரிசெய்தல் & மாற்றங்கள்',
      'துணி கணக்கீடு, கிரெயின்லைன்கள் & யார்டேஜ் திட்டமிடல்',
      'தொழில்துறை வேக முடித்தல் மற்றும் அயர்னிங் நுட்பங்கள்',
    ],
    pdf_name: 'Tamil_Designer_Studio_Intermediate_Course_Syllabus.pdf',
    pdf_size: 'Official Studio Syllabus',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'advanced',
    stage_key: 'advanced',
    level: 'Advanced',
    level_ta: 'மேம்பட்ட நிலை',
    title: 'Advanced Couture & Bridal Designer Masterclass',
    title_ta: 'மேம்பட்ட கௌட்டர் & பிரைடல் டிசைனர் மாஸ்டர் கிளாஸ்',
    badge: 'Stage 3 • Couture Mastery',
    badge_ta: 'நிலை 3 • கௌட்டர் மாஸ்டரி',
    duration: 'Professional Boutique Couture',
    duration_ta: 'தொழில்முறை பூட்டிக் கௌட்டர்',
    description: 'Bespoke designer blouses, bridal ensembles, circular maxis, saree-to-gown upcycling, corsetry, and boutique enterprise setup.',
    description_ta: 'தனிப்பயன் டிசைனர் ஜாக்கெட்டுகள், மணமகள் உடைகள், வட்ட மேக்ஸிகள், சேலை-முதல்-கவுன் மாற்றுதல், கார்செட்டரி மற்றும் பூட்டிக் நிறுவனம் அமைப்பு.',
    highlights: [
      '18 Bespoke designer blouse patterns (Sabyasachi, Katori, Boat Neck)',
      'Bridal blouse construction, cup padding & heavy silk handling',
      'Aari work & maggam embroidery layout coordination',
      'Floor-length circular maxis, tiered panels & saree-to-gown upcycling',
      'Western silhouettes: corsetry, jumpsuits, peplum & shirt collar',
      'Saree prepleating, box folding & boutique packaging mastery',
    ],
    highlights_ta: [
      '18 தனிப்பயன் டிசைனர் பிளவுஸ் பேட்டர்ன்கள் (சப்யசாச்சி, கடோரி, போட் நெக்)',
      'பிரைடல் பிளவுஸ் வடிவமைப்பு, கப் பேடிங் & ஹெவி பட்டு கையாளுதல்',
      'ஆரி வேலை & மக்கம் எம்பிராய்டரி தளவமைப்பு ஒருங்கிணைப்பு',
      'தரை நீள வட்ட மேக்ஸிகள், அடுக்கு பேனல்கள் & சேலை-முதல்-கவுன் மாற்றுதல்',
      'மேற்கத்திய உடைகள்: கார்செட், ஜம்ப்சூட், பெப்ளம் & ஷர்ட் காலர்',
      'சேலை முன்மடிப்பு, பாக்ஸ் ஃபோல்டிங் & பூட்டிக் பேக்கேஜிங் மாஸ்டரி',
    ],
    pdf_name: 'Tamil_Designer_Studio_Advanced_Course_Syllabus.pdf',
    pdf_size: 'Official Studio Syllabus',
    updated_at: new Date().toISOString(),
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
  STAGE_SYLLABUSES: 'tds_stage_syllabuses',
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
        if (error) throw error;
        if (data) {
          if (!activeOnly) {
            setLocalData(STORAGE_KEYS.COURSES, data);
          }
          return data as CourseItem[];
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
    if (isSupabaseConfigured && supabase) {
      if (courses.length > 0) {
        const { error } = await supabase
          .from('courses')
          .upsert(courses, { onConflict: 'id' });
        if (error) throw error;
      }

      const { data: existingCourses, error: fetchError } = await supabase
        .from('courses')
        .select('id');
      if (fetchError) throw fetchError;

      const retainedIds = new Set(courses.map((course) => course.id));
      const removedIds = (existingCourses || [])
        .map((course) => course.id as string)
        .filter((id) => !retainedIds.has(id));
      if (removedIds.length > 0) {
        const { error } = await supabase.from('courses').delete().in('id', removedIds);
        if (error) throw error;
      }
    }

    setLocalData(STORAGE_KEYS.COURSES, courses);
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

  async getStageSyllabuses(): Promise<CourseStageSyllabus[]> {
    const cached = getLocalData<CourseStageSyllabus[]>(
      STORAGE_KEYS.STAGE_SYLLABUSES,
      DEFAULT_STAGE_SYLLABUSES
    );

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('course_stage_syllabuses')
          .select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          const savedStages = new Map(
            (data as CourseStageSyllabus[]).map((stage) => [stage.id, stage])
          );
          const cloudStages = DEFAULT_STAGE_SYLLABUSES.map((defaultStage) => ({
            ...defaultStage,
            ...savedStages.get(defaultStage.id),
          }));
          setLocalData(
            STORAGE_KEYS.STAGE_SYLLABUSES,
            cloudStages.map((stage) => ({
              ...stage,
              pdf_url: stage.pdf_url?.startsWith('http') ? stage.pdf_url : '',
            }))
          );
          return cloudStages;
        }
      } catch (err) {
        console.warn('Supabase stage syllabus fetch failed:', err);
      }
    }

    return Promise.all(
      cached.map(async (stage) => {
        if (!stage.pdf_url) {
          const storedPdf = await getPdfFromStorage(stage.id);
          if (storedPdf) return { ...stage, pdf_url: storedPdf };
        }
        return stage;
      })
    );
  },

  async saveStageSyllabuses(stages: CourseStageSyllabus[]): Promise<CourseStageSyllabus[]> {
    if (isSupabaseConfigured && supabase) {
      const cloudStages = stages.map((stage) => ({
        ...stage,
        pdf_url: stage.pdf_url?.startsWith('http') ? stage.pdf_url : null,
        updated_at: stage.updated_at || new Date().toISOString(),
      }));
      const { error } = await supabase
        .from('course_stage_syllabuses')
        .upsert(cloudStages, { onConflict: 'id' });
      if (error) throw error;
    }

    const metadataOnly = stages.map((s) => ({
      ...s,
      pdf_url: s.pdf_url && s.pdf_url.startsWith('http') ? s.pdf_url : '', // keep remote URLs, strip data URLs from LS
    }));
    setLocalData(STORAGE_KEYS.STAGE_SYLLABUSES, metadataOnly);

    for (const stage of stages) {
      if (stage.pdf_url?.startsWith('data:')) {
        await savePdfToStorage(stage.id, stage.pdf_url);
      } else {
        await removePdfFromStorage(stage.id);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('tds_stage_syllabuses_updated', { detail: stages })
      );
    }

    return stages;
  },

  async uploadStageSyllabusPdf(
    stageId: string,
    file: File
  ): Promise<{ pdf_url: string; pdf_name: string; pdf_size: string }> {
    if (!file) throw new Error('No PDF file provided');
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      throw new Error('Please select a valid PDF file (.pdf)');
    }

    const fileSizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    // Try Supabase Storage if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const cleanName = `${stageId}_syllabus_${Date.now()}.pdf`;
        const { error } = await supabase.storage
          .from('studio-images')
          .upload(cleanName, file, {
            contentType: 'application/pdf',
            cacheControl: '0',
            upsert: true,
          });

        if (error) throw error;
        const publicUrl = supabase.storage
          .from('studio-images')
          .getPublicUrl(cleanName).data.publicUrl;
        return {
          pdf_url: publicUrl,
          pdf_name: file.name,
          pdf_size: fileSizeFormatted,
        };
      } catch (err) {
        console.error('Supabase PDF upload failed:', err);
        throw new Error(`Cloud PDF upload failed: ${getErrorMessage(err)}`);
      }
    }

    // Convert file to Base64 Data URL and save in IndexedDB
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          await savePdfToStorage(stageId, dataUrl);
          resolve({
            pdf_url: dataUrl,
            pdf_name: file.name,
            pdf_size: fileSizeFormatted,
          });
        } catch (storageErr) {
          reject(storageErr);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read the PDF file.'));
      reader.readAsDataURL(file);
    });
  },

  async deleteStageSyllabusPdf(stageId: string): Promise<void> {
    await removePdfFromStorage(stageId);
  },
};
