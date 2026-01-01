import { ArrowRight, Lock, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
	subtotal: number;
	itemCount: number;
	onProceedToCheckout: () => void;
	isValidating?: boolean;
	hasValidationErrors?: boolean;
	isAuthenticated?: boolean;
}

export function OrderSummary({
	subtotal,
	itemCount,
	onProceedToCheckout,
	isValidating = false,
	hasValidationErrors = false,
	isAuthenticated = false,
}: OrderSummaryProps) {
	const TAX_RATE = 0.085; // 8.5%
	const FREE_DELIVERY_THRESHOLD = 50;
	const DELIVERY_FEE = 4.99;

	const tax = subtotal * TAX_RATE;
	const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
	const total = subtotal + tax + delivery;

	const freeDeliveryProgress = Math.min(
		(subtotal / FREE_DELIVERY_THRESHOLD) * 100,
		100,
	);
	const amountToFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

	return (
		<div
			className="lg:sticky lg:top-8 animate-slide-in-right"
			style={{ animationDelay: "200ms" }}
		>
			<div className="relative overflow-hidden">
				{/* Tech grid background */}
				<div className="absolute inset-0 tech-grid opacity-20" />

				{/* HUD corners */}
				<div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--mecha-orange)]" />
				<div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[var(--mecha-orange)]" />
				<div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[var(--mecha-orange)]" />
				<div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--mecha-orange)]" />

				<div className="relative clip-mecha-panel bg-[var(--mecha-gray-dark)] border-2 border-[var(--mecha-orange)]/40 p-6 md:p-8 space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between border-b-2 border-[var(--mecha-orange)]/30 pb-4">
						<h2 className="text-xl font-black tracking-tight text-white font-[family-name:var(--font-display)]">
							ORDER SUMMARY
						</h2>
						<div className="w-10 h-10 clip-mecha-button bg-[var(--mecha-orange)] flex items-center justify-center">
							<span className="text-sm font-black text-black font-[family-name:var(--font-display)]">
								{itemCount}
							</span>
						</div>
					</div>

					{/* Price Breakdown */}
					<div className="space-y-3 font-[family-name:var(--font-body)]">
						<div className="flex justify-between items-center">
							<span className="text-sm text-white/60 tracking-wide">
								SUBTOTAL
							</span>
							<span className="font-bold tracking-wider text-white">
								${subtotal.toFixed(2)}
							</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-sm text-white/60 tracking-wide">
								TAX ({(TAX_RATE * 100).toFixed(1)}%)
							</span>
							<span className="font-bold tracking-wider text-white">
								${tax.toFixed(2)}
							</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-sm text-white/60 tracking-wide">
								DELIVERY
							</span>
							<span
								className={`font-bold tracking-wider ${delivery === 0 ? "text-[var(--mecha-success)]" : "text-white"}`}
							>
								{delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}
							</span>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-[var(--mecha-orange)] to-transparent" />

						{/* Total */}
						<div className="flex justify-between items-center pt-3">
							<span className="font-black tracking-tight text-lg font-[family-name:var(--font-display)] text-white">
								TOTAL
							</span>
							<span className="font-black tracking-tight text-2xl font-[family-name:var(--font-display)] text-[var(--mecha-orange)]">
								${total.toFixed(2)}
							</span>
						</div>
					</div>

					{/* Free Delivery Progress */}
					{subtotal < FREE_DELIVERY_THRESHOLD && (
						<div className="relative overflow-hidden clip-mecha-panel-sm bg-blue-900/20 border border-blue-600/30 p-4">
							<p className="text-xs font-bold tracking-wider text-blue-400 mb-2 font-[family-name:var(--font-display)]">
								FREE DELIVERY UNLOCK
							</p>

							{/* Progress bar */}
							<div className="relative h-2 bg-[var(--mecha-black)] border border-blue-600/30 overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out"
									style={{ width: `${freeDeliveryProgress}%` }}
								/>

								{/* Scanning effect */}
								{freeDeliveryProgress < 100 && (
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-mecha-scan" />
								)}
							</div>

							<p className="text-xs text-white/60 mt-2 font-[family-name:var(--font-body)]">
								Add{" "}
								<span className="text-blue-400 font-bold">
									${amountToFreeDelivery.toFixed(2)}
								</span>{" "}
								more
							</p>
						</div>
					)}

					{/* Checkout Button */}
					<Button
						onClick={onProceedToCheckout}
						disabled={isValidating || !isAuthenticated || hasValidationErrors}
						className="w-full h-14 clip-mecha-button bg-[var(--mecha-orange)] hover:bg-[var(--mecha-orange-light)] text-black font-black tracking-wider text-base font-[family-name:var(--font-heading)] group transition-all relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{/* Hover glow effect */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

						<span className="relative flex items-center justify-center gap-2">
							{isValidating ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									VALIDATING STOCK...
								</>
							) : hasValidationErrors ? (
								<>
									<AlertTriangle className="w-5 h-5" />
									RESOLVE ERRORS
								</>
							) : (
								<>
									PROCEED TO CHECKOUT
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</>
							)}
						</span>
					</Button>

					{/* Security Badge */}
					<div className="flex items-center justify-center gap-2 text-xs text-white/40 font-[family-name:var(--font-body)]">
						<Lock className="w-4 h-4" />
						<span>SECURE CHECKOUT POWERED BY STRIPE</span>
					</div>

					{/* Promo Code Section */}
					<div className="pt-4 border-t border-[var(--mecha-orange)]/20">
						<p className="text-xs font-bold tracking-wider text-white/60 mb-2 font-[family-name:var(--font-display)]">
							PROMO CODE
						</p>
						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Enter code"
								className="flex-1 bg-[var(--mecha-black)] border border-[var(--mecha-orange)]/20 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--mecha-orange)] transition-colors font-[family-name:var(--font-body)] clip-mecha-button"
							/>
							<Button
								variant="outline"
								className="clip-mecha-button border-[var(--mecha-orange)]/30 text-white hover:bg-[var(--mecha-orange)]/10 hover:border-[var(--mecha-orange)] h-10 px-4 font-bold tracking-wider font-[family-name:var(--font-heading)] transition-all"
							>
								APPLY
							</Button>
						</div>
					</div>

					{/* Trust Indicators */}
					<div className="pt-4 border-t border-[var(--mecha-orange)]/20 space-y-2">
						<div className="flex items-center gap-2 text-xs text-white/50 font-[family-name:var(--font-body)]">
							<div className="w-1 h-1 bg-[var(--mecha-success)] rounded-full" />
							<span>Free returns within 30 days</span>
						</div>
						<div className="flex items-center gap-2 text-xs text-white/50 font-[family-name:var(--font-body)]">
							<div className="w-1 h-1 bg-[var(--mecha-success)] rounded-full" />
							<span>2-3 business days delivery</span>
						</div>
						<div className="flex items-center gap-2 text-xs text-white/50 font-[family-name:var(--font-body)]">
							<div className="w-1 h-1 bg-[var(--mecha-success)] rounded-full" />
							<span>Authentic products guaranteed</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
