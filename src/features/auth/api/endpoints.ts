const API_BASE_URL = "http://localhost:8089"

export const authEndpoints = {
	register: `${API_BASE_URL}/auth/register`,
	login: `${API_BASE_URL}/auth/login`,
	refresh: `${API_BASE_URL}/auth/refresh`,
	logout: `${API_BASE_URL}/auth/logout`,
	me: `${API_BASE_URL}/auth/me`,
} as const
