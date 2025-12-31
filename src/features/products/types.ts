// Product Types (sesuai backend response)
export interface Product {
	id: string
	slug: string
	name: string
	base_price: number
	description: string
	image_urls: string[]
	status: "published" | "draft" | "archived"
	weight?: number
	dimensions?: {
		length: number
		width: number
		height: number
	}
	category: {
		id: string
		name: string
	}
	brand: {
		id: string
		name: string
	}
	variants_count: number
	min_price: number
	max_price: number
	has_stock: boolean
	created_at: string
	updated_at: string
}

// Product Variant (JSONB attributes)
export interface ProductVariant {
	id: string
	sku: string
	attributes: Record<string, string> // Flexible JSONB: {size: "M", color: "Red"}
	stock_quantity: number
	price_adjustment: number
	final_price: number
	is_active: boolean
	is_in_stock: boolean
}

// Product Detail (with variants)
export interface ProductDetail extends Product {
	variants: ProductVariant[]
}

// Filter params (match backend query params)
export interface ProductFilterParams {
	search?: string
	category_id?: string
	brand_id?: string
	min_price?: number
	max_price?: number
	status?: string
	size?: string
	color?: string
	sort_by?: "name" | "price" | "created_at"
	sort_order?: "asc" | "desc"
	page?: number
	limit?: number
}

// API Response
export interface ProductListResponse {
	data: Product[]
	pagination: {
		page: number
		limit: number
		total: number
		total_pages: number
	}
}

// Variant option for selector
export interface VariantOption {
	value: string
	isAvailable: boolean
}
