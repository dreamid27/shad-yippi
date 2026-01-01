/**
 * Orders History Route
 * Displays user's order history with filters
 */

import { createFileRoute } from "@tanstack/react-router";
import { OrderHistoryPage } from "@/features/orders";

// Mock data - replace with real API call
const mockOrders = [
	{
		id: "1",
		order_number: "ORD-2025-001",
		created_at: "2025-01-15T10:30:00Z",
		status: "delivered" as const,
		total: 550000,
		item_count: 3,
	},
	{
		id: "2",
		order_number: "ORD-2025-002",
		created_at: "2025-01-10T14:20:00Z",
		status: "shipped" as const,
		total: 325000,
		item_count: 2,
	},
	{
		id: "3",
		order_number: "ORD-2025-003",
		created_at: "2025-01-05T09:15:00Z",
		status: "processing" as const,
		total: 750000,
		item_count: 5,
	},
];

export const Route = createFileRoute("/orders")({
	component: OrdersPage,
});

function OrdersPage() {
	const handleStatusFilter = (status?: string) => {
		console.log("Filter by status:", status);
		// TODO: Implement filter logic
	};

	const handleSearch = (query: string) => {
		console.log("Search:", query);
		// TODO: Implement search logic
	};

	const handleRefresh = () => {
		console.log("Refresh orders");
		// TODO: Implement refresh logic
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<OrderHistoryPage
				orders={mockOrders}
				loading={false}
				onStatusFilter={handleStatusFilter}
				onSearch={handleSearch}
				onRefresh={handleRefresh}
			/>
		</div>
	);
}
