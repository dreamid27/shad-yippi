import { createFileRoute } from "@tanstack/react-router"
import { LoginForm } from "@/features/auth"

export const Route = createFileRoute("/login")({
	component: LoginPage,
})

function LoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<LoginForm />
		</div>
	)
}
