import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../api/client";
import { useAuthStore } from "../store/auth-store";

export function useLogout() {
	const refreshToken = useAuthStore((state) => state.refreshToken);
	const clearAuth = useAuthStore((state) => state.clearAuth);

	return useMutation({
		mutationFn: () => {
			if (!refreshToken) throw new Error("No refresh token");
			return logoutUser(refreshToken);
		},
		onSuccess: () => {
			clearAuth();
		},
		onError: () => {
			// Always clear auth even if logout fails
			clearAuth();
		},
	});
}
