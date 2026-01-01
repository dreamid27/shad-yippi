import { useAuthStore } from "../store/auth-store";

export function useAuth() {
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isLoading = useAuthStore((state) => state.isLoading);
	const error = useAuthStore((state) => state.error);

	return {
		user,
		isAuthenticated,
		isLoading,
		error,
		isAdmin: user?.role === "admin",
		isCustomer: user?.role === "customer",
	};
}
