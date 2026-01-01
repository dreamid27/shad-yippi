/**
 * ShippingMethodStep Component
 * Step 2: Select shipping method
 */

import { Truck, Clock, AlertCircle } from "lucide-react";
import { ShippingMethodCard } from "./shipping-method-card";
import type { ShippingMethod } from "../types";

interface ShippingMethodStepProps {
	shippingMethods: ShippingMethod[];
	selectedShipping?: {
		courier_code: string;
		service: string;
		cost: number;
		eta_days: string;
	};
	onShippingSelect: (shipping: {
		courier_code: string;
		service: string;
		cost: number;
		eta_days: string;
	}) => void;
	loading?: boolean;
	error?: string;
	valid?: boolean;
	onValidationChange?: (valid: boolean) => void;
}

export function ShippingMethodStep({
	shippingMethods,
	selectedShipping,
	onShippingSelect,
	loading = false,
	error,
	valid = false,
	onValidationChange,
}: ShippingMethodStepProps) {
	// Notify parent of validation state
	if (onValidationChange) {
		onValidationChange(!!selectedShipping);
	}

	return (
		<div className="space-y-6">
			{/* Step Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-black text-gray-900">Shipping Method</h2>
				<p className="text-gray-600">Choose your preferred shipping method</p>
			</div>

			{/* Error State */}
			{error && (
				<div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
					<div className="flex items-start gap-3">
						<AlertCircle
							className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
							strokeWidth={2}
						/>
						<div>
							<p className="text-sm font-bold text-red-900">
								Unable to load shipping methods
							</p>
							<p className="text-sm text-red-700 mt-1">{error}</p>
						</div>
					</div>
				</div>
			)}

			{/* Loading State */}
			{loading ? (
				<div className="bg-gray-50 rounded-2xl p-12 text-center">
					<div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-gray-600 font-medium">
						Calculating shipping costs...
					</p>
				</div>
			) : shippingMethods.length > 0 ? (
				/* Shipping Methods List */
				<div className="space-y-3">
					{shippingMethods.map((method) => (
						<ShippingMethodCard
							key={`${method.courier_code}-${method.service}`}
							method={method}
							isSelected={
								selectedShipping?.courier_code === method.courier_code &&
								selectedShipping?.service === method.service
							}
							onClick={() =>
								onShippingSelect({
									courier_code: method.courier_code,
									service: method.service,
									cost: method.cost,
									eta_days: method.eta_days,
								})
							}
							loading={loading}
						/>
					))}
				</div>
			) : (
				/* Empty State */
				<div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
					<div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
						<Truck className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
					</div>
					<h3 className="text-lg font-bold text-gray-900 mb-2">
						No shipping methods available
					</h3>
					<p className="text-gray-600">
						Please select a shipping address to see available methods
					</p>
				</div>
			)}

			{/* Shipping Info */}
			{selectedShipping && (
				<div className="bg-violet-50 rounded-xl p-4 border-2 border-violet-200">
					<div className="flex items-start gap-3">
						<Clock
							className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5"
							strokeWidth={2}
						/>
						<div>
							<p className="text-sm font-bold text-violet-900">
								Estimated delivery time
							</p>
							<p className="text-sm text-violet-700 mt-1">
								{selectedShipping.eta_days} business days after order
								confirmation
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Validation Message */}
			{!valid && !selectedShipping && !loading && (
				<p className="text-sm font-semibold text-red-600 text-center">
					Please select a shipping method to continue
				</p>
			)}
		</div>
	);
}
