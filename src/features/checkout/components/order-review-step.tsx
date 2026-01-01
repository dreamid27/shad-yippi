/**
 * OrderReviewStep Component
 * Step 4: Review order before placing
 */

import { Check, AlertCircle } from "lucide-react";
import { OrderSummary } from "./order-summary";
import { VoucherInput } from "./voucher-input";
import type {
	Address,
	OrderItem,
	AppliedVoucher,
	CheckoutDraft,
} from "../types";

interface OrderReviewStepProps {
	items: OrderItem[];
	subtotal: number;
	shipping_cost: number;
	discount: number;
	tax: number;
	total: number;
	selectedAddress?: Address;
	selectedShipping?: {
		courier_code: string;
		courier_name: string;
		service: string;
		cost: number;
		eta_days: string;
	};
	selectedPaymentMethod?: string;
	appliedVoucher?: AppliedVoucher | null;
	onApplyVoucher: (code: string) => Promise<void>;
	onRemoveVoucher: () => void;
	onPlaceOrder: () => void;
	loading?: boolean;
	valid?: boolean;
	onValidationChange?: (valid: boolean) => void;
	termsAccepted?: boolean;
	onTermsAccept: (accepted: boolean) => void;
	notes?: string;
	onNotesChange?: (notes: string) => void;
}

export function OrderReviewStep({
	items,
	subtotal,
	shipping_cost,
	discount,
	tax,
	total,
	selectedAddress,
	selectedShipping,
	selectedPaymentMethod,
	appliedVoucher,
	onApplyVoucher,
	onRemoveVoucher,
	onPlaceOrder,
	loading = false,
	valid = false,
	onValidationChange,
	termsAccepted = false,
	onTermsAccept,
	notes = "",
	onNotesChange,
}: OrderReviewStepProps) {
	// Check if step is valid
	const isStepValid = termsAccepted;
	if (onValidationChange) {
		onValidationChange(isStepValid);
	}

	const getPaymentMethodName = (method?: string) => {
		if (!method) return "Not selected";
		const names: Record<string, string> = {
			va_bca: "BCA Virtual Account",
			va_mandiri: "Mandiri Virtual Account",
			va_bni: "BNI Virtual Account",
			va_bri: "BRI Virtual Account",
			gopay: "GoPay",
			ovo: "OVO",
			dana: "DANA",
			shopeepay: "ShopeePay",
			qris: "QRIS",
			credit_card: "Credit Card",
			cod: "Cash on Delivery",
		};
		return names[method] || method;
	};

	return (
		<div className="space-y-6">
			{/* Step Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-black text-gray-900">Review Your Order</h2>
				<p className="text-gray-600">
					Please review your order details before placing
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Left Column */}
				<div className="space-y-6">
					{/* Shipping Address Review */}
					<div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
						<h3 className="text-lg font-bold text-gray-900 mb-3">
							Shipping Address
						</h3>
						{selectedAddress ? (
							<div className="space-y-2">
								<div className="flex items-start justify-between">
									<div>
										<p className="font-semibold text-gray-900">
											{selectedAddress.recipient_name}
										</p>
										<p className="text-sm text-gray-600">
											{selectedAddress.phone}
										</p>
									</div>
									{selectedAddress.is_default && (
										<span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">
											DEFAULT
										</span>
									)}
								</div>
								<p className="text-sm text-gray-700">
									{selectedAddress.address_line1}
									{selectedAddress.address_line2 &&
										`, ${selectedAddress.address_line2}`}
								</p>
								<p className="text-sm text-gray-700">
									{selectedAddress.city_name}, {selectedAddress.province_name}{" "}
									{selectedAddress.postal_code}
								</p>
							</div>
						) : (
							<p className="text-sm text-gray-500 italic">
								No address selected
							</p>
						)}
					</div>

					{/* Shipping Method Review */}
					<div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
						<h3 className="text-lg font-bold text-gray-900 mb-3">
							Shipping Method
						</h3>
						{selectedShipping ? (
							<div className="space-y-2">
								<p className="font-semibold text-gray-900">
									{selectedShipping.courier_name} - {selectedShipping.service}
								</p>
								<p className="text-sm text-gray-600">
									Estimated delivery: {selectedShipping.eta_days} business days
								</p>
								<p className="text-sm font-bold text-violet-600">
									Rp {selectedShipping.cost.toLocaleString("id-ID")}
								</p>
							</div>
						) : (
							<p className="text-sm text-gray-500 italic">
								No shipping method selected
							</p>
						)}
					</div>

					{/* Payment Method Review */}
					<div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
						<h3 className="text-lg font-bold text-gray-900 mb-3">
							Payment Method
						</h3>
						<p className="font-semibold text-gray-900">
							{getPaymentMethodName(selectedPaymentMethod)}
						</p>
					</div>

					{/* Order Notes */}
					<div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
						<h3 className="text-lg font-bold text-gray-900 mb-3">
							Order Notes (Optional)
						</h3>
						<textarea
							value={notes}
							onChange={(e) => onNotesChange?.(e.target.value)}
							placeholder="Add any special instructions for your order..."
							className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all resize-none text-sm"
							rows={3}
							disabled={loading}
						/>
					</div>
				</div>

				{/* Right Column */}
				<div className="space-y-6">
					{/* Voucher Input */}
					<VoucherInput
						onApplyVoucher={onApplyVoucher}
						onRemoveVoucher={onRemoveVoucher}
						appliedVoucher={appliedVoucher}
						loading={loading}
					/>

					{/* Order Summary */}
					<OrderSummary
						items={items}
						subtotal={subtotal}
						shipping_cost={shipping_cost}
						discount={discount}
						tax={tax}
						total={total}
						appliedVoucher={appliedVoucher}
						loading={loading}
						collapsible
						showItems
					/>
				</div>
			</div>

			{/* Terms & Conditions */}
			<div className="bg-violet-50 rounded-xl p-4 border-2 border-violet-200">
				<label className="flex items-start gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={termsAccepted}
						onChange={(e) => onTermsAccept(e.target.checked)}
						disabled={loading}
						className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300 text-violet-600 focus:ring-violet-500 focus:ring-2 cursor-pointer"
					/>
					<span className="text-sm text-violet-900">
						I agree to the{" "}
						<a
							href="/terms"
							className="font-bold underline hover:text-violet-700"
						>
							Terms & Conditions
						</a>{" "}
						and{" "}
						<a
							href="/privacy"
							className="font-bold underline hover:text-violet-700"
						>
							Privacy Policy
						</a>
					</span>
				</label>
			</div>

			{/* Validation Message */}
			{!valid && !termsAccepted && !loading && (
				<div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
					<div className="flex items-start gap-3">
						<AlertCircle
							className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
							strokeWidth={2}
						/>
						<p className="text-sm font-bold text-red-900">
							Please accept the Terms & Conditions to place your order
						</p>
					</div>
				</div>
			)}

			{/* Place Order Button */}
			<button
				onClick={onPlaceOrder}
				disabled={loading || !termsAccepted}
				className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white font-black text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
				type="button"
			>
				{loading ? (
					<>
						<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						Processing...
					</>
				) : (
					<>
						<Check className="w-5 h-5" strokeWidth={3} />
						Place Order - Rp {total.toLocaleString("id-ID")}
					</>
				)}
			</button>
		</div>
	);
}
