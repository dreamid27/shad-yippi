import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OrderSummary } from "./order-summary";

// Mock dependencies
vi.mock("@/components/ui/button", () => ({
	Button: ({ children, disabled, onClick, ...props }: any) => (
		<button disabled={disabled} onClick={onClick} {...props}>
			{children}
		</button>
	),
}));

describe("OrderSummary", () => {
	it("should render order summary with correct totals", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={100}
				itemCount={3}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		expect(screen.getByText("ORDER SUMMARY")).toBeInTheDocument();
		expect(screen.getByText("$100.00")).toBeInTheDocument(); // subtotal
		expect(screen.getByText("$8.50")).toBeInTheDocument(); // tax (8.5%)
	});

	it("should calculate tax correctly (8.5%)", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={100}
				itemCount={2}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		// Tax should be 100 * 0.085 = 8.50
		expect(screen.getByText("$8.50")).toBeInTheDocument();
	});

	it("should show delivery fee when subtotal < $50", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={30}
				itemCount={1}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		expect(screen.getByText("$4.99")).toBeInTheDocument(); // delivery fee
	});

	it("should show FREE delivery when subtotal >= $50", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={60}
				itemCount={3}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		expect(screen.getByText("FREE")).toBeInTheDocument();
	});

	it("should calculate total correctly with delivery fee", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={30}
				itemCount={1}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		// Total = 30 + (30 * 0.085) + 4.99 = 37.54
		expect(screen.getByText("$37.54")).toBeInTheDocument();
	});

	it("should calculate total correctly without delivery fee", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={50}
				itemCount={2}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		// Total = 50 + (50 * 0.085) + 0 = 54.25
		expect(screen.getByText("$54.25")).toBeInTheDocument();
	});

	it("should show free delivery progress when below threshold", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={30}
				itemCount={1}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		expect(screen.getByText(/FREE DELIVERY UNLOCK/i)).toBeInTheDocument();
		expect(screen.getByText(/Add \$20.00 more/i)).toBeInTheDocument();
	});

	it("should not show free delivery progress when above threshold", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={60}
				itemCount={2}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		expect(screen.queryByText(/FREE DELIVERY UNLOCK/i)).not.toBeInTheDocument();
	});

	it("should call onProceedToCheckout when button is clicked", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={100}
				itemCount={3}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		const checkoutButton = screen.getByText(/PROCEED TO CHECKOUT/i);
		fireEvent.click(checkoutButton);

		expect(mockProceed).toHaveBeenCalledTimes(1);
	});

	it("should disable checkout button when validating", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={100}
				itemCount={3}
				onProceedToCheckout={mockProceed}
				isValidating
				isAuthenticated
			/>,
		);

		const checkoutButton = screen.getByText(/VALIDATING STOCK.../i);
		expect(checkoutButton).toBeDisabled();
	});

	it("should disable checkout button when not authenticated", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={100}
				itemCount={3}
				onProceedToCheckout={mockProceed}
				isAuthenticated={false}
			/>,
		);

		const checkoutButton = screen.getByText(/PROCEED TO CHECKOUT/i);
		expect(checkoutButton).toBeDisabled();
	});

	it("should show resolve errors message when hasValidationErrors is true", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={100}
				itemCount={3}
				onProceedToCheckout={mockProceed}
				hasValidationErrors
				isAuthenticated
			/>,
		);

		expect(screen.getByText(/RESOLVE ERRORS/i)).toBeInTheDocument();
	});

	it("should disable checkout button when hasValidationErrors is true", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={100}
				itemCount={3}
				onProceedToCheckout={mockProceed}
				hasValidationErrors
				isAuthenticated
			/>,
		);

		const checkoutButton = screen.getByText(/RESOLVE ERRORS/i);
		expect(checkoutButton).toBeDisabled();
	});

	it("should display item count badge", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={100}
				itemCount={5}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		expect(screen.getByText("5")).toBeInTheDocument();
	});

	it("should render security badge text", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={100}
				itemCount={2}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		expect(
			screen.getByText(/SECURE CHECKOUT POWERED BY STRIPE/i),
		).toBeInTheDocument();
	});

	it("should render trust indicators", () => {
		const mockProceed = vi.fn();

		render(
			<OrderSummary
				subtotal={100}
				itemCount={2}
				onProceedToCheckout={mockProceed}
				isAuthenticated
			/>,
		);

		expect(
			screen.getByText(/Free returns within 30 days/i),
		).toBeInTheDocument();
		expect(screen.getByText(/2-3 business days delivery/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Authentic products guaranteed/i),
		).toBeInTheDocument();
	});
});
