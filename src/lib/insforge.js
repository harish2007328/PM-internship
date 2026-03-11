import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_URL;
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

if (!baseUrl || !anonKey) {
  console.warn('InsForge configuration missing in .env file');
}

export const insforge = createClient({
  baseUrl,
  anonKey
});
