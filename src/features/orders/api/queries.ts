/**
 * Orders API Queries
 * TanStack Query hooks for orders feature
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ORDER_ENDPOINTS } from './endpoints'
import type {
	Order,
	OrderDetail,
	OrderListFilters,
	CancelOrderRequest,
	PaginatedResponse,
} from '../types'

// ============================================================================
// ORDER QUERIES
// ============================================================================

export function useOrders(filters?: OrderListFilters) {
	return useQuery({
		queryKey: ['orders', filters],
		queryFn: async (): Promise<PaginatedResponse<Order>> => {
			const params = new URLSearchParams()
			if (filters?.status) {
				params.append('status', filters.status)
			}
			if (filters?.search) {
				params.append('search', filters.search)
			}
			if (filters?.page) {
				params.append('page', filters.page.toString())
			}
			if (filters?.limit) {
				params.append('limit', filters.limit.toString())
			}

			const queryString = params.toString()
			const url = queryString
				? `${ORDER_ENDPOINTS.ORDERS}?${queryString}`
				: ORDER_ENDPOINTS.ORDERS

			const response = await fetch(url)
			if (!response.ok) {
				throw new Error('Failed to fetch orders')
			}
			return response.json()
		},
		staleTime: 2 * 60 * 1000, // 2 minutes
	})
}

export function useOrder(id: string) {
	return useQuery({
		queryKey: ['orders', id],
		queryFn: async (): Promise<OrderDetail> => {
			const response = await fetch(ORDER_ENDPOINTS.ORDER_BY_ID(id))
			if (!response.ok) {
				throw new Error('Failed to fetch order')
			}
			const data = await response.json()
			return data.data
		},
		enabled: !!id,
		staleTime: 1 * 60 * 1000, // 1 minute
	})
}

export function useCancelOrder() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ id, reason }: { id: string; reason: string }): Promise<Order> => {
			const response = await fetch(ORDER_ENDPOINTS.ORDER_CANCEL(id), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ reason }),
			})
			if (!response.ok) {
				throw new Error('Failed to cancel order')
			}
			const data = await response.json()
			return data.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}

// ============================================================================
// PAYMENT QUERIES
// ============================================================================

export function usePaymentStatus(orderId: string) {
	return useQuery({
		queryKey: ['payment-status', orderId],
		queryFn: async () => {
			const response = await fetch(ORDER_ENDPOINTS.PAYMENT_STATUS(orderId))
			if (!response.ok) {
				throw new Error('Failed to fetch payment status')
			}
			const data = await response.json()
			return data.data
		},
		enabled: !!orderId,
		refetchInterval: (data) => {
			// Poll every 3 seconds if payment is pending
			return data?.status === 'pending' ? 3000 : false
		},
		staleTime: 10 * 1000, // 10 seconds
	})
}

export function useRetryPayment() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (orderId: string): Promise<{ payment_url: string }> => {
			const response = await fetch(`/api/orders/${orderId}/pay`, {
				method: 'POST',
			})
			if (!response.ok) {
				throw new Error('Failed to retry payment')
			}
			const data = await response.json()
			return data.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payment-status'] })
		},
	})
}
