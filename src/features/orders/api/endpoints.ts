/**
 * Orders API Endpoints
 * Phase 3: Checkout & Payment System
 */

export const ORDER_ENDPOINTS = {
	// Order endpoints
	ORDERS: "/api/orders",
	ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
	ORDER_CANCEL: (id: string) => `/api/orders/${id}/cancel`,

	// Payment endpoints (re-exported from checkout for convenience)
	PAYMENT_STATUS: (id: string) => `/api/payments/${id}/status`,
} as const;
