import { createFileRoute, Outlet } from "@tanstack/react-router"
import { ProtectedRoute } from "@/features/auth"

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
	return (
		<ProtectedRoute>
			<Outlet />
		</ProtectedRoute>
	)
}
