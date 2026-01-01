const API_BASE_URL = "http://localhost:8089";

export const cartEndpoints = {
	get: `${API_BASE_URL}/api/cart`,
	addItem: `${API_BASE_URL}/api/cart/items`,
	updateItem: (itemId: string) => `${API_BASE_URL}/api/cart/items/${itemId}`,
	removeItem: (itemId: string) => `${API_BASE_URL}/api/cart/items/${itemId}`,
	clear: `${API_BASE_URL}/api/cart`,
	merge: `${API_BASE_URL}/api/cart/merge`,
} as const;
