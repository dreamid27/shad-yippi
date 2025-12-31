import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../api/client"
import { useAuthStore } from "../store/auth-store"
import type { RegisterRequest } from "../types"

export function useRegister() {
	const setAuth = useAuthStore((state) => state.setAuth)
	const setError = useAuthStore((state) => state.setError)
	const setLoading = useAuthStore((state) => state.setLoading)

	return useMutation({
		mutationFn: (data: RegisterRequest) => registerUser(data),
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
