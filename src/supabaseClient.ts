import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file for Admin/backend features to work.');
}

const realClient = isConfigured ? createClient(supabaseUrl!, supabaseAnonKey!) : null;

const notConfiguredError = () => new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');

const createStub = (): any => {
  const handler: ProxyHandler<Function> = {
    get() {
      return createStub();
    },
    apply() {
      return Promise.reject(notConfiguredError());
    },
  };
  return new Proxy(function () {}, handler);
};

export const supabase = realClient ?? createStub();
