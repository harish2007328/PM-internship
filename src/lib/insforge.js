import { createClient } from '@insforge/sdk';

const baseUrl = "https://74jktci8.us-east.insforge.app";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMDI4MDR9.X4tjuf0m-Oe1KRNKwuu_Wjng677XzohgwZLGMVVKzQM";

export const insforge = createClient({
  baseUrl: baseUrl,
  anonKey: anonKey
});
