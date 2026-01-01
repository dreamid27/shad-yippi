import { productEndpoints } from "./endpoints";
import type {
	ProductListResponse,
	ProductDetail,
	ProductFilterParams,
} from "../types";

export async function fetchProducts(
	filters: ProductFilterParams,
): Promise<ProductListResponse> {
	const params = new URLSearchParams();

	// Add filters to query params
	if (filters.search) params.append("search", filters.search);
	if (filters.category_id) params.append("category_id", filters.category_id);
	if (filters.brand_id) params.append("brand_id", filters.brand_id);
	if (filters.min_price) params.append("min_price", String(filters.min_price));
	if (filters.max_price) params.append("max_price", String(filters.max_price));
	if (filters.size) params.append("size", filters.size);
	if (filters.color) params.append("color", filters.color);
	if (filters.sort_by) params.append("sort_by", filters.sort_by);
	if (filters.sort_order) params.append("sort_order", filters.sort_order);

	// Pagination
	params.append("page", String(filters.page || 1));
	params.append("limit", String(filters.limit || 20));

	// Only show published products
	params.append("status", "published");

	const response = await fetch(`${productEndpoints.list}?${params}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch products: ${response.statusText}`);
	}

	return response.json();
}

export async function fetchProductDetail(id: string): Promise<ProductDetail> {
	const response = await fetch(productEndpoints.detail(id));

	if (!response.ok) {
		throw new Error(`Failed to fetch product detail: ${response.statusText}`);
	}

	return response.json();
}
