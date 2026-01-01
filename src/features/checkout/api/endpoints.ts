/**
 * Checkout API Endpoints
 * Phase 3: Checkout & Payment System
 */

export const CHECKOUT_ENDPOINTS = {
	// Address endpoints
	ADDRESSES: "/api/addresses",
	ADDRESS_BY_ID: (id: string) => `/api/addresses/${id}`,
	ADDRESS_DEFAULT: (id: string) => `/api/addresses/${id}/default`,

	// Shipping endpoints
	PROVINCES: "/api/shipping/provinces",
	PROVINCE_BY_ID: (id: string) => `/api/shipping/provinces/${id}`,
	CITIES: "/api/shipping/cities",
	CITY_BY_ID: (id: string) => `/api/shipping/cities/${id}`,
	CITIES_BY_PROVINCE: (provinceId: string) =>
		`/api/shipping/provinces/${provinceId}/cities`,
	SHIPPING_COST: "/api/shipping/cost",

	// Order endpoints
	ORDERS: "/api/orders",
	ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
	ORDER_CANCEL: (id: string) => `/api/orders/${id}/cancel`,

	// Payment endpoints
	PAYMENT_INIT: (orderId: string) => `/api/payments/${orderId}`,
	PAYMENT_STATUS: (id: string) => `/api/payments/${id}/status`,
	PAYMENT_WEBHOOK: "/api/payments/webhook",

	// Voucher endpoints
	VOUCHER_VALIDATE: "/api/vouchers/validate",
} as const;
