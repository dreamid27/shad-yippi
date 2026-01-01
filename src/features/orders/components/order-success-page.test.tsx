/**
 * OrderSuccessPage Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrderSuccessPage } from './order-success-page'
import type { Order } from '../types'

describe('OrderSuccessPage', () => {
	const mockOrder: Order = {
		id: '1',
		order_number: 'ORD-2025-001',
		user_id: 'user-1',
		status: 'pending_payment',
		shipping_address_id: 'addr-1',
		shipping_cost: 20000,
		subtotal: 500000,
		discount: 50000,
		tax: 52800,
		total: 522800,
		items: [
			{
				id: '1',
				order_id: '1',
				product_id: 'prod-1',
				product_variant_id: 'variant-1',
				product_name: 'Cotton Shirt',
				product_variant_attributes: { size: 'L', color: 'White' },
				product_image_url: 'https://example.com/shirt.jpg',
				sku: 'SHIRT-L-WHITE',
				quantity: 2,
				price: 150000,
				subtotal: 300000,
			},
		],
		created_at: '2025-01-15T10:30:00Z',
		updated_at: '2025-01-15T10:30:00Z',
	}

	it('renders success header', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByText(/Order Placed Successfully!/i)).toBeInTheDocument()
	})

	it('renders order number', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByText('ORD-2025-001')).toBeInTheDocument()
	})

	it('renders total amount', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByText(/Rp 522,800/i)).toBeInTheDocument()
	})

	it('renders order status', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByText(/Waiting for payment/i)).toBeInTheDocument()
	})

	it('renders estimated delivery time', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByText(/3-5 business days/i)).toBeInTheDocument()
	})

	it('renders order items', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByText('Cotton Shirt')).toBeInTheDocument()
		expect(screen.getByText(/Qty: 2/i)).toBeInTheDocument()
	})

	it('renders product image', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		const image = screen.getByAltText('Cotton Shirt')
		expect(image).toBeInTheDocument()
		expect(image).toHaveAttribute('src', 'https://example.com/shirt.jpg')
	})

	it('renders variant attributes', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByText(/size: L/i)).toBeInTheDocument()
		expect(screen.getByText(/color: White/i)).toBeInTheDocument()
	})

	it('renders view order details button', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByRole('link', { name: /view order details/i })).toBeInTheDocument()
	})

	it('renders continue shopping button', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument()
	})

	it('renders contact support button', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByText(/contact support/i)).toBeInTheDocument()
	})

	it('renders email verification note', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByText(/Check your email!/i)).toBeInTheDocument()
		expect(screen.getByText(/confirmation email/i)).toBeInTheDocument()
	})

	it('limits items preview to 3 when more items exist', () => {
		const orderWithManyItems: Order = {
			...mockOrder,
			items: Array(5).fill(mockOrder.items[0]!),
		}

		render(<OrderSuccessPage order={orderWithManyItems} />)

		// Should show "Order Items (5)" but only render 3 items
		expect(screen.getByText(/Order Items \(5\)/i)).toBeInTheDocument()
	})

	it('renders next steps section', () => {
		render(<OrderSuccessPage order={mockOrder} />)

		expect(screen.getByText(/What's Next?/i)).toBeInTheDocument()
		expect(screen.getByText(/Payment verification in progress/i)).toBeInTheDocument()
	})
})
