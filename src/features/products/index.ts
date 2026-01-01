// Export all types
export type {
	Product,
	ProductVariant,
	ProductDetail,
	ProductFilterParams,
	ProductListResponse,
	VariantOption,
} from "./types";

// Export components
export { ProductSkeleton } from "./components/product-skeleton";
export { VariantSelector } from "./components/variant-selector";
export { StockIndicator } from "./components/stock-indicator";
// export { ProductCard } from './components/product-card'

// Export hooks
export { useProducts } from "./hooks/use-products";
export { useProductDetail } from "./hooks/use-product-detail";

// Export API functions
export { fetchProducts, fetchProductDetail } from "./api/queries";
