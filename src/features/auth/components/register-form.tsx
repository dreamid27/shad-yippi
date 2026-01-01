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
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

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
				toast.success("Account created successfully! Welcome to SHAD YIPPI.");
				navigate({ to: "/" });
			},
			onError: (error) => {
				toast.error(error.message || "Registration failed. Please try again.");
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
		<Card className="w-full max-w-md border-white/10 bg-black/50 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-2xl font-black tracking-tight">
					Create Account
				</CardTitle>
				<CardDescription className="text-gray-400">
					Enter your information to create a new account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name" className="text-gray-300">
							Full Name
						</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="John Doe"
							value={formData.name}
							onChange={handleChange}
							required
							className="bg-white/5 border-white/10"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email" className="text-gray-300">
							Email
						</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							value={formData.email}
							onChange={handleChange}
							required
							className="bg-white/5 border-white/10"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone" className="text-gray-300">
							Phone (optional)
						</Label>
						<Input
							id="phone"
							name="phone"
							type="tel"
							placeholder="+62812345678"
							value={formData.phone}
							onChange={handleChange}
							className="bg-white/5 border-white/10"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password" className="text-gray-300">
							Password
						</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							value={formData.password}
							onChange={handleChange}
							required
							minLength={6}
							className="bg-white/5 border-white/10"
						/>
					</div>
					<Button
						type="submit"
						className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-11 font-bold tracking-wide"
						disabled={register.isPending}
					>
						{register.isPending ? "Creating account..." : "CREATE ACCOUNT"}
					</Button>
					<p className="text-center text-sm text-gray-400">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-white hover:underline font-medium"
						>
							Login
						</Link>
					</p>
				</form>
			</CardContent>
		</Card>
	);
}
