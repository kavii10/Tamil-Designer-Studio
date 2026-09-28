import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ─── CRITICAL: Force-patch localStorage BEFORE React mounts ───────────────
// This runs synchronously on every page load, guaranteeing the correct
// GPS-pinned maps URL is always used, regardless of what is cached.
(function patchMapsUrl() {
  const CORRECT_MAPS_URL =
    "https://www.google.com/maps/place/11%C2%B003'18.8%22N+77%C2%B003'52.4%22E/@11.0552243,77.0619922,17z/data=!3m1!4b1!4m4!3m3!8m2!3d11.0552243!4d77.0645671?hl=en&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D";

  try {
    const raw = localStorage.getItem('tds_business_settings');
    if (raw) {
      const settings = JSON.parse(raw);
      if (settings.maps_url !== CORRECT_MAPS_URL) {
        settings.maps_url = CORRECT_MAPS_URL;
        localStorage.setItem('tds_business_settings', JSON.stringify(settings));
        console.log('[TDS] maps_url patched to correct GPS location');
      }
    }
  } catch (e) {
    console.warn('[TDS] Could not patch maps_url in localStorage', e);
  }
})();
// ─────────────────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
