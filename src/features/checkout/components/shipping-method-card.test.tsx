/**
 * ShippingMethodCard Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShippingMethodCard } from "./shipping-method-card";
import type { ShippingMethod } from "../types";

describe("ShippingMethodCard", () => {
	const mockMethod: ShippingMethod = {
		courier_code: "jne",
		courier_name: "Jalur Nugraha Ekakurir (JNE)",
		service: "REG",
		description: "Layanan Reguler",
		cost: 32000,
		eta_days: "1-2",
		is_cheapest: false,
	};

	it("displays courier, service, cost, ETA", () => {
		render(<ShippingMethodCard method={mockMethod} />);

		expect(screen.getByText("JNE - REG")).toBeInTheDocument();
		expect(screen.getByText("Layanan Reguler")).toBeInTheDocument();
		expect(screen.getByText("Rp 32.000")).toBeInTheDocument();
		expect(screen.getByText("1-2 hari")).toBeInTheDocument();
	});

	it("shows BEST VALUE badge for cheapest option", () => {
		const cheapestMethod = { ...mockMethod, is_cheapest: true };

		render(<ShippingMethodCard method={cheapestMethod} />);

		expect(screen.getByText("BEST VALUE")).toBeInTheDocument();
	});

	it("highlights when selected", () => {
		const { container } = render(
			<ShippingMethodCard method={mockMethod} selected={true} />,
		);

		const card = container.firstChild as HTMLElement;
		expect(card.className).toContain("border-violet-500");
	});

	it("calls onSelect when clicked", () => {
		const handleSelect = vi.fn();

		render(<ShippingMethodCard method={mockMethod} onSelect={handleSelect} />);

		const card = container.firstChild as HTMLElement;
		fireEvent.click(card);

		expect(handleSelect).toHaveBeenCalledOnce();
	});

	it("formats price in IDR correctly", () => {
		render(<ShippingMethodCard method={mockMethod} />);

		expect(screen.getByText("Rp 32.000")).toBeInTheDocument();
	});

	it("shows loading state during cost calculation", () => {
		const { container } = render(
			<ShippingMethodCard method={mockMethod} loading={true} />,
		);

		expect(container.querySelector(".animate-spin")).toBeInTheDocument();
	});

	it("shows error state if cost calculation failed", () => {
		render(
			<ShippingMethodCard method={mockMethod} error="Failed to calculate" />,
		);

		expect(screen.getByText("Failed to calculate")).toBeInTheDocument();
	});
});
