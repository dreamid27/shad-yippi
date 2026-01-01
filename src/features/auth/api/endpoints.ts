import { API_BASE_URL } from "@/services/api/config";

export const authEndpoints = {
	register: `${API_BASE_URL}/api/auth/register`,
	login: `${API_BASE_URL}/api/auth/login`,
	refresh: `${API_BASE_URL}/api/auth/refresh`,
	logout: `${API_BASE_URL}/api/auth/logout`,
	me: `${API_BASE_URL}/api/auth/me`,
} as const;
