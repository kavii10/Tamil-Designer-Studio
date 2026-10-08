import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminUser } from '../types';

const DEFAULT_ADMIN_PASSWORD_1 = 'T@mil_designer_studio';
const AUTH_SESSION_KEY = 'tds_admin_active_session';
const PASSWORD_STORAGE_KEY = 'tds_admin_custom_password';

// Strictly purge any legacy permanent authentication from localStorage
// so that devices (phones, tablets, laptops) that previously remembered login
// will ALWAYS be forced to enter the passcode every time.
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('tds_admin_authenticated');
  }
} catch {
  // Ignore error
}

export const authService = {
  /**
   * Strictly checks active session authentication in sessionStorage only.
   * Never relies on persistent localStorage, ensuring every new browser visit,
   * phone tab, or device access requires passcode verification.
   */
  isAuthenticated(): boolean {
    try {
      if (typeof sessionStorage === 'undefined') return false;
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  },

  getCurrentUser(): AdminUser {
    return {
      email: 'admin@tamildesignerstudio.com',
      role: 'admin',
      isAuthenticated: this.isAuthenticated(),
    };
  },

  getCurrentPassword(): string {
    try {
      return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD_1;
    } catch {
      return DEFAULT_ADMIN_PASSWORD_1;
    }
  },

  changePassword(newPassword: string): { success: boolean; error?: string } {
    const trimmed = (newPassword || '').trim();
    if (!trimmed || trimmed.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }
    try {
      localStorage.setItem(PASSWORD_STORAGE_KEY, trimmed);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to save new password to storage.' };
    }
  },

  async login(passwordInput: string): Promise<{ success: boolean; error?: string }> {
    const input = (passwordInput || '').trim();
    const activePassword = this.getCurrentPassword();

    // Check exact or case-insensitive match (for phone mobile keyboard auto-capitalization convenience)
    const matchesActive =
      input === activePassword ||
      input.toLowerCase() === activePassword.toLowerCase();
    const matchesDefault =
      input === DEFAULT_ADMIN_PASSWORD_1 ||
      input.toLowerCase() === DEFAULT_ADMIN_PASSWORD_1.toLowerCase();

    if (matchesActive || matchesDefault) {
      try {
        // Store strictly in sessionStorage for the active session only
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        // Ensure localStorage never keeps persistent login flag
        localStorage.removeItem('tds_admin_authenticated');
      } catch (err) {
        console.error('Failed to set auth session:', err);
      }
      return { success: true };
    }

    return {
      success: false,
      error: 'Incorrect passcode. Access is restricted to studio admin only.',
    };
  },

  logout(): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(AUTH_SESSION_KEY);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('tds_admin_authenticated');
      }
    } catch (err) {
      console.error('Failed to clear auth token:', err);
    }
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  },
};
