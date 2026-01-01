import { useState, useEffect, useCallback, useMemo } from "react";
import type { MenuItem } from "@/services/api";

// Generic product interface for fashion items
export interface Product {
	id: string | number;
	name: string;
	price: number;
	image: string;
	description?: string;
	category?: string;
	brand?: string;
	sizes?: string[];
	badge?: string;
	originalPrice?: number;
}

export interface CartItem {
	item: Product | MenuItem;
	quantity: number;
}

interface CartContextValue {
	items: CartItem[];
	addItem: (item: Product | MenuItem) => void;
	removeItem: (itemId: string) => void;
	updateQuantity: (itemId: string, quantity: number) => void;
	clearCart: () => void;
	itemCount: number;
	subtotal: number;
	isHydrated: boolean;
}

const STORAGE_KEY = "yippi-cart";

function isValidCartItem(item: unknown): item is CartItem {
	if (!item || typeof item !== "object") return false;
	const cartItem = item as Partial<CartItem>;
	return (
		typeof cartItem.quantity === "number" &&
		cartItem.quantity > 0 &&
		cartItem.item !== undefined &&
		typeof cartItem.item === "object" &&
		typeof (cartItem.item as MenuItem | Product).name === "string" &&
		typeof (cartItem.item as MenuItem | Product).price === "number" &&
		(typeof (cartItem.item as MenuItem | Product).id === "string" ||
			typeof (cartItem.item as MenuItem | Product).id === "number")
	);
}

export function useCart(): CartContextValue {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isHydrated, setIsHydrated] = useState(false);

	// Load from localStorage on mount (client-side only)
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.every(isValidCartItem)) {
					setItems(parsed);
				}
			}
		} catch (error) {
			console.error("Failed to load cart from localStorage:", error);
			localStorage.removeItem(STORAGE_KEY);
		}
		setIsHydrated(true);
	}, []);

	// Save to localStorage whenever items change (client-side only)
	const saveCart = useCallback((newItems: CartItem[]) => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
		} catch (error) {
			console.error("Failed to save cart to localStorage:", error);
		}
	}, []);

	const addItem = useCallback(
		(item: MenuItem) => {
			setItems((prevItems) => {
				const existingIndex = prevItems.findIndex((i) => i.item.id === item.id);
				let newItems: CartItem[];

				if (existingIndex >= 0) {
					newItems = prevItems.map((i, index) =>
						index === existingIndex ? { ...i, quantity: i.quantity + 1 } : i,
					);
				} else {
					newItems = [...prevItems, { item, quantity: 1 }];
				}

				saveCart(newItems);
				return newItems;
			});
		},
		[saveCart],
	);

	const removeItem = useCallback(
		(itemId: string) => {
			setItems((prevItems) => {
				const newItems = prevItems.filter((i) => i.item.id !== itemId);
				saveCart(newItems);
				return newItems;
			});
		},
		[saveCart],
	);

	const updateQuantity = useCallback(
		(itemId: string, quantity: number) => {
			if (quantity < 1) {
				removeItem(itemId);
				return;
			}

			setItems((prevItems) => {
				const newItems = prevItems.map((i) =>
					i.item.id === itemId ? { ...i, quantity } : i,
				);
				saveCart(newItems);
				return newItems;
			});
		},
		[saveCart, removeItem],
	);

	const clearCart = useCallback(() => {
		setItems([]);
		saveCart([]);
	}, [saveCart]);

	const itemCount = useMemo(() => {
		return items.reduce((total, item) => total + item.quantity, 0);
	}, [items]);

	const subtotal = useMemo(() => {
		return items.reduce(
			(total, item) => total + item.item.price * item.quantity,
			0,
		);
	}, [items]);

	return {
		items,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		itemCount,
		subtotal,
		isHydrated,
	};
}
