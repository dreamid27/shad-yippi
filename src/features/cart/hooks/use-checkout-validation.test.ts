import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCheckoutValidation } from "./use-checkout-validation";
import type { StockValidationRequest, StockValidationResponse } from "../types";

// Mock fetch
global.fetch = vi.fn();

describe("useCheckoutValidation", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should initialize with correct default state", () => {
		const { result } = renderHook(() => useCheckoutValidation());

		expect(result.current.isValidating).toBe(false);
		expect(result.current.validationErrors).toEqual([]);
		expect(result.current.error).toBeNull();
	});

	it("should validate stock successfully with valid cart", async () => {
		const mockResponse: StockValidationResponse = {
			valid: true,
			errors: [],
		};

		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse,
		});

		const { result } = renderHook(() => useCheckoutValidation());

		const request: StockValidationRequest = {
			items: [{ productId: "prod-1", variantId: "var-1", quantity: 2 }],
		};

		let validationResult: StockValidationResponse | null = null;
		await act(async () => {
			validationResult = await result.current.validateStock(request);
		});

		expect(validationResult).toEqual(mockResponse);
		expect(result.current.isValidating).toBe(false);
		expect(result.current.validationErrors).toEqual([]);
		expect(result.current.error).toBeNull();
	});

	it("should handle out of stock validation errors", async () => {
		const mockResponse: StockValidationResponse = {
			valid: false,
			errors: [
				{
					productId: "prod-1",
					variantId: "var-1",
					productName: "Test Product",
					requestedQty: 5,
					availableQty: 0,
					error: "out_of_stock",
				},
			],
		};

		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse,
		});

		const { result } = renderHook(() => useCheckoutValidation());

		const request: StockValidationRequest = {
			items: [{ productId: "prod-1", variantId: "var-1", quantity: 5 }],
		};

		await act(async () => {
			await result.current.validateStock(request);
		});

		expect(result.current.isValidating).toBe(false);
		expect(result.current.validationErrors).toHaveLength(1);
		expect(result.current.validationErrors[0].error).toBe("out_of_stock");
	});

	it("should handle insufficient stock validation errors", async () => {
		const mockResponse: StockValidationResponse = {
			valid: false,
			errors: [
				{
					productId: "prod-1",
					variantId: "var-1",
					productName: "Test Product",
					requestedQty: 10,
					availableQty: 5,
					error: "insufficient_stock",
				},
			],
		};

		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse,
		});

		const { result } = renderHook(() => useCheckoutValidation());

		const request: StockValidationRequest = {
			items: [{ productId: "prod-1", variantId: "var-1", quantity: 10 }],
		};

		await act(async () => {
			await result.current.validateStock(request);
		});

		expect(result.current.validationErrors).toHaveLength(1);
		expect(result.current.validationErrors[0].error).toBe("insufficient_stock");
		expect(result.current.validationErrors[0].availableQty).toBe(5);
	});

	it("should handle network errors gracefully", async () => {
		(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
			new Error("Network error"),
		);

		const { result } = renderHook(() => useCheckoutValidation());

		const request: StockValidationRequest = {
			items: [{ productId: "prod-1", variantId: "var-1", quantity: 2 }],
		};

		await act(async () => {
			await result.current.validateStock(request);
		});

		expect(result.current.isValidating).toBe(false);
		expect(result.current.error).toBe("Network error");
		expect(result.current.validationErrors).toEqual([]);
	});

	it("should handle API errors (non-200 response)", async () => {
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: false,
			statusText: "Internal Server Error",
		});

		const { result } = renderHook(() => useCheckoutValidation());

		const request: StockValidationRequest = {
			items: [{ productId: "prod-1", variantId: "var-1", quantity: 2 }],
		};

		await act(async () => {
			await result.current.validateStock(request);
		});

		expect(result.current.error).toContain("Validation failed");
	});

	it("should clear errors when clearErrors is called", async () => {
		const mockResponse: StockValidationResponse = {
			valid: false,
			errors: [
				{
					productId: "prod-1",
					variantId: "var-1",
					productName: "Test Product",
					requestedQty: 5,
					availableQty: 0,
					error: "out_of_stock",
				},
			],
		};

		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse,
		});

		const { result } = renderHook(() => useCheckoutValidation());

		const request: StockValidationRequest = {
			items: [{ productId: "prod-1", variantId: "var-1", quantity: 5 }],
		};

		await act(async () => {
			await result.current.validateStock(request);
		});

		expect(result.current.validationErrors).toHaveLength(1);

		act(() => {
			result.current.clearErrors();
		});

		expect(result.current.validationErrors).toEqual([]);
		expect(result.current.error).toBeNull();
	});

	it("should handle multiple validation errors", async () => {
		const mockResponse: StockValidationResponse = {
			valid: false,
			errors: [
				{
					productId: "prod-1",
					variantId: "var-1",
					productName: "Product 1",
					requestedQty: 5,
					availableQty: 0,
					error: "out_of_stock",
				},
				{
					productId: "prod-2",
					variantId: "var-2",
					productName: "Product 2",
					requestedQty: 10,
					availableQty: 3,
					error: "insufficient_stock",
				},
				{
					productId: "prod-3",
					variantId: "var-3",
					productName: "Product 3",
					requestedQty: 1,
					availableQty: 0,
					error: "product_inactive",
				},
			],
		};

		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse,
		});

		const { result } = renderHook(() => useCheckoutValidation());

		const request: StockValidationRequest = {
			items: [
				{ productId: "prod-1", variantId: "var-1", quantity: 5 },
				{ productId: "prod-2", variantId: "var-2", quantity: 10 },
				{ productId: "prod-3", variantId: "var-3", quantity: 1 },
			],
		};

		await act(async () => {
			await result.current.validateStock(request);
		});

		expect(result.current.validationErrors).toHaveLength(3);
		expect(result.current.validationErrors.map((e) => e.error)).toEqual([
			"out_of_stock",
			"insufficient_stock",
			"product_inactive",
		]);
	});
});
