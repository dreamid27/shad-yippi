/**
 * AddressCard Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddressCard } from "./address-card";
import type { Address } from "../types";

describe("AddressCard", () => {
	const mockAddress: Address = {
		id: "address-1",
		user_id: "user-1",
		label: "Home",
		recipient_name: "John Doe",
		phone: "08123456789",
		address_line1: "Jl. Sudirman No. 123",
		address_line2: "Apt. ABC, Lt. 5",
		province_id: "1",
		province_name: "DKI Jakarta",
		city_id: "17",
		city_name: "Jakarta Selatan",
		district: "Kebayoran Baru",
		postal_code: "12190",
		is_default: true,
		is_deleted: false,
		created_at: "2026-01-01T10:00:00Z",
		updated_at: "2026-01-01T10:00:00Z",
	};

	it("renders address details correctly", () => {
		render(<AddressCard address={mockAddress} />);

		expect(screen.getByText("HOME")).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("08123456789")).toBeInTheDocument();
		expect(screen.getByText("Jl. Sudirman No. 123")).toBeInTheDocument();
		expect(screen.getByText("Apt. ABC, Lt. 5")).toBeInTheDocument();
		expect(
			screen.getByText("Kebayoran Baru, Jakarta Selatan, DKI Jakarta"),
		).toBeInTheDocument();
		expect(screen.getByText("12190")).toBeInTheDocument();
	});

	it("shows default badge when is_default=true", () => {
		render(<AddressCard address={mockAddress} />);

		expect(screen.getByText("DEFAULT")).toBeInTheDocument();
	});

	it("highlights when selected", () => {
		const { container } = render(
			<AddressCard address={mockAddress} selected={true} />,
		);

		const card = container.firstChild as HTMLElement;
		expect(card.className).toContain("border-emerald-500");
	});

	it("calls onSelect when card clicked", () => {
		const handleSelect = vi.fn();

		render(<AddressCard address={mockAddress} onSelect={handleSelect} />);

		const card = screen.getByText("John Doe").closest("div");
		fireEvent.click(card!);

		expect(handleSelect).toHaveBeenCalledWith("address-1");
	});

	it("calls onEdit when Edit button clicked", () => {
		const handleEdit = vi.fn();

		render(<AddressCard address={mockAddress} onEdit={handleEdit} />);

		const editButton = screen.getByRole("button", { name: /edit/i });
		fireEvent.click(editButton);

		expect(handleEdit).toHaveBeenCalledWith("address-1");
	});

	it("calls onDelete when Delete button clicked", () => {
		const handleDelete = vi.fn();

		render(<AddressCard address={mockAddress} onDelete={handleDelete} />);

		const deleteButton = screen.getByRole("button", { name: /delete/i });
		fireEvent.click(deleteButton);

		expect(handleDelete).toHaveBeenCalledWith("address-1");
	});

	it("shows loading state during delete action", () => {
		const { container } = render(
			<AddressCard address={mockAddress} loading={true} />,
		);

		expect(container.querySelector(".animate-spin")).toBeInTheDocument();
	});

	it("does not show default badge when not default", () => {
		const nonDefaultAddress = { ...mockAddress, is_default: false };

		render(<AddressCard address={nonDefaultAddress} />);

		expect(screen.queryByText("DEFAULT")).not.toBeInTheDocument();
	});

	it("disables delete button for default address", () => {
		render(<AddressCard address={mockAddress} onDelete={vi.fn()} />);

		const deleteButton = screen.getByRole("button", { name: /delete/i });
		expect(deleteButton).toBeDisabled();
	});
});
