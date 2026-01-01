/**
 * OrderSuccessPage Component
 * Displayed after successful order placement
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Check,
	ArrowRight,
	ShoppingBag,
	Package,
	Mail,
	Phone,
} from "lucide-react";
import type { Order } from "../types";

interface OrderSuccessPageProps {
	order: Order;
}

export function OrderSuccessPage({ order }: OrderSuccessPageProps) {
	const { order_number, total, items } = order;

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-violet-50">
			<div className="container mx-auto px-4 py-12">
				<div className="max-w-2xl mx-auto">
					{/* Success Header */}
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-2xl shadow-emerald-500/30 mb-6 animate-bounce">
							<Check className="w-14 h-14 text-white" strokeWidth={4} />
						</div>
						<h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
							Order Placed Successfully!
						</h1>
						<p className="text-lg text-gray-600">
							Thank you for your order. We'll send you a confirmation email
							shortly.
						</p>
					</div>

					{/* Order Details Card */}
					<div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-200 overflow-hidden mb-6">
						<div className="p-6 md:p-8 space-y-6">
							{/* Order Number */}
							<div className="flex items-center justify-between pb-6 border-b-2 border-gray-100">
								<div>
									<p className="text-sm text-gray-500 mb-1">Order Number</p>
									<p className="text-2xl font-bold text-gray-900">
										{order_number}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm text-gray-500 mb-1">Total Amount</p>
									<p className="text-2xl font-black text-emerald-600">
										Rp {total.toLocaleString("id-ID")}
									</p>
								</div>
							</div>

							{/* Order Info */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-emerald-50 rounded-xl p-4">
									<p className="text-xs text-emerald-600 font-semibold mb-1">
										ORDER STATUS
									</p>
									<p className="text-lg font-bold text-gray-900">
										{order.status === "pending_payment"
											? "Waiting for payment"
											: "Payment Confirmed"}
									</p>
								</div>
								<div className="bg-violet-50 rounded-xl p-4">
									<p className="text-xs text-violet-600 font-semibold mb-1">
										ESTIMATED DELIVERY
									</p>
									<p className="text-lg font-bold text-gray-900">
										3-5 business days
									</p>
								</div>
							</div>

							{/* Items Preview */}
							{items && items.length > 0 && (
								<div>
									<p className="text-sm font-semibold text-gray-700 mb-3">
										Order Items ({items.length})
									</p>
									<div className="space-y-2">
										{items.slice(0, 3).map((item) => (
											<div
												key={item.id}
												className="flex items-center gap-3 text-sm"
											>
												<div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
													{item.product_image_url && (
														<img
															src={item.product_image_url}
															alt={item.product_name}
															className="w-full h-full object-cover"
														/>
													)}
												</div>
												<div className="flex-1">
													<p className="font-medium text-gray-900 line-clamp-1">
														{item.product_name}
													</p>
													<p className="text-xs text-gray-500">
														Qty: {item.quantity}
													</p>
												</div>
												<p className="font-semibold text-gray-900">
													Rp {item.subtotal.toLocaleString("id-ID")}
												</p>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Next Steps */}
							<div>
								<h3 className="text-base font-bold text-gray-900 mb-4">
									What's Next?
								</h3>
								<div className="space-y-3">
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
											<span className="text-emerald-600 font-bold text-sm">
												1
											</span>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												Payment verification in progress
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
											<span className="text-emerald-600 font-bold text-sm">
												2
											</span>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												You'll receive confirmation email
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
											<span className="text-emerald-600 font-bold text-sm">
												3
											</span>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												We'll process your order within 24 hours
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
											<span className="text-emerald-600 font-bold text-sm">
												4
											</span>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												You'll receive tracking number when shipped
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="p-6 bg-gray-50 space-y-3">
							<Link
								to={`/orders/${order.id}`}
								className="flex items-center justify-center gap-2 w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all duration-200 group"
							>
								View Order Details
								<ArrowRight
									className="w-5 h-5 group-hover:translate-x-1 transition-transform"
									strokeWidth={2}
								/>
							</Link>

							<div className="grid grid-cols-2 gap-3">
								<Link
									to="/categories"
									className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl border-2 border-gray-300 transition-all duration-200"
								>
									<ShoppingBag className="w-5 h-5" strokeWidth={2} />
									Continue Shopping
								</Link>

								<a
									href="mailto:support@yippi.com"
									className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl border-2 border-gray-300 transition-all duration-200"
								>
									<Mail className="w-5 h-5" strokeWidth={2} />
									Contact Support
								</a>
							</div>
						</div>
					</div>

					{/* Email Verification Note */}
					<div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
								<Mail className="w-6 h-6 text-blue-600" strokeWidth={2} />
							</div>
							<div>
								<h3 className="text-base font-bold text-gray-900 mb-1">
									Check your email!
								</h3>
								<p className="text-sm text-gray-700">
									We've sent order confirmation and payment instructions to your
									email address.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
