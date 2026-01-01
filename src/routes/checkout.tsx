/**
 * Checkout Route
 * Multi-step checkout flow for order placement
 */

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { AddressCard } from "../features/checkout/components/address-card";
import { ShippingMethodCard } from "../features/checkout/components/shipping-method-card";
import { VoucherInput } from "../features/checkout/components/voucher-input";
import { OrderSummary } from "../features/checkout/components/order-summary";
import type {
	Address,
	ShippingMethod,
	PaymentMethod,
	OrderItem,
	AppliedVoucher,
} from "../features/checkout/types";

// Mock data - replace with actual API calls
const mockAddresses: Address[] = [];
const mockShippingMethods: ShippingMethod[] = [];
const mockOrderItems: OrderItem[] = [];

function CheckoutRoute() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
	const [selectedAddressId, setSelectedAddressId] = useState<string>();
	const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>();
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<PaymentMethod>();
	const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(
		null,
	);
	const [termsAccepted, setTermsAccepted] = useState(false);

	const steps = [
		{
			step: 1 as const,
			title: "Address",
			description: "Select shipping address",
		},
		{
			step: 2 as const,
			title: "Shipping",
			description: "Choose delivery method",
		},
		{
			step: 3 as const,
			title: "Payment",
			description: "Select payment method",
		},
		{
			step: 4 as const,
			title: "Review",
			description: "Review & confirm order",
		},
	];

	const handleNextStep = () => {
		if (currentStep < 4) {
			setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4);
		}
	};

	const handlePrevStep = () => {
		if (currentStep > 1) {
			setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4);
		}
	};

	const handlePlaceOrder = async () => {
		// TODO: Implement order creation logic
		console.log("Placing order with:", {
			selectedAddressId,
			selectedShipping,
			selectedPaymentMethod,
			appliedVoucher,
		});
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 py-4">
					<button
						onClick={() => router.history.back()}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
					>
						<ChevronLeft className="w-5 h-5" strokeWidth={2} />
						Back to Cart
					</button>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Checkout Form */}
					<div className="lg:col-span-2 space-y-6">
						{/* Progress Indicator */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
							<div className="flex items-center justify-between">
								{steps.map((step, index) => (
									<div key={step.step} className="flex items-center flex-1">
										<div className="flex flex-col items-center flex-1">
											<div
												className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                          ${
														currentStep >= step.step
															? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
															: "bg-gray-200 text-gray-500"
													}
                          ${
														currentStep === step.step
															? "ring-4 ring-violet-200"
															: ""
													}
                        `}
											>
												{currentStep > step.step ? (
													<Check className="w-6 h-6" strokeWidth={3} />
												) : (
													step.step
												)}
											</div>
											<span
												className={`text-xs font-semibold mt-2 ${
													currentStep === step.step
														? "text-violet-600"
														: currentStep > step.step
															? "text-gray-900"
															: "text-gray-500"
												}`}
											>
												{step.title}
											</span>
										</div>
										{index < steps.length - 1 && (
											<div
												className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
													currentStep > step.step
														? "bg-violet-600"
														: "bg-gray-200"
												}`}
											/>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Step 1: Address Selection */}
						{currentStep === 1 && (
							<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">
									Select Shipping Address
								</h2>

								{mockAddresses.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
										{mockAddresses.map((address) => (
											<AddressCard
												key={address.id}
												address={address}
												selected={selectedAddressId === address.id}
												onSelect={setSelectedAddressId}
											/>
										))}
									</div>
								) : (
									<div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
										<p className="text-gray-500 mb-4">No addresses yet</p>
										<button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors">
											Add New Address
										</button>
									</div>
								)}

								{/* Add New Address Button */}
								<button className="w-full py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/30">
									+ Add New Address
								</button>
							</div>
						)}

						{/* Step 2: Shipping Method */}
						{currentStep === 2 && (
							<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">
									Select Shipping Method
								</h2>

								{mockShippingMethods.length > 0 ? (
									<div className="space-y-3 mb-6">
										{mockShippingMethods.map((method) => (
											<ShippingMethodCard
												key={`${method.courier_code}-${method.service}`}
												method={method}
												selected={
													selectedShipping?.courier_code ===
														method.courier_code &&
													selectedShipping?.service === method.service
												}
												onSelect={() => setSelectedShipping(method)}
											/>
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
										<p className="text-gray-600">
											Calculating shipping costs...
										</p>
									</div>
								)}
							</div>
						)}

						{/* Step 3: Payment Method */}
						{currentStep === 3 && (
							<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">
									Select Payment Method
								</h2>

								{/* Voucher Input */}
								<div className="mb-6">
									<VoucherInput
										onApply={async (code) => {
											// TODO: Implement voucher validation
											console.log("Applying voucher:", code);
											setAppliedVoucher({
												code,
												discount: 10000,
												discount_type: "fixed",
											});
										}}
										appliedVoucher={appliedVoucher}
									/>
								</div>

								{/* Payment Methods Grid */}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
									{[
										{
											method: "va_bca" as PaymentMethod,
											name: "BCA VA",
											icon: "🏦",
										},
										{
											method: "va_mandiri" as PaymentMethod,
											name: "Mandiri VA",
											icon: "🏦",
										},
										{
											method: "gopay" as PaymentMethod,
											name: "GoPay",
											icon: "📱",
										},
										{ method: "ovo" as PaymentMethod, name: "OVO", icon: "💰" },
										{
											method: "dana" as PaymentMethod,
											name: "Dana",
											icon: "💵",
										},
										{
											method: "shopeepay" as PaymentMethod,
											name: "ShopeePay",
											icon: "🛒",
										},
										{
											method: "qris" as PaymentMethod,
											name: "QRIS",
											icon: "📱",
										},
										{
											method: "credit_card" as PaymentMethod,
											name: "Credit Card",
											icon: "💳",
										},
										{ method: "cod" as PaymentMethod, name: "COD", icon: "📦" },
									].map((payment) => (
										<button
											key={payment.method}
											onClick={() => setSelectedPaymentMethod(payment.method)}
											className={`
                        p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${
													selectedPaymentMethod === payment.method
														? "border-violet-600 bg-violet-50"
														: "border-gray-200 hover:border-violet-300 bg-white"
												}
                      `}
										>
											<div className="text-2xl mb-2">{payment.icon}</div>
											<p className="text-xs font-semibold text-gray-900">
												{payment.name}
											</p>
										</button>
									))}
								</div>
							</div>
						)}

						{/* Step 4: Order Review */}
						{currentStep === 4 && (
							<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">
									Review & Confirm Order
								</h2>

								{/* Order Summary */}
								<OrderSummary
									items={mockOrderItems}
									subtotal={500000}
									shipping_cost={selectedShipping?.cost || 0}
									discount={appliedVoucher?.discount || 0}
									tax={(500000 - (appliedVoucher?.discount || 0)) * 0.11}
									total={
										500000 +
										(selectedShipping?.cost || 0) -
										(appliedVoucher?.discount || 0) +
										(500000 - (appliedVoucher?.discount || 0)) * 0.11
									}
									appliedVoucher={appliedVoucher}
								/>

								{/* Terms & Conditions */}
								<label className="flex items-start gap-3 mt-6 p-4 bg-gray-50 rounded-xl cursor-pointer">
									<input
										type="checkbox"
										checked={termsAccepted}
										onChange={(e) => setTermsAccepted(e.target.checked)}
										className="w-5 h-5 mt-0.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
									/>
									<span className="text-sm text-gray-700">
										I agree to the{" "}
										<a
											href="#"
											className="text-violet-600 hover:text-violet-700 underline"
										>
											Terms & Conditions
										</a>{" "}
										and{" "}
										<a
											href="#"
											className="text-violet-600 hover:text-violet-700 underline"
										>
											Privacy Policy
										</a>
									</span>
								</label>
							</div>
						)}

						{/* Navigation Buttons */}
						<div className="flex gap-4">
							{currentStep > 1 && (
								<button
									onClick={handlePrevStep}
									className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-xl transition-colors"
								>
									Previous Step
								</button>
							)}

							{currentStep < 4 && (
								<button
									onClick={handleNextStep}
									disabled={
										(currentStep === 1 && !selectedAddressId) ||
										(currentStep === 2 && !selectedShipping) ||
										(currentStep === 3 && !selectedPaymentMethod)
									}
									className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-violet-600 disabled:hover:to-violet-500 disabled:shadow-none"
								>
									Next Step
								</button>
							)}

							{currentStep === 4 && (
								<button
									onClick={handlePlaceOrder}
									disabled={!termsAccepted}
									className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Place Order & Pay
								</button>
							)}
						</div>
					</div>

					{/* Right Column - Order Summary (Sticky) */}
					<div className="lg:col-span-1">
						<div className="lg:sticky lg:top-8 space-y-6">
							<OrderSummary
								items={mockOrderItems}
								subtotal={500000}
								shipping_cost={selectedShipping?.cost || 0}
								discount={appliedVoucher?.discount || 0}
								tax={(500000 - (appliedVoucher?.discount || 0)) * 0.11}
								total={
									500000 +
									(selectedShipping?.cost || 0) -
									(appliedVoucher?.discount || 0) +
									(500000 - (appliedVoucher?.discount || 0)) * 0.11
								}
								appliedVoucher={appliedVoucher}
								collapsible={false}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/checkout")({
	component: CheckoutRoute,
});
