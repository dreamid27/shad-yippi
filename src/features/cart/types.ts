export interface CartItem {
	id: string
	quantity: number
	price_snapshot: number
	subtotal: number
	product_variant: {
		id: string
		sku: string
		attributes: Record<string, string>
		stock_quantity: number
		final_price: number
		is_active: boolean
		is_in_stock: boolean
	}
	product: {
		id: string
		name: string
		slug: string
		image_urls: string[]
	}
}

export interface Cart {
	id: string
	user_id: string
	items: CartItem[]
	subtotal: number
	item_count: number
	created_at: string
	updated_at: string
}

// Guest cart (localStorage format)
export interface GuestCartItem {
	product_variant_id: string
	quantity: number
}

// Cart merge request
export interface CartMergeRequest {
	items: GuestCartItem[]
}

// Stock validation error
export interface StockValidationError {
	itemId: string
	productName: string
	variantSku: string
	requestedQty: number
	availableQty: number
}
