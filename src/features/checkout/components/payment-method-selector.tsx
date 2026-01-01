/**
 * PaymentMethodSelector Component
 * Grid of payment methods with visual selection
 */

import type { PaymentMethod } from "../types";

const PAYMENT_METHODS: Array<{
	method: PaymentMethod;
	name: string;
	icon: string;
	color?: string;
	instructions?: string;
	account_number?: string;
	account_name?: string;
}> = [
	{
		method: "va_bca",
		name: "BCA Virtual Account",
		icon: "🏦",
		color: "blue",
	},
	{
		method: "va_mandiri",
		name: "Mandiri Virtual Account",
		icon: "🏦",
		color: "yellow",
	},
	{
		method: "va_bni",
		name: "BNI Virtual Account",
		icon: "🏦",
		color: "orange",
	},
	{
		method: "va_bri",
		name: "BRI Virtual Account",
		icon: "🏦",
		color: "blue",
	},
	{
		method: "gopay",
		name: "GoPay",
		icon: "💰",
		color: "green",
	},
	{
		method: "ovo",
		name: "OVO",
		icon: "💰",
		color: "purple",
	},
	{
		method: "dana",
		name: "DANA",
		icon: "💰",
		color: "blue",
	},
	{
		method: "shopeepay",
		name: "ShopeePay",
		icon: "💰",
		color: "orange",
	},
	{
		method: "qris",
		name: "QRIS",
		icon: "📱",
		color: "purple",
	},
	{
		method: "credit_card",
		name: "Credit Card",
		icon: "💳",
		color: "slate",
	},
	{
		method: "cod",
		name: "Cash on Delivery",
		icon: "📦",
		color: "emerald",
	},
];

interface PaymentMethodSelectorProps {
	selectedMethod?: PaymentMethod;
	onMethodSelect: (method: PaymentMethod) => void;
	loading?: boolean;
	disabled?: boolean;
}

export function PaymentMethodSelector({
	selectedMethod,
	onMethodSelect,
	loading = false,
	disabled = false,
}: PaymentMethodSelectorProps) {
	const groupedMethods = {
		"Virtual Account": PAYMENT_METHODS.filter((m) =>
			m.method.startsWith("va_"),
		),
		"E-Wallet": PAYMENT_METHODS.filter((m) =>
			["gopay", "ovo", "dana", "shopeepay"].includes(m.method),
		),
		Other: PAYMENT_METHODS.filter(
			(m) =>
				!m.method.startsWith("va_") &&
				!["gopay", "ovo", "dana", "shopeepay"].includes(m.method),
		),
	};

	const getMethodColor = (color?: string) => {
		const colors: Record<string, string> = {
			blue: "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100",
			yellow:
				"bg-yellow-50 border-yellow-200 hover:border-yellow-400 hover:bg-yellow-100",
			orange:
				"bg-orange-50 border-orange-200 hover:border-orange-400 hover:bg-orange-100",
			green:
				"bg-green-50 border-green-200 hover:border-green-400 hover:bg-green-100",
			purple:
				"bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100",
			slate:
				"bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100",
			emerald:
				"bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100",
		};
		return colors[color || "slate"];
	};

	const getSelectedRingColor = (color?: string) => {
		const colors: Record<string, string> = {
			blue: "ring-blue-500",
			yellow: "ring-yellow-500",
			orange: "ring-orange-500",
			green: "ring-green-500",
			purple: "ring-purple-500",
			slate: "ring-slate-500",
			emerald: "ring-emerald-500",
		};
		return colors[color || "slate"];
	};

	return (
		<div className="space-y-6">
			{Object.entries(groupedMethods).map(([groupName, methods]) => (
				<div key={groupName} className="space-y-3">
					<h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
						{groupName}
					</h4>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
						{methods.map((method) => {
							const isSelected = selectedMethod === method.method;
							const baseClasses = getMethodColor(method.color);
							const selectedRing = getSelectedRingColor(method.color);

							return (
								<button
									key={method.method}
									onClick={() => !disabled && onMethodSelect(method.method)}
									disabled={disabled || loading}
									className={`
										relative p-4 rounded-xl border-2 transition-all duration-200
										${baseClasses}
										${
											isSelected
												? `ring-2 ring-offset-2 ${selectedRing} scale-105 shadow-lg`
												: "opacity-80 hover:opacity-100"
										}
										${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
									`}
									type="button"
								>
									{/* Selected Badge */}
									{isSelected && (
										<div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center shadow-lg">
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={3}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
									)}

									{/* Icon */}
									<div className="text-3xl mb-2">{method.icon}</div>

									{/* Name */}
									<p className="text-xs font-bold text-gray-900 text-center leading-tight">
										{method.name}
									</p>
								</button>
							);
						})}
					</div>
				</div>
			))}

			{/* Loading Overlay */}
			{loading && (
				<div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
					<div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
				</div>
			)}
		</div>
	);
}
