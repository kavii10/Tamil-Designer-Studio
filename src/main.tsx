import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// One-time cleanup of obsolete cached URL if still lingering from early testing
(function cleanLegacyCache() {
  const CORRECT_MAPS_URL =
    "https://www.google.com/maps/place/11%C2%B003'18.8%22N+77%C2%B003'52.4%22E/@11.0552243,77.0619922,17z/data=!3m1!4b1!4m4!3m3!8m2!3d11.0552243!4d77.0645671?hl=en&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D";

  try {
    const raw = localStorage.getItem('tds_business_settings');
    if (raw) {
      const settings = JSON.parse(raw);
      // Only fix if it still has the old wrong Peelamedu or old query search pattern
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
  } catch (e) {
    console.warn('[TDS] Legacy cache check error', e);
  }
})();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
