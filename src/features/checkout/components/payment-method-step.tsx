/**
 * PaymentMethodStep Component
 * Step 3: Select payment method
 */

import { CreditCard, Info } from "lucide-react";
import { PaymentMethodSelector } from "./payment-method-selector";
import type { PaymentMethod } from "../types";

interface PaymentMethodStepProps {
	selectedPaymentMethod?: PaymentMethod;
	onPaymentMethodSelect: (method: PaymentMethod) => void;
	loading?: boolean;
	valid?: boolean;
	onValidationChange?: (valid: boolean) => void;
}

export function PaymentMethodStep({
	selectedPaymentMethod,
	onPaymentMethodSelect,
	loading = false,
	valid = false,
	onValidationChange,
}: PaymentMethodStepProps) {
	// Notify parent of validation state
	if (onValidationChange) {
		onValidationChange(!!selectedPaymentMethod);
	}

	const getPaymentMethodName = (method: PaymentMethod) => {
		const names: Record<PaymentMethod, string> = {
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
		return names[method];
	};

	return (
		<div className="space-y-6">
			{/* Step Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-black text-gray-900">Payment Method</h2>
				<p className="text-gray-600">Choose your preferred payment method</p>
			</div>

			{/* Payment Method Selector */}
			<div className="bg-gray-50 rounded-2xl p-6">
				<PaymentMethodSelector
					selectedMethod={selectedPaymentMethod}
					onMethodSelect={onPaymentMethodSelect}
					loading={loading}
				/>
			</div>

			{/* Selected Method Info */}
			{selectedPaymentMethod && (
				<div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
					<div className="flex items-start gap-3">
						<CreditCard
							className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
							strokeWidth={2}
						/>
						<div className="flex-1">
							<p className="text-sm font-bold text-emerald-900">
								Payment method selected
							</p>
							<p className="text-sm text-emerald-700 mt-1">
								You'll pay using {getPaymentMethodName(selectedPaymentMethod)}
							</p>
							{selectedPaymentMethod === "cod" && (
								<p className="text-xs text-emerald-600 mt-2 font-medium">
									Payment will be collected upon delivery
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Payment Info Notice */}
			{selectedPaymentMethod && selectedPaymentMethod.startsWith("va_") && (
				<div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
					<div className="flex items-start gap-3">
						<Info
							className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
							strokeWidth={2}
						/>
						<div>
							<p className="text-sm font-bold text-blue-900">
								Virtual Account Payment
							</p>
							<p className="text-sm text-blue-700 mt-1">
								After placing your order, you'll receive a unique virtual
								account number. Transfer the payment amount to this number to
								complete your order.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* E-Wallet Notice */}
			{selectedPaymentMethod &&
				["gopay", "ovo", "dana", "shopeepay"].includes(
					selectedPaymentMethod,
				) && (
					<div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
						<div className="flex items-start gap-3">
							<Info
								className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
								strokeWidth={2}
							/>
							<div>
								<p className="text-sm font-bold text-blue-900">
									E-Wallet Payment
								</p>
								<p className="text-sm text-blue-700 mt-1">
									After placing your order, you'll be redirected to your
									e-wallet app to complete the payment. Make sure you have
									sufficient balance.
								</p>
							</div>
						</div>
					</div>
				)}

			{/* Validation Message */}
			{!valid && !selectedPaymentMethod && !loading && (
				<p className="text-sm font-semibold text-red-600 text-center">
					Please select a payment method to continue
				</p>
			)}
		</div>
	);
}
