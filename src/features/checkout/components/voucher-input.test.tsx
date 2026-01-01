/**
 * VoucherInput Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VoucherInput } from './voucher-input'

describe('VoucherInput', () => {
	const mockOnApply = vi.fn()
	const mockOnRemove = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders input field and apply button', () => {
		render(
			<VoucherInput
				onApplyVoucher={mockOnApply}
				onRemoveVoucher={mockOnRemove}
			/>,
		)

		expect(
			screen.getByPlaceholderText('Enter voucher code'),
		).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument()
	})

	it('converts input to uppercase', async () => {
		const user = userEvent.setup()
		render(
			<VoucherInput
				onApplyVoucher={mockOnApply}
				onRemoveVoucher={mockOnRemove}
			/>,
		)

		const input = screen.getByPlaceholderText('Enter voucher code')
		await user.type(input, 'test123')

		expect(input).toHaveValue('TEST123')
	})

	it('calls onApplyVoucher when apply button is clicked', async () => {
		const user = userEvent.setup()
		render(
			<VoucherInput
				onApplyVoucher={mockOnApply}
				onRemoveVoucher={mockOnRemove}
			/>,
		)

		const input = screen.getByPlaceholderText('Enter voucher code')
		await user.type(input, 'SAVE20')

		const applyButton = screen.getByRole('button', { name: /apply/i })
		await user.click(applyButton)

		await waitFor(() => {
			expect(mockOnApply).toHaveBeenCalledWith('SAVE20')
		})
	})

	it('does not call onApplyVoucher when input is empty', async () => {
		const user = userEvent.setup()
		render(
			<VoucherInput
				onApplyVoucher={mockOnApply}
				onRemoveVoucher={mockOnRemove}
			/>,
		)

		const applyButton = screen.getByRole('button', { name: /apply/i })
		await user.click(applyButton)

		expect(mockOnApply).not.toHaveBeenCalled()
	})

	it('shows loading state when loading', () => {
		render(
			<VoucherInput
				onApplyVoucher={mockOnApply}
				onRemoveVoucher={mockOnRemove}
				loading
			/>,
		)

		expect(screen.getByRole('button', { name: /applying/i })).toBeInTheDocument()
	})

	it('displays applied voucher', () => {
		render(
			<VoucherInput
				onApplyVoucher={mockOnApply}
				onRemoveVoucher={mockOnRemove}
				appliedVoucher={{
					code: 'SAVE20',
					discount: 50000,
					discount_type: 'fixed',
				}}
			/>,
		)

		expect(screen.getByText(/SAVE20/i)).toBeInTheDocument()
		expect(screen.getByText(/50,000/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
	})

	it('displays percentage discount', () => {
		render(
			<VoucherInput
				onApplyVoucher={mockOnApply}
				onRemoveVoucher={mockOnRemove}
				appliedVoucher={{
					code: 'SUMMER20',
					discount: 20,
					discount_type: 'percentage',
				}}
			/>,
		)

		expect(screen.getByText(/20%/i)).toBeInTheDocument()
	})

	it('calls onRemoveVoucher when remove button is clicked', async () => {
		const user = userEvent.setup()
		render(
			<VoucherInput
				onApplyVoucher={mockOnApply}
				onRemoveVoucher={mockOnRemove}
				appliedVoucher={{
					code: 'SAVE20',
					discount: 50000,
					discount_type: 'fixed',
				}}
			/>,
		)

		const removeButton = screen.getByRole('button', { name: /remove/i })
		await user.click(removeButton)

		expect(mockOnRemove).toHaveBeenCalled()
	})

	it('displays error message', () => {
		render(
			<VoucherInput
				onApplyVoucher={mockOnApply}
				onRemoveVoucher={mockOnRemove}
				error="Invalid voucher code"
			/>,
		)

		expect(screen.getByText(/invalid voucher code/i)).toBeInTheDocument()
	})

	it('disables input and button when loading', () => {
		render(
			<VoucherInput
				onApplyVoucher={mockOnApply}
				onRemoveVoucher={mockOnRemove}
				loading
			/>,
		)

		const input = screen.getByPlaceholderText('Enter voucher code')
		const button = screen.getByRole('button', { name: /applying/i })

		expect(input).toBeDisabled()
		expect(button).toBeDisabled()
	})
})
