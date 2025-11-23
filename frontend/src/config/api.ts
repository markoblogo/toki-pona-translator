/**
 * API Configuration
 * 
 * The API base URL is determined by the VITE_API_BASE_URL environment variable.
 * If not set, it defaults to http://localhost:3000 for local development.
 * 
 * For production, set VITE_API_BASE_URL in your deployment environment.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
