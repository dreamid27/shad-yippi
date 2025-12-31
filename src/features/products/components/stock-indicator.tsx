interface StockIndicatorProps {
	stockQuantity: number
	isActive: boolean
	isInStock: boolean
	lowStockThreshold?: number
}

export function StockIndicator({
	stockQuantity,
	isActive,
	isInStock,
	lowStockThreshold = 10,
}: StockIndicatorProps) {
	// Determine stock status
	const getStatus = ():
		| "in-stock"
		| "low-stock"
		| "out-of-stock"
		| "inactive" => {
		if (!isActive) return "inactive"
		if (!isInStock || stockQuantity === 0) return "out-of-stock"
		if (stockQuantity <= lowStockThreshold) return "low-stock"
		return "in-stock"
	}

	const status = getStatus()

	// Status configurations
	const statusConfig = {
		"in-stock": {
			label: "In Stock",
			color: "text-green-400",
			bgColor: "bg-green-400/10",
			borderColor: "border-green-400/20",
		},
		"low-stock": {
			label: `Only ${stockQuantity} Left`,
			color: "text-yellow-400",
			bgColor: "bg-yellow-400/10",
			borderColor: "border-yellow-400/20",
		},
		"out-of-stock": {
			label: "Out of Stock",
			color: "text-red-400",
			bgColor: "bg-red-400/10",
			borderColor: "border-red-400/20",
		},
		inactive: {
			label: "Unavailable",
			color: "text-gray-400",
			bgColor: "bg-gray-400/10",
			borderColor: "border-gray-400/20",
		},
	}

	const config = statusConfig[status]

	return (
		<div
			className={`
			inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium uppercase tracking-wider
			${config.color} ${config.bgColor} ${config.borderColor}
		`}
		>
			{/* Status dot */}
			<span
				className={`w-2 h-2 rounded-full ${
					status === "in-stock"
						? "bg-green-400"
						: status === "low-stock"
							? "bg-yellow-400"
							: status === "out-of-stock"
								? "bg-red-400"
								: "bg-gray-400"
				}`}
			/>
			<span>{config.label}</span>
		</div>
	)
}
