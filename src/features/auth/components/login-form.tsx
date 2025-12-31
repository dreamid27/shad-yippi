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
					navigate({ to: "/" });
				},
			},
		);
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription>
					Enter your email and password to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{login.isError && (
						<p className="text-sm text-red-500">{login.error?.message}</p>
					)}
					<Button type="submit" className="w-full" disabled={login.isPending}>
						{login.isPending ? "Logging in..." : "Login"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
