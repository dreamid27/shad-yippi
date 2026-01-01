import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartItemCard } from "./cart-item-card";
import type { CartItem, StockValidationError } from "../types";

// Mock dependencies
vi.mock("@tanstack/react-router", () => ({
	Link: ({ to, children, ...props }: any) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

vi.mock("@/components/ui/button", () => ({
	Button: ({ children, ...props }: any) => (
		<button {...props}>{children}</button>
	),
}));

const mockCartItem: CartItem = {
	id: "item-1",
	quantity: 2,
	price_snapshot: 25.99,
	subtotal: 51.98,
	product_variant: {
		id: "variant-1",
		sku: "SKU-001",
		attributes: { Size: "M", Color: "Black" },
		stock_quantity: 10,
		final_price: 25.99,
		is_active: true,
		is_in_stock: true,
	},
	product: {
		id: "prod-1",
		name: "Test Product",
		slug: "test-product",
		image_urls: ["https://example.com/image.jpg"],
	},
};

describe("CartItemCard", () => {
	it("should render product information correctly", () => {
		const mockUpdate = vi.fn();
		const mockRemove = vi.fn();

		render(
			<CartItemCard
				item={mockCartItem}
				onUpdateQuantity={mockUpdate}
				onRemove={mockRemove}
			/>,
		);

		expect(screen.getByText("Test Product")).toBeInTheDocument();
		expect(screen.getByText(/SKU: SKU-001/i)).toBeInTheDocument();
		expect(screen.getByText("$51.98")).toBeInTheDocument();
	});

	it("should display variant attributes", () => {
		const mockUpdate = vi.fn();
		const mockRemove = vi.fn();

		render(
			<CartItemCard
				item={mockCartItem}
				onUpdateQuantity={mockUpdate}
				onRemove={mockRemove}
			/>,
		);

		expect(screen.getByText(/SIZE: M/i)).toBeInTheDocument();
		expect(screen.getByText(/COLOR: Black/i)).toBeInTheDocument();
	});

	it("should call onUpdateQuantity when quantity is increased", () => {
		const mockUpdate = vi.fn();
		const mockRemove = vi.fn();

		render(
			<CartItemCard
				item={mockCartItem}
				onUpdateQuantity={mockUpdate}
				onRemove={mockRemove}
			/>,
		);

		const increaseButton = screen.getAllByLabelText("Increase quantity")[0];
		fireEvent.click(increaseButton);

		expect(mockUpdate).toHaveBeenCalledWith("item-1", 3);
	});

	it("should call onUpdateQuantity when quantity is decreased", () => {
		const mockUpdate = vi.fn();
		const mockRemove = vi.fn();

		render(
			<CartItemCard
				item={mockCartItem}
				onUpdateQuantity={mockUpdate}
				onRemove={mockRemove}
			/>,
		);

		const decreaseButton = screen.getAllByLabelText("Decrease quantity")[0];
		fireEvent.click(decreaseButton);

		expect(mockUpdate).toHaveBeenCalledWith("item-1", 1);
	});

	it("should disable decrease button when quantity is 1", () => {
		const itemWithMinQty = { ...mockCartItem, quantity: 1 };
		const mockUpdate = vi.fn();
		const mockRemove = vi.fn();

		render(
			<CartItemCard
				item={itemWithMinQty}
				onUpdateQuantity={mockUpdate}
				onRemove={mockRemove}
			/>,
		);

		const decreaseButton = screen.getAllByLabelText("Decrease quantity")[0];
		expect(decreaseButton).toBeDisabled();
	});

	it("should show confirmation before removing item", () => {
		const mockUpdate = vi.fn();
		const mockRemove = vi.fn();

		render(
			<CartItemCard
				item={mockCartItem}
				onUpdateQuantity={mockUpdate}
				onRemove={mockRemove}
			/>,
		);

		const removeButtons = screen.getAllByText(/REMOVE/i);
		fireEvent.click(removeButtons[0]);

		// First click shows confirmation
		expect(screen.getByText(/CONFIRM/i)).toBeInTheDocument();
		expect(mockRemove).not.toHaveBeenCalled();

		// Second click removes
		fireEvent.click(screen.getByText(/CONFIRM/i));
		expect(mockRemove).toHaveBeenCalledWith("item-1");
	});

	it("should display out of stock warning", () => {
		const outOfStockItem = {
			...mockCartItem,
			product_variant: {
				...mockCartItem.product_variant,
				is_in_stock: false,
			},
		};
		const mockUpdate = vi.fn();
		const mockRemove = vi.fn();

		render(
			<CartItemCard
				item={outOfStockItem}
				onUpdateQuantity={mockUpdate}
				onRemove={mockRemove}
			/>,
		);

		expect(screen.getByText(/OUT OF STOCK/i)).toBeInTheDocument();
	});

	it("should display stock warning when quantity exceeds available stock", () => {
		const lowStockItem = {
			...mockCartItem,
			quantity: 5,
			product_variant: {
				...mockCartItem.product_variant,
				stock_quantity: 3,
			},
		};
		const mockUpdate = vi.fn();
		const mockRemove = vi.fn();

		render(
			<CartItemCard
				item={lowStockItem}
				onUpdateQuantity={mockUpdate}
				onRemove={mockRemove}
			/>,
		);

		expect(screen.getByText(/Only 3 available/i)).toBeInTheDocument();
	});

	it("should render validation error when provided", () => {
		const validationError: StockValidationError = {
			productId: "prod-1",
			variantId: "variant-1",
			productName: "Test Product",
			requestedQty: 5,
			availableQty: 0,
			error: "out_of_stock",
		};

		const mockUpdate = vi.fn();
		const mockRemove = vi.fn();

		render(
			<CartItemCard
				item={mockCartItem}
				onUpdateQuantity={mockUpdate}
				onRemove={mockRemove}
				validationError={validationError}
			/>,
		);

		expect(screen.getByText(/OUT OF STOCK/i)).toBeInTheDocument();
		expect(
			screen.getByText(/This item is no longer available/i),
		).toBeInTheDocument();
	});

	it("should show quantity badge when quantity > 1", () => {
		const mockUpdate = vi.fn();
		const mockRemove = vi.fn();

		render(
			<CartItemCard
				item={mockCartItem}
				onUpdateQuantity={mockUpdate}
				onRemove={mockRemove}
			/>,
		);

		expect(screen.getByText(/×2/i)).toBeInTheDocument();
	});
});
