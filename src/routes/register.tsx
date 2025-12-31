import { createFileRoute } from "@tanstack/react-router"
import { RegisterForm } from "@/features/auth"

export const Route = createFileRoute("/register")({
	component: RegisterPage,
})

function RegisterPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<RegisterForm />
		</div>
	)
}
