import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
});

// ✅ Session check function
export async function getValidSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error:', error.message);
      await supabase.auth.signOut();
      return null;
    }

    if (!data.session) {
      console.warn('No active session found');
      await supabase.auth.signOut();
      return null;
    }

    return data.session;
  } catch (err) {
    console.error('Unexpected auth error:', err);
    await supabase.auth.signOut();
    return null;
  }
}