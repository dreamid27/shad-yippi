/**
 * OrderCard Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderCard } from "./order-card";
import type { OrderCard as OrderCardType } from "../types";

describe("OrderCard", () => {
	const mockOrder: OrderCardType = {
		id: "1",
		order_number: "ORD-2025-001",
		created_at: "2025-01-15T10:30:00Z",
		status: "delivered",
		total: 550000,
		item_count: 3,
	};

	it("renders order number and date", () => {
		render(<OrderCard order={mockOrder} />);

		expect(screen.getByText(/Order #ORD-2025-001/i)).toBeInTheDocument();
		expect(screen.getByText(/15 Jan 2025/i)).toBeInTheDocument();
	});

	it("renders item count and total", () => {
		render(<OrderCard order={mockOrder} />);

		expect(screen.getByText(/3 items/i)).toBeInTheDocument();
		expect(screen.getByText(/Rp 550,000/i)).toBeInTheDocument();
	});

	it("renders status badge for delivered status", () => {
		render(<OrderCard order={mockOrder} />);

		expect(screen.getByText("Delivered")).toBeInTheDocument();
	});

	it("renders status badge for pending payment", () => {
		const pendingOrder = { ...mockOrder, status: "pending_payment" as const };
		render(<OrderCard order={pendingOrder} />);

		expect(screen.getByText("Waiting Payment")).toBeInTheDocument();
	});

	it("renders status badge for cancelled status", () => {
		const cancelledOrder = { ...mockOrder, status: "cancelled" as const };
		render(<OrderCard order={cancelledOrder} />);

		expect(screen.getByText("Cancelled")).toBeInTheDocument();
	});

	it("renders view details button", () => {
		render(<OrderCard order={mockOrder} />);

		expect(
			screen.getByRole("button", { name: /view details/i }),
		).toBeInTheDocument();
	});

	it("formats currency correctly", () => {
		render(<OrderCard order={mockOrder} />);

		expect(screen.getByText(/Rp 550\.000/i)).toBeInTheDocument();
	});

	it("has hover effect classes", () => {
		const { container } = render(<OrderCard order={mockOrder} />);

		const card = container.firstChild as HTMLElement;
		expect(card.className).toContain("hover:border-violet-300");
		expect(card.className).toContain("hover:shadow-lg");
	});

	it("displays different status colors", () => {
		const { rerender } = render(<OrderCard order={mockOrder} />);

		// Delivered - gray
		expect(screen.getByText("Delivered")).toHaveClass("text-gray-700");

		// Shipped - emerald
		const shippedOrder = { ...mockOrder, status: "shipped" as const };
		rerender(<OrderCard order={shippedOrder} />);
		expect(screen.getByText("Shipped")).toHaveClass("text-emerald-700");

		// Processing - violet
		const processingOrder = { ...mockOrder, status: "processing" as const };
		rerender(<OrderCard order={processingOrder} />);
		expect(screen.getByText("Processing")).toHaveClass("text-violet-700");
	});
});
