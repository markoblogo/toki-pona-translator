/**
 * API configuration:
 * - explicit VITE_API_BASE_URL wins
 * - local dev without env falls back to localhost backend
 * - production defaults to same-origin (/api/*)
 */
const envBase = import.meta.env.VITE_API_BASE_URL?.trim();
const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

export const API_BASE_URL = envBase
  ? envBase.replace(/\/+$/, "")
  : isLocalHost
    ? "http://localhost:3000"
    : "";
