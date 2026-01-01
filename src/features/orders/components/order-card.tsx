/**
 * OrderCard Component
 * Displays order summary in history page
 */

import { Link } from "@tanstack/react-router";
import { Package, ArrowRight, Clock } from "lucide-react";
import type { OrderCard as OrderCardType } from "../types";

interface OrderCardProps {
	order: OrderCardType;
}

const STATUS_CONFIG: Record<
	string,
	{ label: string; color: string; bgColor: string }
> = {
	pending_payment: {
		label: "Waiting Payment",
		color: "text-yellow-700",
		bgColor: "bg-yellow-50",
	},
	payment_verified: {
		label: "Payment Verified",
		color: "text-blue-700",
		bgColor: "bg-blue-50",
	},
	processing: {
		label: "Processing",
		color: "text-violet-700",
		bgColor: "bg-violet-50",
	},
	shipped: {
		label: "Shipped",
		color: "text-emerald-700",
		bgColor: "bg-emerald-50",
	},
	delivered: {
		label: "Delivered",
		color: "text-green-700",
		bgColor: "bg-green-50",
	},
	completed: {
		label: "Completed",
		color: "text-gray-700",
		bgColor: "bg-gray-50",
	},
	cancelled: {
		label: "Cancelled",
		color: "text-red-700",
		bgColor: "bg-red-50",
	},
};

export function OrderCard({ order }: OrderCardProps) {
	const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.completed;

	return (
		<div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-violet-300 hover:shadow-lg transition-all duration-200">
			<div className="p-5 space-y-4">
				{/* Header: Order Number + Status + Date */}
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<p className="text-xs text-gray-500 font-medium">
							Order #{order.order_number}
						</p>
						<p className="text-xs text-gray-400">
							{new Date(order.created_at).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "short",
								year: "numeric",
							})}
						</p>
					</div>
					<span
						className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.color}`}
					>
						{statusConfig.label}
					</span>
				</div>

				{/* Order Info */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Package className="w-4 h-4" strokeWidth={2} />
						<span className="font-medium">{order.item_count} items</span>
					</div>
					<p className="text-xl font-black text-gray-900">
						Rp {order.total.toLocaleString("id-ID")}
					</p>
				</div>

				{/* View Details Button */}
				<Link
					to={`/orders/${order.id}`}
					className="flex items-center justify-center gap-2 w-full py-3 bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold rounded-xl transition-all duration-200 group"
				>
					View Details
					<ArrowRight
						className="w-4 h-4 group-hover:translate-x-1 transition-transform"
						strokeWidth={2}
					/>
				</Link>
			</div>
		</div>
	);
}
