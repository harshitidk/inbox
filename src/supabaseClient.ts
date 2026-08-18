import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file for Admin/backend features to work.');
}

const createStubClient = (): SupabaseClient => {
  const notConfiguredError = new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');

  const makeStub = (): any => {
    const target = function () {};
    return new Proxy(target, {
      get() {
        return makeStub();
      },
      apply() {
        return Promise.reject(notConfiguredError);
      },
    });
  };

  return makeStub();
};

export const supabase: SupabaseClient = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createStubClient();
