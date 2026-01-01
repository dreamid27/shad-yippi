/**
 * OrderHistoryPage Component
 * Displays list of user's orders with filters
 */

import { useState } from "react";
import { Search, Filter, Package } from "lucide-react";
import { OrderCard } from "./order-card";
import type {
	OrderCard as OrderCardType,
	OrderListFilters,
	OrderStatus,
} from "../types";

interface OrderHistoryPageProps {
	orders: OrderCardType[];
	loading?: boolean;
	error?: string;
	onStatusFilter: (status?: OrderStatus) => void;
	onSearch: (query: string) => void;
	onRefresh: () => void;
}

const STATUS_OPTIONS: Array<{ value?: OrderStatus; label: string }> = [
	{ value: undefined, label: "All Orders" },
	{ value: "pending_payment", label: "Waiting Payment" },
	{ value: "payment_verified", label: "Payment Verified" },
	{ value: "processing", label: "Processing" },
	{ value: "shipped", label: "Shipped" },
	{ value: "delivered", label: "Delivered" },
	{ value: "completed", label: "Completed" },
	{ value: "cancelled", label: "Cancelled" },
];

export function OrderHistoryPage({
	orders,
	loading = false,
	error,
	onStatusFilter,
	onSearch,
	onRefresh,
}: OrderHistoryPageProps) {
	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(
		undefined,
	);
	const [searchQuery, setSearchQuery] = useState("");

	const handleStatusChange = (status: OrderStatus | undefined) => {
		setSelectedStatus(status);
		onStatusFilter(status);
	};

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
		onSearch(query);
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-black text-gray-900">Order History</h1>
				<p className="text-gray-600">View and track all your orders</p>
			</div>

			{/* Filters Bar */}
			<div className="bg-white rounded-2xl border-2 border-gray-200 p-4">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Search */}
					<div className="flex-1 relative">
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
							strokeWidth={2}
						/>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => handleSearchChange(e.target.value)}
							placeholder="Search by order number..."
							className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm"
							disabled={loading}
						/>
					</div>

					{/* Status Filter */}
					<div className="flex items-center gap-2">
						<Filter className="w-5 h-5 text-gray-400" strokeWidth={2} />
						<select
							value={selectedStatus || ""}
							onChange={(e) =>
								handleStatusChange(
									e.target.value ? (e.target.value as OrderStatus) : undefined,
								)
							}
							className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm font-medium text-gray-900 disabled:opacity-50"
							disabled={loading}
						>
							{STATUS_OPTIONS.map((option) => (
								<option key={option.label} value={option.value || ""}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Error State */}
			{error && (
				<div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200 text-center">
					<p className="text-red-900 font-bold mb-2">Failed to load orders</p>
					<p className="text-red-700 text-sm mb-4">{error}</p>
					<button
						onClick={onRefresh}
						className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
						type="button"
					>
						Try Again
					</button>
				</div>
			)}

			{/* Loading State */}
			{loading && orders.length === 0 ? (
				<div className="bg-gray-50 rounded-2xl p-12 text-center">
					<div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-gray-600 font-medium">Loading your orders...</p>
				</div>
			) : orders.length > 0 ? (
				/* Orders Grid */
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{orders.map((order) => (
						<OrderCard key={order.id} order={order} />
					))}
				</div>
			) : (
				/* Empty State */
				<div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
					<div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
						<Package className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
					</div>
					<h3 className="text-lg font-bold text-gray-900 mb-2">
						No orders yet
					</h3>
					<p className="text-gray-600 mb-6">
						{searchQuery || selectedStatus
							? "No orders match your search criteria"
							: "You haven't placed any orders yet. Start shopping to see your orders here!"}
					</p>
					{!searchQuery && !selectedStatus && (
						<a
							href="/categories"
							className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all duration-200"
						>
							Start Shopping
						</a>
					)}
				</div>
			)}
		</div>
	);
}
