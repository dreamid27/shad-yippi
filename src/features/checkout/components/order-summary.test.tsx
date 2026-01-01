/**
 * OrderSummary Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrderSummary } from './order-summary'
import type { OrderItem, AppliedVoucher } from '../types'

describe('OrderSummary', () => {
	const mockItems: OrderItem[] = [
		{
			id: '1',
			order_id: 'order-1',
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
		{
			id: '2',
			order_id: 'order-1',
			product_id: 'prod-2',
			product_variant_id: 'variant-2',
			product_name: 'Denim Jeans',
			product_variant_attributes: { size: '32', color: 'Blue' },
			product_image_url: 'https://example.com/jeans.jpg',
			sku: 'JEANS-32-BLUE',
			quantity: 1,
			price: 250000,
			subtotal: 250000,
		},
	]

	const mockVoucher: AppliedVoucher = {
		code: 'SAVE20',
		discount: 50000,
		discount_type: 'fixed',
	}

	it('renders order summary header', () => {
		render(
			<OrderSummary
				items={mockItems}
				subtotal={550000}
				shipping_cost={20000}
				tax={52800}
				total={622800}
			/>,
		)

		expect(screen.getByText('Order Summary')).toBeInTheDocument()
	})

	it('renders all items', () => {
		render(
			<OrderSummary
				items={mockItems}
				subtotal={550000}
				shipping_cost={20000}
				tax={52800}
				total={622800}
			/>,
		)

		expect(screen.getByText('Cotton Shirt')).toBeInTheDocument()
		expect(screen.getByText('Denim Jeans')).toBeInTheDocument()
	})

	it('displays item count', () => {
		render(
			<OrderSummary
				items={mockItems}
				subtotal={550000}
				shipping_cost={20000}
				tax={52800}
				total={622800}
			/>,
		)

		expect(screen.getByText(/Items \(2\)/i)).toBeInTheDocument()
	})

	it('renders variant attributes', () => {
		render(
			<OrderSummary
				items={mockItems}
				subtotal={550000}
				shipping_cost={20000}
				tax={52800}
				total={622800}
			/>,
		)

		expect(screen.getByText(/size: L, color: White/i)).toBeInTheDocument()
	})

	it('renders quantity', () => {
		render(
			<OrderSummary
				items={mockItems}
				subtotal={550000}
				shipping_cost={20000}
				tax={52800}
				total={622800}
			/>,
		)

		expect(screen.getByText(/Qty: 2/i)).toBeInTheDocument()
	})

	it('renders product image', () => {
		render(
			<OrderSummary
				items={mockItems}
				subtotal={550000}
				shipping_cost={20000}
				tax={52800}
				total={622800}
			/>,
		)

		const image = screen.getByAltText('Cotton Shirt')
		expect(image).toBeInTheDocument()
	})

	it('collapses items when more than 3', () => {
		const manyItems = Array(5).fill(mockItems[0]!)
		render(
			<OrderSummary
				items={manyItems}
				subtotal={1375000}
				shipping_cost={20000}
				tax={132000}
				total={1527000}
				collapsible
			/>,
		)

		// Should show "View all items" button
		expect(screen.getByText(/View all items \(5\)/i)).toBeInTheDocument()
	})

	it('toggles expanded state when clicking show more/less', async () => {
		const user = userEvent.setup()
		const manyItems = Array(5).fill(mockItems[0]!)

		render(
			<OrderSummary
				items={manyItems}
				subtotal={1375000}
				shipping_cost={20000}
				tax={132000}
				total={1527000}
				collapsible
			/>,
		)

		const viewAllButton = screen.getByText(/View all items \(5\)/i)
		await user.click(viewAllButton)

		expect(screen.getByText(/Show less/i)).toBeInTheDocument()
	})

	it('renders discount section when discount > 0', () => {
		render(
			<OrderSummary
				items={mockItems}
				subtotal={550000}
				shipping_cost={20000}
				discount={50000}
				tax={52800}
				total={572800}
				appliedVoucher={mockVoucher}
			/>,
		)

		expect(screen.getByText(/Discount \(SAVE20\)/i)).toBeInTheDocument()
		expect(screen.getByText(/-Rp 50,000/i)).toBeInTheDocument()
	})

	it('hides items when showItems is false', () => {
		render(
			<OrderSummary
				items={mockItems}
				subtotal={550000}
				shipping_cost={20000}
				tax={52800}
				total={622800}
				showItems={false}
			/>,
		)

		expect(screen.queryByText('Cotton Shirt')).not.toBeInTheDocument()
	})

	it('renders loading overlay when loading is true', () => {
		render(
			<OrderSummary
				items={mockItems}
				subtotal={550000}
				shipping_cost={20000}
				tax={52800}
				total={622800}
				loading
			/>,
		)

		// Check for loading spinner
		const container = screen.getByText('Order Summary').closest('div')
		const spinner = container?.querySelector('.animate-spin')
		expect(spinner).toBeInTheDocument()
	})

	it('formats all currency values correctly', () => {
		render(
			<OrderSummary
				items={mockItems}
				subtotal={550000}
				shipping_cost={20000}
				tax={52800}
				total={622800}
			/>,
		)

		expect(screen.getByText(/Rp 550,000/i)).toBeInTheDocument()
		expect(screen.getByText(/Rp 20,000/i)).toBeInTheDocument()
		expect(screen.getByText(/Rp 52,800/i)).toBeInTheDocument() // Tax
		expect(screen.getAllByText(/Rp 622,800/i)[0]).toBeInTheDocument() // Total
	})

	it('displays package icon when no product image', () => {
		const itemWithoutImage: OrderItem = {
			...mockItems[0]!,
			product_image_url: undefined,
		}

		render(
			<OrderSummary
				items={[itemWithoutImage]}
				subtotal={300000}
				shipping_cost={20000}
				tax={28800}
				total={348800}
			/>,
		)

		// Should show package icon instead of image
		const container = screen.getByText('Cotton Shirt').closest('div')
		const icon = container?.querySelector('svg')
		expect(icon).toBeInTheDocument()
	})
})
