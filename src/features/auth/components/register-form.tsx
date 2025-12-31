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
import { useRegister } from "../hooks/use-register";

export function RegisterForm() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		name: "",
		phone: "",
	});
	const navigate = useNavigate();
	const register = useRegister();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		register.mutate(formData, {
			onSuccess: () => {
				navigate({ to: "/" });
			},
		});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Create Account</CardTitle>
				<CardDescription>
					Enter your information to create a new account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="John Doe"
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone (optional)</Label>
						<Input
							id="phone"
							name="phone"
							type="tel"
							placeholder="+62812345678"
							value={formData.phone}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							value={formData.password}
							onChange={handleChange}
							required
							minLength={6}
						/>
					</div>
					{register.isError && (
						<p className="text-sm text-red-500">{register.error?.message}</p>
					)}
					<Button
						type="submit"
						className="w-full"
						disabled={register.isPending}
					>
						{register.isPending ? "Creating account..." : "Create Account"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
