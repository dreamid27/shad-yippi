import { API_BASE_URL } from "@/services/api/config";

export const productEndpoints = {
	list: `${API_BASE_URL}/api/products`,
	detail: (id: string) => `${API_BASE_URL}/api/products/${id}`,
	variants: (productId: string) =>
		`${API_BASE_URL}/api/products/${productId}/variants`,
} as const;
