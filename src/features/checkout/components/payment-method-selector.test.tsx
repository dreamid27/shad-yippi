/**
 * PaymentMethodSelector Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PaymentMethodSelector } from "./payment-method-selector";

describe("PaymentMethodSelector", () => {
	const mockOnSelect = vi.fn();

	it("renders all payment method groups", () => {
		render(
			<PaymentMethodSelector
				selectedMethod={undefined}
				onMethodSelect={mockOnSelect}
			/>,
		);

		// Check group headers
		expect(screen.getByText("VIRTUAL ACCOUNT")).toBeInTheDocument();
		expect(screen.getByText("E-WALLET")).toBeInTheDocument();
		expect(screen.getByText("OTHER")).toBeInTheDocument();
	});

	it("renders all payment methods", () => {
		render(
			<PaymentMethodSelector
				selectedMethod={undefined}
				onMethodSelect={mockOnSelect}
			/>,
		);

		// Check some payment methods
		expect(screen.getByText("BCA Virtual Account")).toBeInTheDocument();
		expect(screen.getByText("GoPay")).toBeInTheDocument();
		expect(screen.getByText("QRIS")).toBeInTheDocument();
		expect(screen.getByText("Cash on Delivery")).toBeInTheDocument();
	});

	it("highlights selected method", () => {
		render(
			<PaymentMethodSelector
				selectedMethod="gopay"
				onMethodSelect={mockOnSelect}
			/>,
		);

		// Check if GoPay button has selected state (ring)
		const gopayButton = screen.getByText("GoPay").closest("button");
		expect(gopayButton).toHaveClass("ring-2");
	});

	it("calls onMethodSelect when method is clicked", () => {
		render(
			<PaymentMethodSelector
				selectedMethod={undefined}
				onMethodSelect={mockOnSelect}
			/>,
		);

		const gopayButton = screen.getByText("GoPay").closest("button");
		gopayButton?.click();

		expect(mockOnSelect).toHaveBeenCalledWith("gopay");
	});

	it("disables interaction when disabled prop is true", () => {
		render(
			<PaymentMethodSelector
				selectedMethod={undefined}
				onMethodSelect={mockOnSelect}
				disabled
			/>,
		);

		const buttons = screen.getAllByRole("button");
		buttons.forEach((button) => {
			expect(button).toBeDisabled();
		});
	});

	it("shows selected badge on selected method", () => {
		render(
			<PaymentMethodSelector
				selectedMethod="va_bca"
				onMethodSelect={mockOnSelect}
			/>,
		);

		const bcaButton = screen.getByText("BCA Virtual Account").closest("button");
		expect(bcaButton).toContainHTML("svg"); // Check badge icon
	});

	it("groups virtual account methods correctly", () => {
		render(
			<PaymentMethodSelector
				selectedMethod={undefined}
				onMethodSelect={mockOnSelect}
			/>,
		);

		expect(screen.getByText("BCA Virtual Account")).toBeInTheDocument();
		expect(screen.getByText("Mandiri Virtual Account")).toBeInTheDocument();
		expect(screen.getByText("BNI Virtual Account")).toBeInTheDocument();
		expect(screen.getByText("BRI Virtual Account")).toBeInTheDocument();
	});

	it("groups e-wallet methods correctly", () => {
		render(
			<PaymentMethodSelector
				selectedMethod={undefined}
				onMethodSelect={mockOnSelect}
			/>,
		);

		expect(screen.getByText("GoPay")).toBeInTheDocument();
		expect(screen.getByText("OVO")).toBeInTheDocument();
		expect(screen.getByText("DANA")).toBeInTheDocument();
		expect(screen.getByText("ShopeePay")).toBeInTheDocument();
	});

	it("renders payment method icons", () => {
		const { container } = render(
			<PaymentMethodSelector
				selectedMethod={undefined}
				onMethodSelect={mockOnSelect}
			/>,
		);

		// Check for emoji icons
		const icons = container.querySelectorAll(".text-3xl");
		expect(icons.length).toBeGreaterThan(0);
	});
});
