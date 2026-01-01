import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "../hooks/use-login";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const login = useLogin();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		login.mutate(
			{ email, password },
			{
				onSuccess: () => {
					toast.success("Login successful! Welcome back.");
					navigate({ to: "/" });
				},
				onError: (error) => {
					toast.error(error.message || "Login failed. Please try again.");
				},
			},
		);
	};

	return (
		<Card className="w-full max-w-md border-white/10 bg-black/50 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-2xl font-black tracking-tight">
					Welcome Back
				</CardTitle>
				<CardDescription className="text-gray-400">
					Enter your email and password to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email" className="text-gray-300">
							Email
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="bg-white/5 border-white/10"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password" className="text-gray-300">
							Password
						</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="bg-white/5 border-white/10"
						/>
					</div>
					<Button
						type="submit"
						className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-11 font-bold tracking-wide"
						disabled={login.isPending}
					>
						{login.isPending ? "Logging in..." : "LOGIN"}
					</Button>
					<p className="text-center text-sm text-gray-400">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-white hover:underline font-medium"
						>
							Register
						</Link>
					</p>
				</form>
			</CardContent>
		</Card>
	);
}
