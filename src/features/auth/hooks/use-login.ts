import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../api/client"
import { useAuthStore } from "../store/auth-store"
import type { LoginRequest } from "../types"

export function useLogin() {
	const setAuth = useAuthStore((state) => state.setAuth)
	const setError = useAuthStore((state) => state.setError)
	const setLoading = useAuthStore((state) => state.setLoading)

	return useMutation({
		mutationFn: (data: LoginRequest) => loginUser(data),
		onMutate: () => {
			setLoading(true)
			setError(null)
		},
		onSuccess: (response) => {
			const user = {
				id: response.user.id,
				email: response.user.email,
				name: response.user.name,
				phone: response.user.phone,
				role: response.user.role as "customer" | "admin",
				is_active: response.user.is_active,
			}
			setAuth(user, response.access_token, response.refresh_token)
			setLoading(false)
		},
		onError: (error: Error) => {
			setError(error.message)
			setLoading(false)
		},
	})
}
