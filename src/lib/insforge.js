import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_URL;
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

// Debugging: Log context (will be visible in browser console)
console.log('InsForge URL:', baseUrl);
console.log('Env Keys Found:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));

if (!baseUrl || !anonKey || baseUrl === 'undefined' || anonKey === 'undefined') {
  console.error('❌ InsForge configuration missing or invalid in .env file.');
  console.info('Ensure VITE_INSFORGE_URL and VITE_INSFORGE_ANON_KEY are set.');
}

export const insforge = createClient({
  baseUrl: baseUrl || 'https://invalid-config.insforge.app',
  anonKey: anonKey || 'missing-key'
});
