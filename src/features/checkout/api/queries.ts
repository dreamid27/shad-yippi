/**
 * Checkout API Queries
 * TanStack Query hooks for checkout feature
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CHECKOUT_ENDPOINTS } from './endpoints'
import type {
	Address,
	CreateAddressRequest,
	UpdateAddressRequest,
	ShippingCostRequest,
	ShippingCostResult,
	VoucherValidationRequest,
	VoucherValidationResponse,
	Order,
	CreateOrderRequest,
} from '../types'

// ============================================================================
// ADDRESS QUERIES
// ============================================================================

export function useAddresses() {
	return useQuery({
		queryKey: ['addresses'],
		queryFn: async (): Promise<Address[]> => {
			const response = await fetch(CHECKOUT_ENDPOINTS.ADDRESSES)
			if (!response.ok) {
				throw new Error('Failed to fetch addresses')
			}
			const data = await response.json()
			return data.data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

export function useAddress(id: string) {
	return useQuery({
		queryKey: ['addresses', id],
		queryFn: async (): Promise<Address> => {
			const response = await fetch(CHECKOUT_ENDPOINTS.ADDRESS_BY_ID(id))
			if (!response.ok) {
				throw new Error('Failed to fetch address')
			}
			const data = await response.json()
			return data.data
		},
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
	})
}

export function useCreateAddress() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: CreateAddressRequest): Promise<Address> => {
			const response = await fetch(CHECKOUT_ENDPOINTS.ADDRESSES, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			if (!response.ok) {
				throw new Error('Failed to create address')
			}
			const result = await response.json()
			return result.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
	})
}

export function useUpdateAddress() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string
			data: UpdateAddressRequest
		}): Promise<Address> => {
			const response = await fetch(CHECKOUT_ENDPOINTS.ADDRESS_BY_ID(id), {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			if (!response.ok) {
				throw new Error('Failed to update address')
			}
			const result = await response.json()
			return result.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
	})
}

export function useDeleteAddress() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			const response = await fetch(CHECKOUT_ENDPOINTS.ADDRESS_BY_ID(id), {
				method: 'DELETE',
			})
			if (!response.ok) {
				throw new Error('Failed to delete address')
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
	})
}

export function useSetDefaultAddress() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (id: string): Promise<Address> => {
			const response = await fetch(CHECKOUT_ENDPOINTS.ADDRESS_DEFAULT(id), {
				method: 'PATCH',
			})
			if (!response.ok) {
				throw new Error('Failed to set default address')
			}
			const result = await response.json()
			return result.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
	})
}

// ============================================================================
// SHIPPING QUERIES
// ============================================================================

export function useShippingCosts(request: ShippingCostRequest) {
	return useQuery({
		queryKey: ['shipping-costs', request],
		queryFn: async (): Promise<ShippingCostResult[]> => {
			const params = new URLSearchParams({
				origin_city_id: request.origin_city_id,
				destination_city_id: request.destination_city_id,
				weight: request.weight.toString(),
				...(request.courier && { courier: request.courier }),
			})
			const response = await fetch(
				`${CHECKOUT_ENDPOINTS.SHIPPING_COST}?${params}`,
			)
			if (!response.ok) {
				throw new Error('Failed to fetch shipping costs')
			}
			const data = await response.json()
			return data.data
		},
		enabled: !!request.destination_city_id,
		staleTime: 10 * 60 * 1000, // 10 minutes
	})
}

// ============================================================================
// PROVINCES & CITIES QUERIES
// ============================================================================

export function useProvinces() {
	return useQuery({
		queryKey: ['provinces'],
		queryFn: async () => {
			const response = await fetch(CHECKOUT_ENDPOINTS.PROVINCES)
			if (!response.ok) {
				throw new Error('Failed to fetch provinces')
			}
			const data = await response.json()
			return data.data
		},
		staleTime: 60 * 60 * 1000, // 1 hour
	})
}

export function useCities(provinceId: string) {
	return useQuery({
		queryKey: ['cities', provinceId],
		queryFn: async () => {
			const response = await fetch(
				CHECKOUT_ENDPOINTS.CITIES_BY_PROVINCE(provinceId),
			)
			if (!response.ok) {
				throw new Error('Failed to fetch cities')
			}
			const data = await response.json()
			return data.data
		},
		enabled: !!provinceId,
		staleTime: 60 * 60 * 1000, // 1 hour
	})
}

// ============================================================================
// VOUCHER QUERIES
// ============================================================================

export function useValidateVoucher() {
	return useMutation({
		mutationFn: async (
			request: VoucherValidationRequest,
		): Promise<VoucherValidationResponse> => {
			const response = await fetch(CHECKOUT_ENDPOINTS.VOUCHER_VALIDATE, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(request),
			})
			if (!response.ok) {
				throw new Error('Failed to validate voucher')
			}
			const data = await response.json()
			return data.data
		},
	})
}

// ============================================================================
// ORDER QUERIES
// ============================================================================

export function useCreateOrder() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: CreateOrderRequest): Promise<Order> => {
			const response = await fetch(CHECKOUT_ENDPOINTS.ORDERS, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			if (!response.ok) {
				throw new Error('Failed to create order')
			}
			const result = await response.json()
			return result.data
		},
		onSuccess: () => {
			// Invalidate cart and orders queries
			queryClient.invalidateQueries({ queryKey: ['cart'] })
			queryClient.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}
