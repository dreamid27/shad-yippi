import { create } from "zustand"
import { persist, devtools } from "zustand/middleware"
import type {
	Cart,
	CartItem,
	GuestCartItem,
	CartMergeRequest,
} from "../types"
import {
	fetchCart,
	addCartItem,
	updateCartItem,
	removeCartItem,
	mergeCart,
} from "../api/queries"

interface CartState {
	// State
	cart: Cart | null
	guestCart: GuestCartItem[]
	isLoading: boolean
	error: string | null

	// Guest cart actions (localStorage)
	addGuestItem: (variantId: string, quantity: number) => void
	updateGuestItem: (variantId: string, quantity: number) => void
	removeGuestItem: (variantId: string) => void
	clearGuestCart: () => void

	// Authenticated cart actions (API)
	loadCart: (accessToken: string) => Promise<void>
	addItem: (
		accessToken: string,
		variantId: string,
		quantity: number,
	) => Promise<void>
	updateItem: (
		accessToken: string,
		itemId: string,
		quantity: number,
	) => Promise<void>
	removeItem: (accessToken: string, itemId: string) => Promise<void>
	clearCart: () => void

	// Sync logic (merge guest cart to authenticated cart)
	syncCart: (accessToken: string) => Promise<void>
}

export const useCartStore = create<CartState>()(
	devtools(
		persist(
			(set, get) => ({
				// Initial state
				cart: null,
				guestCart: [],
				isLoading: false,
				error: null,

				// Guest cart actions (localStorage only)
				addGuestItem: (variantId: string, quantity: number) => {
					const { guestCart } = get()
					const existingIndex = guestCart.findIndex(
						(item) => item.product_variant_id === variantId,
					)

					if (existingIndex >= 0) {
						// Update quantity if already exists
						const updatedCart = [...guestCart]
						updatedCart[existingIndex] = {
							...updatedCart[existingIndex],
							quantity: updatedCart[existingIndex].quantity + quantity,
						}
						set({ guestCart: updatedCart })
					} else {
						// Add new item
						set({
							guestCart: [...guestCart, { product_variant_id: variantId, quantity }],
						})
					}
				},

				updateGuestItem: (variantId: string, quantity: number) => {
					const { guestCart } = get()
					if (quantity <= 0) {
						// Remove if quantity is 0
						set({
							guestCart: guestCart.filter(
								(item) => item.product_variant_id !== variantId,
							),
						})
					} else {
						// Update quantity
						set({
							guestCart: guestCart.map((item) =>
								item.product_variant_id === variantId
									? { ...item, quantity }
									: item,
							),
						})
					}
				},

				removeGuestItem: (variantId: string) => {
					set({
						guestCart: get().guestCart.filter(
							(item) => item.product_variant_id !== variantId,
						),
					})
				},

				clearGuestCart: () => {
					set({ guestCart: [] })
				},

				// Authenticated cart actions (API)
				loadCart: async (accessToken: string) => {
					set({ isLoading: true, error: null })
					try {
						const cart = await fetchCart(accessToken)
						set({ cart, isLoading: false })
					} catch (error) {
						set({
							error:
								error instanceof Error ? error.message : "Failed to load cart",
							isLoading: false,
						})
					}
				},

				addItem: async (
					accessToken: string,
					variantId: string,
					quantity: number,
				) => {
					set({ isLoading: true, error: null })
					try {
						const cart = await addCartItem(accessToken, variantId, quantity)
						set({ cart, isLoading: false })
					} catch (error) {
						set({
							error:
								error instanceof Error
									? error.message
									: "Failed to add item to cart",
							isLoading: false,
						})
					}
				},

				updateItem: async (
					accessToken: string,
					itemId: string,
					quantity: number,
				) => {
					set({ isLoading: true, error: null })
					try {
						const cart = await updateCartItem(accessToken, itemId, quantity)
						set({ cart, isLoading: false })
					} catch (error) {
						set({
							error:
								error instanceof Error
									? error.message
									: "Failed to update cart item",
							isLoading: false,
						})
					}
				},

				removeItem: async (accessToken: string, itemId: string) => {
					set({ isLoading: true, error: null })
					try {
						const cart = await removeCartItem(accessToken, itemId)
						set({ cart, isLoading: false })
					} catch (error) {
						set({
							error:
								error instanceof Error
									? error.message
									: "Failed to remove cart item",
							isLoading: false,
						})
					}
				},

				clearCart: () => {
					set({ cart: null, error: null })
				},

				// Sync guest cart to authenticated cart (auto-merge on login)
				syncCart: async (accessToken: string) => {
					const { guestCart, clearGuestCart } = get()

					if (guestCart.length === 0) {
						// No guest cart items, just load server cart
						await get().loadCart(accessToken)
						return
					}

					set({ isLoading: true, error: null })
					try {
						// Merge guest cart to server
						const mergeRequest: CartMergeRequest = { items: guestCart }
						const cart = await mergeCart(accessToken, mergeRequest)
						set({ cart, isLoading: false })

						// Clear guest cart after successful merge
						clearGuestCart()
					} catch (error) {
						set({
							error:
								error instanceof Error
									? error.message
									: "Failed to sync cart",
							isLoading: false,
						})
					}
				},
			}),
			{
				name: "cart-storage", // localStorage key
				partialize: (state) => ({
					// Only persist guest cart in localStorage (not authenticated cart)
					guestCart: state.guestCart,
				}),
			},
		),
		{ name: "CartStore" },
	),
)
