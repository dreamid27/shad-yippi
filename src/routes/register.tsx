import { createFileRoute, Link } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

function RegisterPage() {
	return (
		<div className="min-h-screen bg-black flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<Link to="/" className="text-3xl font-black tracking-tighter">
						SHAD YIPPI
					</Link>
				</div>
				<RegisterForm />
			</div>
		</div>
	);
}
