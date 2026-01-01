/**
 * Order Success Route
 * Displayed after successful order placement
 */

import { createFileRoute } from "@tanstack/react-router";
import { OrderSuccessPage } from "../features/orders/components/order-success-page";
import type { Order } from "../features/orders/types";

function OrderSuccessRoute() {
	// TODO: Fetch order from API using route params
	const mockOrder: Order = {
		id: "order-1",
		order_number: "ORD-20260101-12345",
		user_id: "user-1",
		status: "pending_payment",
		shipping_address_id: "address-1",
		shipping_cost: 32000,
		subtotal: 500000,
		discount: 0,
		tax: 55000,
		total: 587000,
		created_at: "2026-01-01T10:00:00Z",
		updated_at: "2026-01-01T10:00:00Z",
		items: [
			{
				id: "item-1",
				order_id: "order-1",
				product_id: "product-1",
				product_variant_id: "variant-1",
				product_name: "Cotton T-Shirt",
				product_variant_attributes: { size: "M", color: "Black" },
				product_image_url:
					"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
				sku: "TSHIRT-M-BLACK",
				quantity: 2,
				price: 250000,
				subtotal: 500000,
			},
		],
	};

	return <OrderSuccessPage order={mockOrder} />;
}

export const Route = createFileRoute("/orders/success/$id")({
	component: OrderSuccessRoute,
});
