import { Link } from "@tanstack/react-router";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/features/auth/store/auth-store";

export function AuthButton() {
	const { isAuthenticated, user } = useAuth();
	const clearAuth = useAuthStore((state) => state.clearAuth);
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = () => {
		clearAuth();
		setIsOpen(false);
		// Optionally redirect to home
		window.location.href = "/";
	};

	// Not authenticated - show Login button
	if (!isAuthenticated) {
		return (
			<Link to="/login">
				<Button
					variant="outline"
					className="border-white text-white hover:bg-white hover:text-black px-6 py-2 rounded-none text-sm font-medium tracking-wide"
				>
					LOGIN
				</Button>
			</Link>
		);
	}

	// Authenticated - show user menu
	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors"
				aria-label="User menu"
				aria-expanded={isOpen}
			>
				<div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
					<User className="w-4 h-4" />
				</div>
				<span className="hidden md:inline text-sm font-medium">
					{user?.name || user?.email?.split("@")[0] || "ACCOUNT"}
				</span>
				<ChevronDown
					className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-black border border-white/20 rounded-lg shadow-xl py-2 z-50">
					<div className="px-4 py-2 border-b border-white/10">
						<p className="text-sm font-medium">
							{user?.name || user?.email || "User"}
						</p>
						{user?.email && (
							<p className="text-xs text-gray-400 mt-1">{user.email}</p>
						)}
					</div>

					<div className="py-2">
						<Link
							to="/profile"
							className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							<User className="w-4 h-4" />
							<span>Profile</span>
						</Link>
						<Link
							to="/orders"
							className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							<span>Orders</span>
						</Link>
					</div>

					<div className="border-t border-white/10 pt-2">
						<button
							type="button"
							onClick={handleLogout}
							className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
						>
							<LogOut className="w-4 h-4" />
							<span>Logout</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
