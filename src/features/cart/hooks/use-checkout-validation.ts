import { useState } from "react";
import { API_BASE_URL } from "@/services/api/config";
import type {
	StockValidationError,
	StockValidationRequest,
	StockValidationResponse,
} from "../types";

interface UseCheckoutValidationReturn {
	validateStock: (
		request: StockValidationRequest,
	) => Promise<StockValidationResponse>;
	isValidating: boolean;
	validationErrors: StockValidationError[];
	clearErrors: () => void;
	error: string | null;
}

export function useCheckoutValidation(): UseCheckoutValidationReturn {
	const [isValidating, setIsValidating] = useState(false);
	const [validationErrors, setValidationErrors] = useState<
		StockValidationError[]
	>([]);
	const [error, setError] = useState<string | null>(null);

	const validateStock = async (
		request: StockValidationRequest,
	): Promise<StockValidationResponse> => {
		setIsValidating(true);
		setError(null);
		setValidationErrors([]);

		try {
			const response = await fetch(`${API_BASE_URL}/api/cart/validate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(request),
			});

			if (!response.ok) {
				throw new Error(`Validation failed: ${response.statusText}`);
			}

			const data: StockValidationResponse = await response.json();

			if (!data.valid && data.errors.length > 0) {
				setValidationErrors(data.errors);
			}

			return data;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to validate stock";
			setError(errorMessage);
			// Return failed validation state
			return {
				valid: false,
				errors: [],
			};
		} finally {
			setIsValidating(false);
		}
	};

	const clearErrors = () => {
		setValidationErrors([]);
		setError(null);
	};

	return {
		validateStock,
		isValidating,
		validationErrors,
		clearErrors,
		error,
	};
}
