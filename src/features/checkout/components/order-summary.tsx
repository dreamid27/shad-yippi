/**
 * OrderSummary Component
 * Displays order totals with item breakdown
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import type { OrderItem, AppliedVoucher } from "../types";

interface OrderSummaryProps {
	items: OrderItem[];
	subtotal: number;
	shipping_cost: number;
	discount?: number;
	tax: number;
	total: number;
	appliedVoucher?: AppliedVoucher | null;
	loading?: boolean;
	collapsible?: boolean;
	showItems?: boolean;
}

export function OrderSummary({
	items,
	subtotal,
	shipping_cost,
	discount = 0,
	tax,
	total,
	appliedVoucher,
	loading = false,
	collapsible = true,
	showItems = true,
}: OrderSummaryProps) {
	const [expanded, setExpanded] = useState(false);

	const displayItems = collapsible && !expanded ? items.slice(0, 3) : items;
	const hasMore = collapsible && items.length > 3;

	return (
		<div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
			<div className="p-5 space-y-4">
				{/* Header */}
				<h3 className="text-lg font-bold text-gray-900">Order Summary</h3>

				{/* Items */}
				{showItems && (
					<div className="space-y-3">
						{displayItems.map((item) => (
							<div key={item.id} className="flex items-start gap-3">
								<div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
									{item.product_image_url ? (
										<img
											src={item.product_image_url}
											alt={item.product_name}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<Package
												className="w-8 h-8 text-gray-300"
												strokeWidth={1.5}
											/>
										</div>
									)}
								</div>

								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 line-clamp-1">
										{item.product_name}
									</p>
									{Object.keys(item.product_variant_attributes).length > 0 && (
										<p className="text-xs text-gray-500 mt-0.5">
											{Object.entries(item.product_variant_attributes)
												.map(([key, value]) => `${key}: ${value}`)
												.join(", ")}
										</p>
									)}
									<div className="flex items-center justify-between mt-1">
										<p className="text-xs text-gray-500">
											Qty: {item.quantity}
										</p>
										<p className="text-sm font-semibold text-gray-900">
											Rp {item.subtotal.toLocaleString("id-ID")}
										</p>
									</div>
								</div>
							</div>
						))}

						{/* Show More/Less Button */}
						{hasMore && (
							<button
								onClick={() => setExpanded(!expanded)}
								className="w-full py-2 text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center justify-center gap-1 transition-colors"
							>
								{expanded ? (
									<>
										Show less
										<ChevronUp className="w-4 h-4" strokeWidth={2} />
									</>
								) : (
									<>
										View all items ({items.length})
										<ChevronDown className="w-4 h-4" strokeWidth={2} />
									</>
								)}
							</button>
						)}
					</div>
				)}

				{/* Totals */}
				<div className="space-y-3 pt-3 border-t-2 border-gray-200">
					{/* Subtotal */}
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-600 font-medium">
							Items ({items.length})
						</span>
						<span className="font-semibold text-gray-900">
							Rp {subtotal.toLocaleString("id-ID")}
						</span>
					</div>

					{/* Shipping */}
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-600 font-medium">Shipping</span>
						<span className="font-semibold text-gray-900">
							Rp {shipping_cost.toLocaleString("id-ID")}
						</span>
					</div>

					{/* Discount */}
					{discount > 0 && (
						<div className="flex items-center justify-between text-sm">
							<span className="text-emerald-600 font-medium">
								Discount {appliedVoucher ? `(${appliedVoucher.code})` : ""}
							</span>
							<span className="font-bold text-emerald-600">
								-Rp {discount.toLocaleString("id-ID")}
							</span>
						</div>
					)}

					{/* Tax */}
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-600 font-medium">Tax (11%)</span>
						<span className="font-semibold text-gray-900">
							Rp {tax.toLocaleString("id-ID")}
						</span>
					</div>

					{/* Total */}
					<div className="flex items-center justify-between pt-3 border-t-2 border-gray-900">
						<span className="text-base font-bold text-gray-900">TOTAL</span>
						<span className="text-2xl font-black text-gray-900">
							Rp {total.toLocaleString("id-ID")}
						</span>
					</div>
				</div>
			</div>

			{/* Loading Overlay */}
			{loading && (
				<div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
					<div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
				</div>
			)}
		</div>
	);
}
