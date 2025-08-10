// For local dev you don't need to change these.
// When you deploy, set Vite envs (VITE_API_BASE, VITE_SOCKET_URL) and rebuild.
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
