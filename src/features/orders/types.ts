/**
 * Orders Feature Types
 * Phase 3: Checkout & Payment System
 */

// Re-export common types from checkout
export type {
	Address,
	Order,
	OrderItem,
	OrderStatus,
	Payment,
	PaymentMethod,
	PaymentStatus,
	CreateOrderRequest,
	CancelOrderRequest,
} from "../checkout/types";

// ============================================================================
// ORDER HISTORY TYPES
// ============================================================================

export interface OrderListFilters {
	status?: OrderStatus;
	search?: string;
	page?: number;
	limit?: number;
}

export interface OrderCard {
	id: string;
	order_number: string;
	created_at: string;
	status: OrderStatus;
	total: number;
	item_count: number;
}

export interface OrderListState {
	orders: OrderCard[];
	filters: OrderListFilters;
	loading: boolean;
	error?: string;
	pagination: {
		page: number;
		limit: number;
		total: number;
		total_pages: number;
	};
}

// ============================================================================
// ORDER DETAIL TYPES
// ============================================================================

export interface OrderDetail extends Order {
	shipping_address: Address;
	items: OrderItem[];
	payment: Payment;
}

export interface OrderTimelineEvent {
	status: OrderStatus;
	label: string;
	timestamp?: string;
	description?: string;
	completed: boolean;
	current: boolean;
}

export interface OrderTimeline {
	events: OrderTimelineEvent[];
	current_status: OrderStatus;
}

// ============================================================================
// ORDER ACTIONS TYPES
// ============================================================================

export interface OrderActions {
	can_cancel: boolean;
	can_track: boolean;
	can_download_invoice: boolean;
	can_retry_payment: boolean;
}

export interface CancelOrderState {
	loading: boolean;
	error?: string;
	success: boolean;
}
