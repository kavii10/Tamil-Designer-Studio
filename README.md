# TAMIL DESIGNER STUDIO — Dynamic QR Manager & Digital Business Card

> **"Wear Dreams, Not Just Clothes."**  
> *School of Fashion Design & Tailoring — Coimbatore*

A production-ready, mobile-first dynamic QR code management engine and luxury digital business card application engineered specifically for **Tamil Designer Studio**.

---

## 📌 Architecture & How It Works

Traditional QR generators bake the final URL (like an Instagram handle or WhatsApp link) directly into the QR image. If that link ever changes, thousands of physically printed visiting cards become useless and must be reprinted.

**Tamil Designer Studio Dynamic QR Manager solves this permanently:**

```
[ Physical Visiting Card QR ]
              │
              ▼
   GET /qr/tamil-designer-studio   (Permanent URL encoded into QR)
              │
   ┌──────────┴─────────────────────────┐
   │ Tamil Designer Studio Server       │
   │ 1. Matches slug in Database        │
   │ 2. Verifies active status          │
   │ 3. Logs anonymous device scan      │
   │ 4. Reads current target URL        │
   └──────────┬─────────────────────────┘
              │
   HTTP 302 / Immediate Redirect
              │
              ▼
    [ Current Live Destination ]
   - Month 1: /tamil-designer-studio (Digital Business Card)
   - Month 3: https://instagram.com/tamil_designer_studio
   - Month 6: https://wa.me/917845264168 (WhatsApp Inquiry)
   - Month 9: https://tamildesignerstudio.com/courses
```

### 💎 The Core Guarantee
* **The QR code graphic encodes ONLY the permanent redirect URL.**
* When the destination is changed in the Admin Dashboard, **the physical QR code remains 100% identical and unchanged**.
* Print thousands of visiting cards once — redirect them anytime, anywhere!

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Public Digital Visiting Card**: `http://localhost:3000/` or `/tamil-designer-studio`
- **Dynamic Permanent Redirect**: `http://localhost:3000/qr/tamil-designer-studio`
- **Admin Management Console**: `http://localhost:3000/admin`

---

## 🔐 Admin Dashboard & Credentials

To access the management console at `/admin`:
- **Default Passcode**: `studio78452`
- **Default Admin Email**: `admin@tamildesignerstudio.com`
- **One-Click Demo Fill**: Click the *"Fill Credentials"* button on the login screen.

### Admin Dashboard Capabilities
1. **Live Destination Changer**:
   - Change redirect target with 1 click.
   - Built-in URL validation to prevent malicious schemes.
   - Instant confirmation banner:
     > ✓ Destination updated successfully.  
     > ✓ Existing QR code remains unchanged.
   - Quick presets for Digital Card, WhatsApp, Instagram, and Google Maps.
2. **High-Resolution QR Downloads**:
   - **Print-Ready PNG**: 1024×1024 px at Level H error correction (30% recovery capability).
   - **Vector SVG**: Scalable vector format for commercial offset printing shops.
3. **Visiting Card Print Simulation**:
   - Photorealistic preview of the 3.5" × 2" physical visiting card with printed QR.
4. **Academy & Courses Manager**:
   - Edit syllabus and topics for Beginner, Intermediate, Advanced, Saree Prepleting, and Boutique Business Training.
5. **Tailoring Services Manager**:
   - Manage Custom Stitching, Alterations, Designer Wear, Bridal Stitching, and Women's Wear.
6. **Scan Analytics**:
   - Metrics for Total Scans, Today, This Week, and This Month.
   - Device distribution breakdown (Mobile Phone %, Tablet %, Desktop %).
   - 7-day daily activity chart and raw anonymous scan stream.

---

## 🗄️ Database & Cloud Deployment (Supabase)

The application features a **Dual Data Layer**:
- **Zero-Setup Local Persistence**: Works out of the box without any setup.
- **Supabase PostgreSQL Cloud**: Connect your free Supabase instance anytime.

### Connecting to Supabase
1. Create a free database at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and run the provided SQL script:
   ```bash
   supabase/schema.sql
   ```
   For an existing project, also run `supabase/storage_images.sql` once to configure public service-image storage.
3. Copy your project URL and Anon Key into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_APP_URL=https://your-deployed-domain.com
   VITE_ADMIN_PASSCODE=studio78452
   ```
4. Restart your application. It will automatically detect Supabase and transition from local mode to cloud mode!

---

## 🧪 Automated Testing

Run the automated verification suite to test the QR stability invariant, redirect logic, device classifier, and security rules:
```bash
npm test
```

### Verification Criteria Passed:
- [x] QR image buffer byte-for-byte constancy when destination changes
- [x] Vector SVG markup preservation
- [x] Dynamic redirect target resolution
- [x] Anonymous scan metrics logging & counters
- [x] Inactive QR interception and branded error fallback page
- [x] Device classification (Mobile / Tablet / Desktop)
- [x] URL sanitization and XSS prevention

---

## 📱 Mobile-First Public Digital Business Card

Located at `/tamil-designer-studio`:
- **Palette**: Luxury warm cream (`#FAF7F2`), beige (`#F3ECE2`), dark espresso brown (`#2D1E18`), and soft gold (`#C59B27`).
- **Touch-Friendly Buttons**:
  - `[ WhatsApp ]`: Direct chat with pre-filled inquiry message (`https://wa.me/917845264168`)
  - `[ Call Now ]`: One-tap direct call (`tel:+917845264168`)
  - `[ Instagram ]`: Studio profile (`@tamil_designer_studio`)
  - `[ Directions ]`: Google Maps location navigation to Chinniyampalayam, Coimbatore
  - `[ Save Contact ]`: Instant `.vcf` vCard download to save the studio directly into the visitor's smartphone contacts.
- **Curriculum & Services**: Pulls dynamically from the database.

---

## 🌐 Deploying to Free/Low-Cost Hosting

### Deploying to Vercel / Netlify
1. Push repository to GitHub.
2. Import project into Vercel or Netlify.
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Add Environment Variables from `.env.example`.

---

© 2026 Tamil Designer Studio. All Rights Reserved.
