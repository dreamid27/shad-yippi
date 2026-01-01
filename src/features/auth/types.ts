// User entity
export interface User {
	id: number;
	email: string;
	name: string;
	phone?: string;
	role: "customer" | "admin";
	is_active: boolean;
}

// Auth tokens
export interface AuthTokens {
	access_token: string;
	refresh_token: string;
	expires_in: number;
}

// API request types
export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
	phone?: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RefreshTokenRequest {
	refresh_token: string;
}

// API response types
export interface AuthResponse {
	user: {
		id: number;
		email: string;
		name: string;
		phone: string;
		role: string;
		is_active: boolean;
	};
	access_token: string;
	refresh_token: string;
	expires_in: number;
}

// Auth state
export interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}
