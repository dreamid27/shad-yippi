import type {
	AuthResponse,
	LoginRequest,
	RefreshTokenRequest,
	RegisterRequest,
	User,
} from "../types"
import { authEndpoints } from "./endpoints"

// Register new user
export async function registerUser(
	data: RegisterRequest,
): Promise<AuthResponse> {
	const response = await fetch(authEndpoints.register, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || "Registration failed")
	}

	return response.json()
}

// Login user
export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
	const response = await fetch(authEndpoints.login, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || "Login failed")
	}

	return response.json()
}

// Refresh access token
export async function refreshAccessToken(
	refreshToken: string,
): Promise<AuthResponse> {
	const response = await fetch(authEndpoints.refresh, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refresh_token: refreshToken }),
	})

	if (!response.ok) {
		throw new Error("Token refresh failed")
	}

	return response.json()
}

// Logout user
export async function logoutUser(refreshToken: string): Promise<void> {
	await fetch(authEndpoints.logout, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refresh_token: refreshToken }),
	})
}

// Get current user
export async function getCurrentUser(accessToken: string): Promise<User> {
	const response = await fetch(authEndpoints.me, {
		headers: { Authorization: `Bearer ${accessToken}` },
	})

	if (!response.ok) {
		throw new Error("Failed to fetch user")
	}

	const data = await response.json()
	return data.user
}
