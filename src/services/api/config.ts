/**
 * API Configuration
 * Centralized configuration for API base URL and related settings
 */

// Vite exposes environment variables with VITE_ prefix to the client
export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8089";

// Type-safe API base URL accessor
export function getApiBaseUrl(): string {
	return API_BASE_URL;
}
