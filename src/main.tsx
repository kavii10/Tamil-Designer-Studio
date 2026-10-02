import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// One-time cleanup of obsolete cached URL and seed data
(function cleanLegacyCache() {
  const CORRECT_MAPS_URL =
    "https://www.google.com/maps/place/11%C2%B003'18.8%22N+77%C2%B003'52.4%22E/@11.0552243,77.0619922,17z/data=!3m1!4b1!4m4!3m3!8m2!3d11.0552243!4d77.0645671?hl=en&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D";

  try {
    const raw = localStorage.getItem('tds_business_settings');
    if (raw) {
      const settings = JSON.parse(raw);
      if (
        settings.maps_url &&
        (settings.maps_url.includes('Peelamedu') ||
          settings.maps_url.includes('641004') ||
          settings.maps_url.includes('maps.google.com/?q='))
      ) {
        settings.maps_url = CORRECT_MAPS_URL;
        localStorage.setItem('tds_business_settings', JSON.stringify(settings));
      }
    }

    // Refresh courses cache if still holding old generic 4 courses
    const coursesRaw = localStorage.getItem('tds_courses');
    if (coursesRaw) {
      try {
        const parsed = JSON.parse(coursesRaw);
        if (parsed.length <= 4 || !parsed.some((c: any) => c.title && c.title.includes('Blouse Variations'))) {
          localStorage.removeItem('tds_courses');
        }
      } catch {
        localStorage.removeItem('tds_courses');
      }
    }
  } catch (e) {
    console.warn('[TDS] Legacy cache check error', e);
  }
})();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
