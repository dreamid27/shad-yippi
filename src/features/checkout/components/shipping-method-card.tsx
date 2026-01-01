/**
 * ShippingMethodCard Component
 * Displays shipping option with cost and ETA
 */

import { Truck, Clock, Check } from "lucide-react";
import type { ShippingMethod } from "../types";

interface ShippingMethodCardProps {
	method: ShippingMethod;
	selected?: boolean;
	onSelect?: () => void;
	disabled?: boolean;
}

export function ShippingMethodCard({
	method,
	selected = false,
	onSelect,
	disabled = false,
}: ShippingMethodCardProps) {
	const {
		courier_code,
		courier_name,
		service,
		description,
		cost,
		eta_days,
		is_cheapest,
	} = method;

	const handleClick = () => {
		if (!disabled && onSelect) {
			onSelect();
		}
	};

	return (
		<div
			onClick={handleClick}
			className={`
        group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${
					selected
						? "border-violet-500 bg-violet-50/30 shadow-lg shadow-violet-500/10"
						: "border-gray-200 bg-white hover:border-violet-300 hover:shadow-md"
				}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
		>
			{/* Best Value Badge */}
			{is_cheapest && !selected && (
				<div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
					BEST VALUE
				</div>
			)}

			{/* Selected Indicator */}
			{selected && (
				<div className="absolute -top-2 -left-2 bg-gradient-to-r from-violet-500 to-violet-400 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
					<Check className="w-5 h-5" strokeWidth={3} />
				</div>
			)}

			<div className="space-y-3">
				{/* Courier & Service */}
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<Truck className="w-4 h-4 text-violet-500" strokeWidth={2} />
							<span className="text-sm font-bold text-gray-900 uppercase">
								{courier_code} - {service}
							</span>
						</div>
						<p className="text-sm text-gray-600">{description}</p>
					</div>
				</div>

				{/* Cost */}
				<div className="flex items-baseline justify-between">
					<div className="flex items-center gap-2 text-gray-500">
						<Clock className="w-4 h-4" strokeWidth={2} />
						<span className="text-sm">{eta_days} hari</span>
					</div>
					<span className="text-xl font-bold text-gray-900">
						Rp {cost.toLocaleString("id-ID")}
					</span>
				</div>
			</div>
		</div>
	);
}
