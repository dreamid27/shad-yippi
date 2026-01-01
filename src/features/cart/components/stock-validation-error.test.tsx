import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
	StockValidationErrorBadge,
	ValidationSummary,
} from "./stock-validation-error";
import type { StockValidationError } from "../types";

// Mock dependencies
vi.mock("@/components/ui/button", () => ({
	Button: ({ children, onClick, disabled, ...props }: any) => (
		<button onClick={onClick} disabled={disabled} {...props}>
			{children}
		</button>
	),
}));

describe("StockValidationErrorBadge", () => {
	it("should render out of stock error", () => {
		const error: StockValidationError = {
			productId: "prod-1",
			variantId: "var-1",
			productName: "Test Product",
			requestedQty: 5,
			availableQty: 0,
			error: "out_of_stock",
		};

		const mockRemove = vi.fn();

		render(<StockValidationErrorBadge error={error} onRemove={mockRemove} />);

		expect(screen.getByText(/OUT OF STOCK/i)).toBeInTheDocument();
		expect(
			screen.getByText(/This item is no longer available/i),
		).toBeInTheDocument();
		expect(screen.getByText(/REMOVE/i)).toBeInTheDocument();
	});

	it("should call onRemove when remove button is clicked for out of stock", () => {
		const error: StockValidationError = {
			productId: "prod-1",
			variantId: "var-1",
			productName: "Test Product",
			requestedQty: 5,
			availableQty: 0,
			error: "out_of_stock",
		};

		const mockRemove = vi.fn();

		render(<StockValidationErrorBadge error={error} onRemove={mockRemove} />);

		const removeButton = screen.getByText(/REMOVE/i);
		fireEvent.click(removeButton);

		expect(mockRemove).toHaveBeenCalledTimes(1);
	});

	it("should render insufficient stock error", () => {
		const error: StockValidationError = {
			productId: "prod-1",
			variantId: "var-1",
			productName: "Test Product",
			requestedQty: 10,
			availableQty: 3,
			error: "insufficient_stock",
		};

		const mockRemove = vi.fn();
		const mockAdjust = vi.fn();

		render(
			<StockValidationErrorBadge
				error={error}
				onRemove={mockRemove}
				onAdjust={mockAdjust}
			/>,
		);

		expect(screen.getByText(/INSUFFICIENT STOCK/i)).toBeInTheDocument();
		expect(screen.getByText(/Only 3 available/i)).toBeInTheDocument();
		expect(screen.getByText(/Requested: 10/i)).toBeInTheDocument();
		expect(screen.getByText(/ADJUST/i)).toBeInTheDocument();
	});

	it("should call onAdjust with available quantity when adjust button is clicked", () => {
		const error: StockValidationError = {
			productId: "prod-1",
			variantId: "var-1",
			productName: "Test Product",
			requestedQty: 10,
			availableQty: 3,
			error: "insufficient_stock",
		};

		const mockRemove = vi.fn();
		const mockAdjust = vi.fn();

		render(
			<StockValidationErrorBadge
				error={error}
				onRemove={mockRemove}
				onAdjust={mockAdjust}
			/>,
		);

		const adjustButton = screen.getByText(/ADJUST/i);
		fireEvent.click(adjustButton);

		expect(mockAdjust).toHaveBeenCalledWith(3);
	});

	it("should render product inactive error", () => {
		const error: StockValidationError = {
			productId: "prod-1",
			variantId: "var-1",
			productName: "Test Product",
			requestedQty: 1,
			availableQty: 0,
			error: "product_inactive",
		};

		const mockRemove = vi.fn();

		render(<StockValidationErrorBadge error={error} onRemove={mockRemove} />);

		expect(screen.getByText(/PRODUCT INACTIVE/i)).toBeInTheDocument();
		expect(
			screen.getByText(/This product is no longer available/i),
		).toBeInTheDocument();
		expect(screen.getByText(/REMOVE/i)).toBeInTheDocument();
	});

	it("should call onRemove for product inactive error", () => {
		const error: StockValidationError = {
			productId: "prod-1",
			variantId: "var-1",
			productName: "Test Product",
			requestedQty: 1,
			availableQty: 0,
			error: "product_inactive",
		};

		const mockRemove = vi.fn();

		render(<StockValidationErrorBadge error={error} onRemove={mockRemove} />);

		const removeButton = screen.getByText(/REMOVE/i);
		fireEvent.click(removeButton);

		expect(mockRemove).toHaveBeenCalledTimes(1);
	});
});

describe("ValidationSummary", () => {
	it("should not render when errorCount is 0", () => {
		const mockFixAll = vi.fn();

		const { container } = render(
			<ValidationSummary errorCount={0} onFixAll={mockFixAll} />,
		);

		expect(container.firstChild).toBeNull();
	});

	it("should render validation summary with error count", () => {
		const mockFixAll = vi.fn();

		render(<ValidationSummary errorCount={3} onFixAll={mockFixAll} />);

		expect(screen.getByText(/VALIDATION FAILED/i)).toBeInTheDocument();
		expect(screen.getByText(/3 items have stock issues/i)).toBeInTheDocument();
		expect(screen.getByText(/FIX ISSUES/i)).toBeInTheDocument();
	});

	it("should use singular form for 1 error", () => {
		const mockFixAll = vi.fn();

		render(<ValidationSummary errorCount={1} onFixAll={mockFixAll} />);

		expect(screen.getByText(/1 item has stock issues/i)).toBeInTheDocument();
	});

	it("should call onFixAll when fix issues button is clicked", () => {
		const mockFixAll = vi.fn();

		render(<ValidationSummary errorCount={2} onFixAll={mockFixAll} />);

		const fixButton = screen.getByText(/FIX ISSUES/i);
		fireEvent.click(fixButton);

		expect(mockFixAll).toHaveBeenCalledTimes(1);
	});

	it("should show fixing state when isFixing is true", () => {
		const mockFixAll = vi.fn();

		render(<ValidationSummary errorCount={2} onFixAll={mockFixAll} isFixing />);

		expect(screen.getByText(/FIXING.../i)).toBeInTheDocument();
	});

	it("should disable button when isFixing is true", () => {
		const mockFixAll = vi.fn();

		render(<ValidationSummary errorCount={2} onFixAll={mockFixAll} isFixing />);

		const fixButton = screen.getByText(/FIXING.../i);
		expect(fixButton).toBeDisabled();
	});
});
