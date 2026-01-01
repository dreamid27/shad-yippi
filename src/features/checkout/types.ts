/**
 * Checkout Feature Types
 * Phase 3: Checkout & Payment System
 */

// ============================================================================
// ADDRESS TYPES
// ============================================================================

export interface Address {
	id: string;
	user_id: string;
	label: string;
	recipient_name: string;
	phone: string;
	address_line1: string;
	address_line2?: string;
	province_id: string;
	province_name: string;
	city_id: string;
	city_name: string;
	district?: string;
	postal_code: string;
	is_default: boolean;
	is_deleted: boolean;
	created_at: string;
	updated_at: string;
}

export interface CreateAddressRequest {
	label: string;
	recipient_name: string;
	phone: string;
	address_line1: string;
	address_line2?: string;
	province_id: string;
	province_name: string;
	city_id: string;
	city_name: string;
	district?: string;
	postal_code: string;
	is_default: boolean;
}

export interface UpdateAddressRequest {
	label?: string;
	recipient_name?: string;
	phone?: string;
	address_line1?: string;
	address_line2?: string;
	province_id?: string;
	province_name?: string;
	city_id?: string;
	city_name?: string;
	district?: string;
	postal_code?: string;
	is_default?: boolean;
}

export interface AddressValidationError {
	field: keyof CreateAddressRequest;
	message: string;
}

// ============================================================================
// SHIPPING TYPES
// ============================================================================

export interface Province {
	province_id: string;
	province: string;
}

export interface City {
	city_id: string;
	province_id: string;
	province: string;
	type: string;
	city_name: string;
	postal_code: string;
}

export interface ShippingCostRequest {
	origin_city_id: string;
	destination_city_id: string;
	weight: number;
	courier?: string;
}

export interface ShippingCostResult {
	courier_code: string;
	courier_name: string;
	service: string;
	description: string;
	cost: number;
	eta_days: string;
}

export interface ShippingMethod {
	courier_code: string;
	courier_name: string;
	service: string;
	description: string;
	cost: number;
	eta_days: string;
	is_cheapest?: boolean;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export type PaymentMethod =
	| "va_bca"
	| "va_mandiri"
	| "va_bni"
	| "va_bri"
	| "gopay"
	| "ovo"
	| "dana"
	| "shopeepay"
	| "qris"
	| "credit_card"
	| "cod";

export type PaymentStatus =
	| "pending"
	| "processing"
	| "success"
	| "failed"
	| "expired"
	| "cancelled";

export interface Payment {
	id: string;
	order_id: string;
	method: PaymentMethod;
	status: PaymentStatus;
	amount: number;
	midtrans_transaction_id?: string;
	midtrans_payment_type?: string;
	va_number?: string;
	va_bank?: string;
	payment_url?: string;
	expires_at?: string;
	paid_at?: string;
	failure_reason?: string;
	raw_midtrans_response?: Record<string, unknown>;
	created_at: string;
	updated_at: string;
}

export interface PaymentMethodDetails {
	method: PaymentMethod;
	name: string;
	icon: string;
	color?: string;
	instructions?: string;
	account_number?: string;
	account_name?: string;
}

// ============================================================================
// VOUCHER TYPES
// ============================================================================

export interface VoucherValidationRequest {
	code: string;
	subtotal: number;
}

export interface VoucherValidationResponse {
	valid: boolean;
	discount: number;
	discount_type: "fixed" | "percentage";
	max_discount?: number;
	message?: string;
}

export interface AppliedVoucher {
	code: string;
	discount: number;
	discount_type: "fixed" | "percentage";
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus =
	| "pending_payment"
	| "payment_verified"
	| "processing"
	| "shipped"
	| "delivered"
	| "completed"
	| "cancelled";

export interface OrderItem {
	id: string;
	order_id: string;
	product_id: string;
	product_variant_id: string;
	product_name: string;
	product_variant_attributes: Record<string, string>;
	product_image_url?: string;
	sku: string;
	quantity: number;
	price: number;
	subtotal: number;
}

export interface Order {
	id: string;
	order_number: string;
	user_id: string;
	status: OrderStatus;
	shipping_address_id: string;
	courier?: string;
	courier_service?: string;
	shipping_cost: number;
	tracking_number?: string;
	subtotal: number;
	discount: number;
	tax: number;
	total: number;
	notes?: string;
	metadata?: Record<string, unknown>;
	cancelled_at?: string;
	cancellation_reason?: string;
	shipped_at?: string;
	delivered_at?: string;
	completed_at?: string;
	created_at: string;
	updated_at: string;
	shipping_address?: Address;
	items?: OrderItem[];
	payment?: Payment;
}

export interface CreateOrderRequest {
	shipping_address_id: string;
	courier: string;
	courier_service: string;
	shipping_cost: number;
	payment_method: PaymentMethod;
	voucher_code?: string;
	notes?: string;
	metadata?: Record<string, unknown>;
}

export interface CancelOrderRequest {
	reason: string;
}

// ============================================================================
// CHECKOUT FLOW TYPES
// ============================================================================

export interface CheckoutDraft {
	selected_address_id?: string;
	selected_shipping?: {
		courier_code: string;
		service: string;
		cost: number;
		eta_days: string;
	};
	selected_payment_method?: PaymentMethod;
	applied_voucher?: AppliedVoucher;
	terms_accepted?: boolean;
}

export interface CheckoutStep {
	step: 1 | 2 | 3 | 4;
	title: string;
	description: string;
	completed: boolean;
	valid: boolean;
}

export interface CheckoutState {
	current_step: 1 | 2 | 3 | 4;
	draft: CheckoutDraft;
	steps: CheckoutStep[];
	loading: boolean;
	error?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
	data: T;
	message?: string;
	error?: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		total_pages: number;
	};
}

export interface ApiError {
	error: string;
	message: string;
	details?: Record<string, unknown>;
}

// ============================================================================
// CART INTEGRATION TYPES
// ============================================================================

export interface CartItem {
	id: string;
	cart_id: string;
	product_variant_id: string;
	quantity: number;
	price_snapshot: number;
	subtotal: number;
	product_variant?: {
		id: string;
		sku: string;
		attributes: Record<string, string>;
		stock_quantity: number;
		price: number;
		final_price: number;
		is_active: boolean;
		is_in_stock: boolean;
	};
	product?: {
		id: string;
		name: string;
		slug: string;
		image_urls: string[];
	};
}

export interface CartValidationResult {
	valid: boolean;
	errors: CartValidationError[];
}

export interface CartValidationError {
	cart_item_id: string;
	variant_id: string;
	available: number;
	in_cart: number;
	error: string;
}

export interface CartTotals {
	subtotal: number;
	weight: number;
	item_count: number;
}
