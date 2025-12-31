import { useQuery } from "@tanstack/react-query"
import { fetchProductDetail } from "../api/queries"

export function useProductDetail(productId: string) {
	return useQuery({
		queryKey: ["product", productId],
		queryFn: () => fetchProductDetail(productId),
		enabled: !!productId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
