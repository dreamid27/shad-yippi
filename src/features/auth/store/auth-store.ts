import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthState, User } from "../types";

interface AuthActions {
	setAuth: (user: User, accessToken: string, refreshToken: string) => void;
	clearAuth: () => void;
	setUser: (user: User) => void;
	setAccessToken: (token: string) => void;
	setError: (error: string | null) => void;
	setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
};

export const useAuthStore = create<AuthStore>()(
	devtools(
		persist(
			(set) => ({
				...initialState,

				setAuth: (user, accessToken, refreshToken) =>
					set({
						user,
						accessToken,
						refreshToken,
						isAuthenticated: true,
						error: null,
					}),

				clearAuth: () =>
					set({
						...initialState,
					}),

				setUser: (user) => set({ user }),

				setAccessToken: (token) => set({ accessToken: token }),

				setError: (error) => set({ error, isLoading: false }),

				setLoading: (loading) => set({ isLoading: loading }),
			}),
			{
				name: "auth-storage",
				partialize: (state) => ({
					user: state.user,
					accessToken: state.accessToken,
					refreshToken: state.refreshToken,
					isAuthenticated: state.isAuthenticated,
				}),
			},
		),
		{ name: "AuthStore" },
	),
);
