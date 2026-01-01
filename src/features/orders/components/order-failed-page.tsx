/**
 * OrderFailedPage Component
 * Displayed when order placement fails
 */

import { Link } from "@tanstack/react-router";
import {
	AlertOctagon,
	ArrowRight,
	ShoppingBag,
	Phone,
	RefreshCw,
} from "lucide-react";
import type { Order } from "../types";

interface OrderFailedPageProps {
	order?: Order;
	error?: string;
	onRetry?: () => void;
}

export function OrderFailedPage({
	order,
	error,
	onRetry,
}: OrderFailedPageProps) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
			<div className="container mx-auto px-4 py-12">
				<div className="max-w-2xl mx-auto">
					{/* Error Header */}
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-2xl shadow-red-500/30 mb-6">
							<AlertOctagon className="w-14 h-14 text-white" strokeWidth={3} />
						</div>
						<h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
							Order Failed
						</h1>
						<p className="text-lg text-gray-600">
							{error ||
								"We couldn't process your order. Please try again or contact support."}
						</p>
					</div>

					{/* Error Details Card */}
					<div className="bg-white rounded-3xl shadow-xl border-2 border-red-200 overflow-hidden mb-6">
						<div className="p-6 md:p-8 space-y-6">
							{/* Order Number (if available) */}
							{order && (
								<div className="pb-6 border-b-2 border-gray-100">
									<p className="text-sm text-gray-500 mb-1">Order Number</p>
									<p className="text-2xl font-bold text-gray-900">
										{order.order_number}
									</p>
								</div>
							)}

							{/* Possible Reasons */}
							<div>
								<h3 className="text-base font-bold text-gray-900 mb-4">
									Common Reasons:
								</h3>
								<div className="space-y-3">
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
											<span className="text-red-600 font-bold text-sm">1</span>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												Payment verification failed
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
											<span className="text-red-600 font-bold text-sm">2</span>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												Items out of stock
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
											<span className="text-red-600 font-bold text-sm">3</span>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												Network connection issue
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
											<span className="text-red-600 font-bold text-sm">4</span>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												Payment session expired
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 space-y-3">
						{onRetry && (
							<button
								onClick={onRetry}
								className="flex items-center justify-center gap-2 w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all duration-200 group"
								type="button"
							>
								<RefreshCw className="w-5 h-5" strokeWidth={2} />
								Try Again
							</button>
						)}

						<Link
							to="/cart"
							className="flex items-center justify-center gap-2 w-full py-4 bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold rounded-xl transition-all duration-200 group"
						>
							<ShoppingBag className="w-5 h-5" strokeWidth={2} />
							Back to Cart
							<ArrowRight
								className="w-5 h-5 group-hover:translate-x-1 transition-transform"
								strokeWidth={2}
							/>
						</Link>

						<div className="grid grid-cols-2 gap-3">
							<a
								href="mailto:support@yippi.com"
								className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl border-2 border-gray-300 transition-all duration-200"
							>
								<Phone className="w-5 h-5" strokeWidth={2} />
								Contact Support
							</a>

							<Link
								to="/categories"
								className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl border-2 border-gray-300 transition-all duration-200"
							>
								Continue Shopping
							</Link>
						</div>
					</div>

					{/* Support Note */}
					<div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
								<Phone className="w-6 h-6 text-orange-600" strokeWidth={2} />
							</div>
							<div>
								<h3 className="text-base font-bold text-gray-900 mb-1">
									Need Help?
								</h3>
								<p className="text-sm text-gray-700">
									If you continue to experience issues, please contact our
									support team and we'll be happy to assist you.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
