import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminUser } from '../types';

export const authService = {
  // Password removed as requested by the business owner
  isAuthenticated(): boolean {
    return true;
  },

  getCurrentUser(): AdminUser {
    return {
      email: 'admin@tamildesignerstudio.com',
      role: 'admin',
      isAuthenticated: true,
    };
  },

  async login(_emailOrPass?: string, _password?: string): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  },

  logout(): void {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  },
};
