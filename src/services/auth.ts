import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminUser } from '../types';

const DEFAULT_ADMIN_PASSWORD_1 = 't@mil_designer_studio';
const DEFAULT_ADMIN_PASSWORD_2 = 't@mil_designer_studioas';
const AUTH_STORAGE_KEY = 'tds_admin_authenticated';
const PASSWORD_STORAGE_KEY = 'tds_admin_custom_password';

export const authService = {
  isAuthenticated(): boolean {
    try {
      return (
        sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
        localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
      );
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
    } catch (err) {
      return { success: false, error: 'Failed to save new password to storage.' };
    }
  },

  async login(passwordInput: string): Promise<{ success: boolean; error?: string }> {
    const input = (passwordInput || '').trim();
    const activePassword = this.getCurrentPassword();

    if (
      input === activePassword ||
      input === DEFAULT_ADMIN_PASSWORD_1 ||
      input === DEFAULT_ADMIN_PASSWORD_2
    ) {
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      } catch (err) {
        console.error('Failed to set auth token:', err);
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
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear auth token:', err);
    }
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  },
};
