import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth";
import { useCartStore } from "../store/cart-store";

/**
 * Hook to automatically sync guest cart with server cart on login
 *
 * Usage:
 * - Call this hook in root component (e.g., _app.tsx or main layout)
 * - Hook will automatically merge guest cart to server when user logs in
 * - Hook will load server cart when user is already logged in
 *
 * Behavior:
 * - On login: Merges guest cart (localStorage) with server cart
 * - On refresh (already logged in): Loads server cart
 * - On logout: Resets sync flag for next login
 */
export function useCartSync() {
	const { isAuthenticated, accessToken } = useAuthStore();
	const { syncCart, loadCart, guestCart } = useCartStore();
	const hasTriggeredSync = useRef(false);
	const previousAuthState = useRef(isAuthenticated);

	useEffect(() => {
		// Case 1: User just logged in (transition from unauthenticated to authenticated)
		if (
			isAuthenticated &&
			accessToken &&
			!previousAuthState.current &&
			!hasTriggeredSync.current
		) {
			// Trigger sync (merge guest cart to server)
			syncCart(accessToken);
			hasTriggeredSync.current = true;
		}

		// Case 2: User is already logged in on mount (refresh page while logged in)
		if (
			isAuthenticated &&
			accessToken &&
			previousAuthState.current &&
			!hasTriggeredSync.current
		) {
			// Just load server cart (no merge needed)
			loadCart(accessToken);
			hasTriggeredSync.current = true;
		}

		// Case 3: User logged out (reset sync flag)
		if (!isAuthenticated && previousAuthState.current) {
			hasTriggeredSync.current = false;
		}

		// Update previous auth state
		previousAuthState.current = isAuthenticated;
	}, [isAuthenticated, accessToken, syncCart, loadCart]);

	return {
		guestCartItemCount: guestCart.length,
	};
}
