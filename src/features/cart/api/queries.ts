import { cartEndpoints } from "./endpoints";
import type { Cart, CartMergeRequest } from "../types";

export async function fetchCart(accessToken: string): Promise<Cart> {
	const response = await fetch(cartEndpoints.get, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch cart: ${response.statusText}`);
	}

	return response.json();
}

export async function addCartItem(
	accessToken: string,
	variantId: string,
	quantity: number,
): Promise<Cart> {
	const response = await fetch(cartEndpoints.addItem, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			product_variant_id: variantId,
			quantity,
		}),
	});

	if (!response.ok) {
		throw new Error(`Failed to add item to cart: ${response.statusText}`);
	}

	return response.json();
}

export async function updateCartItem(
	accessToken: string,
	itemId: string,
	quantity: number,
): Promise<Cart> {
	const response = await fetch(cartEndpoints.updateItem(itemId), {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ quantity }),
	});

	if (!response.ok) {
		throw new Error(`Failed to update cart item: ${response.statusText}`);
	}

	return response.json();
}

export async function removeCartItem(
	accessToken: string,
	itemId: string,
): Promise<void> {
	const response = await fetch(cartEndpoints.removeItem(itemId), {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to remove cart item: ${response.statusText}`);
	}
}

export async function clearCart(accessToken: string): Promise<void> {
	const response = await fetch(cartEndpoints.clear, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to clear cart: ${response.statusText}`);
	}
}

export async function mergeCart(
	accessToken: string,
	items: CartMergeRequest,
): Promise<Cart> {
	const response = await fetch(cartEndpoints.merge, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(items),
	});

	if (!response.ok) {
		throw new Error(`Failed to merge cart: ${response.statusText}`);
	}

	return response.json();
}
