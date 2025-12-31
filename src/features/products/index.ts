// Export all types
export type {
	Product,
	ProductVariant,
	ProductDetail,
	ProductFilterParams,
	ProductListResponse,
	VariantOption,
} from "./types"

// Export components
export { ProductSkeleton } from "./components/product-skeleton"
// export { ProductCard } from './components/product-card'
// export { VariantSelector } from './components/variant-selector'
// export { StockIndicator } from './components/stock-indicator'

// Export hooks
export { useProducts } from "./hooks/use-products"
export { useProductDetail } from "./hooks/use-product-detail"

// Export API functions
export { fetchProducts, fetchProductDetail } from "./api/queries"
