import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchProducts } from "../api/queries"
import type { ProductFilterParams } from "../types"

export function useProducts(filters: ProductFilterParams) {
	return useQuery({
		queryKey: ["products", filters],
		queryFn: () => fetchProducts(filters),
		staleTime: 5 * 60 * 1000, // 5 minutes
		placeholderData: keepPreviousData, // Smooth transition when filters change
	})
}
