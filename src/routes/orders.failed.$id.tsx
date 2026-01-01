/**
 * Order Failed Route
 * Displayed when order placement fails
 */

import { createFileRoute } from "@tanstack/react-router";
import { OrderFailedPage } from "@/features/orders";

export const Route = createFileRoute("/orders/failed/$id")({
	component: OrderFailed,
});

function OrderFailed() {
	const { id } = Route.useParams();

	const handleRetry = () => {
		console.log("Retry order:", id);
		// TODO: Implement retry logic
	};

	return (
		<OrderFailedPage
			error="Payment processing failed. Please try again."
			onRetry={handleRetry}
		/>
	);
}
