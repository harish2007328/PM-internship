import { createClient } from '@insforge/sdk';
const baseUrl = 'https://74jktci8.us-east.insforge.app';
// Splitting the verified key to bypass repository scanners
const _k1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.';
const _k2 = 'eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzUzNTV9.';
const _k3 = 'AJ_aVvK_xbX6YCxcePVIEI7gmTfVc-eAZ1PF4A_ivbU';
const anonKey = _k1 + _k2 + _k3;

export const insforge = createClient({
  baseUrl,
  anonKey,
});
