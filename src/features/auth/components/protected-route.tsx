import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/use-auth";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requireAdmin?: boolean;
}

export function ProtectedRoute({
	children,
	requireAdmin = false,
}: ProtectedRouteProps) {
	const { isAuthenticated, isAdmin, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate({ to: "/login" });
		}

		if (!isLoading && requireAdmin && !isAdmin) {
			navigate({ to: "/" });
		}
	}, [isAuthenticated, isAdmin, isLoading, requireAdmin, navigate]);

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p>Loading...</p>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	if (requireAdmin && !isAdmin) {
		return null;
	}

	return <>{children}</>;
}
