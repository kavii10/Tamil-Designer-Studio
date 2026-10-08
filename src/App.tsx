import React, { useState, useEffect } from 'react';
import { PublicStudioPage } from './pages/PublicStudioPage';
import { QRRedirectPage } from './pages/QRRedirectPage';
import { ErrorFallbackPage } from './pages/ErrorFallbackPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout, AdminTab } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminQRCodes } from './pages/admin/AdminQRCodes';
import { AdminBusinessProfile } from './pages/admin/AdminBusinessProfile';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';
import { authService } from './services/auth';
import { Lang } from './i18n/translations';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [authKey, setAuthKey] = useState<number>(0);
  const [adminLang, setAdminLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('tds_admin_edit_lang') as Lang) || 'en';
    } catch {
      return 'en';
    }
  });

  const handleAdminLangChange = (l: Lang) => {
    setAdminLang(l);
    try {
      localStorage.setItem('tds_admin_edit_lang', l);
    } catch {}
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Strict Security: Whenever leaving admin portal, immediately lock and require passcode for next visit
  useEffect(() => {
    if (!currentPath.startsWith('/admin')) {
      authService.logout();
    }
  }, [currentPath]);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // 1. DYNAMIC QR REDIRECT ROUTE: /qr/:slug
  const qrMatch = currentPath.match(/^\/qr\/([a-zA-Z0-9-_]+)/);
  if (qrMatch) {
    const slug = qrMatch[1];
    return <QRRedirectPage slug={slug} />;
  }

  // 2. ERROR FALLBACK PAGE: /error
  if (currentPath === '/error') {
    return <ErrorFallbackPage />;
  }

  // 3. ADMIN PORTAL ROUTE: /admin (Protected with password t@mil_designer_studio)
  if (currentPath.startsWith('/admin')) {
    const isAuthed = authService.isAuthenticated();

    if (!isAuthed) {
      return (
        <AdminLogin
          onSuccess={() => {
            setAuthKey((k) => k + 1);
            navigate('/admin');
          }}
        />
      );
    }

    return (
      <AdminLayout
        key={`admin-${authKey}`}
        currentTab={adminTab}
        onTabChange={(tab) => setAdminTab(tab)}
        editLang={adminLang}
        onLangChange={handleAdminLangChange}
        onLogout={() => {
          authService.logout();
          setAuthKey((k) => k + 1);
          navigate('/admin');
        }}
      >
        {adminTab === 'dashboard' && <AdminDashboard onNavigateToTab={setAdminTab} />}
        {adminTab === 'qrcodes' && <AdminQRCodes />}
        {adminTab === 'profile' && (
          <AdminBusinessProfile editLang={adminLang} onLangChange={handleAdminLangChange} />
        )}
        {adminTab === 'courses' && (
          <AdminCourses editLang={adminLang} onLangChange={handleAdminLangChange} />
        )}
        {adminTab === 'services' && (
          <AdminServices editLang={adminLang} onLangChange={handleAdminLangChange} />
        )}
        {adminTab === 'analytics' && <AdminAnalytics />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // 4. PUBLIC DIGITAL VISITING CARD & STUDIO DASHBOARD: /tamil-designer-studio (and default /)
  return <PublicStudioPage />;
};

export default App;
