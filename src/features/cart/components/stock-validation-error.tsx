import { AlertCircle, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StockValidationError } from "../types";

interface StockValidationErrorProps {
	error: StockValidationError;
	onRemove: () => void;
	onAdjust?: (newQuantity: number) => void;
}

export function StockValidationErrorBadge({
	error,
	onRemove,
	onAdjust,
}: StockValidationErrorProps) {
	if (error.error === "out_of_stock") {
		return (
			<div className="relative overflow-hidden mb-3">
				{/* Caution stripe background */}
				<div className="absolute inset-0 caution-stripes-sm opacity-20" />

				<div className="relative clip-mecha-panel-sm bg-[var(--mecha-black)] border-2 border-[var(--mecha-orange)] p-3">
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0 mt-0.5">
							<div className="w-8 h-8 bg-[var(--mecha-orange)] clip-mecha-button flex items-center justify-center">
								<AlertCircle className="w-4 h-4 text-black" />
							</div>
						</div>

						<div className="flex-1 min-w-0">
							<p className="text-[var(--mecha-orange)] font-bold tracking-wider text-xs font-[family-name:var(--font-display)] mb-1">
								OUT OF STOCK
							</p>
							<p className="text-white/70 text-xs font-[family-name:var(--font-body)]">
								This item is no longer available. Remove to proceed with
								checkout.
							</p>
						</div>

						<Button
							size="sm"
							variant="ghost"
							onClick={onRemove}
							className="flex-shrink-0 h-8 px-3 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 hover:text-red-300 clip-mecha-button"
						>
							<Trash2 className="w-3 h-3 mr-1.5" />
							<span className="text-xs font-bold tracking-wider font-[family-name:var(--font-heading)]">
								REMOVE
							</span>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (error.error === "insufficient_stock") {
		return (
			<div className="relative overflow-hidden mb-3">
				<div className="clip-mecha-panel-sm bg-yellow-900/20 border-2 border-yellow-600/50 p-3">
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0 mt-0.5">
							<div className="w-8 h-8 bg-yellow-600 clip-mecha-button flex items-center justify-center animate-mecha-pulse">
								<AlertCircle className="w-4 h-4 text-black" />
							</div>
						</div>

						<div className="flex-1 min-w-0">
							<p className="text-yellow-400 font-bold tracking-wider text-xs font-[family-name:var(--font-display)] mb-1">
								INSUFFICIENT STOCK
							</p>
							<p className="text-white/70 text-xs font-[family-name:var(--font-body)]">
								Only{" "}
								<span className="text-yellow-400 font-bold">
									{error.availableQty}
								</span>{" "}
								available. Requested:{" "}
								<span className="text-white/90">{error.requestedQty}</span>
							</p>
						</div>

						{onAdjust && (
							<Button
								size="sm"
								variant="ghost"
								onClick={() => onAdjust(error.availableQty)}
								className="flex-shrink-0 h-8 px-3 bg-yellow-900/20 hover:bg-yellow-900/40 border border-yellow-600/30 text-yellow-400 hover:text-yellow-300 clip-mecha-button"
							>
								<RefreshCw className="w-3 h-3 mr-1.5" />
								<span className="text-xs font-bold tracking-wider font-[family-name:var(--font-heading)]">
									ADJUST
								</span>
							</Button>
						)}
					</div>
				</div>
			</div>
		);
	}

	if (error.error === "product_inactive") {
		return (
			<div className="relative overflow-hidden mb-3">
				<div className="clip-mecha-panel-sm bg-gray-900/40 border-2 border-gray-600/50 p-3">
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0 mt-0.5">
							<div className="w-8 h-8 bg-gray-600 clip-mecha-button flex items-center justify-center">
								<AlertCircle className="w-4 h-4 text-black" />
							</div>
						</div>

						<div className="flex-1 min-w-0">
							<p className="text-gray-400 font-bold tracking-wider text-xs font-[family-name:var(--font-display)] mb-1">
								PRODUCT INACTIVE
							</p>
							<p className="text-white/50 text-xs font-[family-name:var(--font-body)]">
								This product is no longer available. Remove to proceed.
							</p>
						</div>

						<Button
							size="sm"
							variant="ghost"
							onClick={onRemove}
							className="flex-shrink-0 h-8 px-3 bg-gray-900/20 hover:bg-gray-900/40 border border-gray-600/30 text-gray-400 hover:text-gray-300 clip-mecha-button"
						>
							<Trash2 className="w-3 h-3 mr-1.5" />
							<span className="text-xs font-bold tracking-wider font-[family-name:var(--font-heading)]">
								REMOVE
							</span>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return null;
}

// Summary banner for validation errors
interface ValidationSummaryProps {
	errorCount: number;
	onFixAll: () => void;
	isFixing?: boolean;
}

export function ValidationSummary({
	errorCount,
	onFixAll,
	isFixing = false,
}: ValidationSummaryProps) {
	if (errorCount === 0) return null;

	return (
		<div className="relative overflow-hidden mb-6 animate-slide-in-up">
			{/* Animated scan line */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[var(--mecha-orange)] to-transparent animate-mecha-scan opacity-50" />
			</div>

			{/* Caution stripe background */}
			<div className="absolute inset-0 caution-stripes-sm opacity-10" />

			<div className="relative clip-mecha-panel bg-[var(--mecha-orange-dark)] border-2 border-[var(--mecha-orange)] p-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-[var(--mecha-orange)] clip-mecha-button flex items-center justify-center animate-mecha-glow">
							<AlertCircle className="w-5 h-5 text-black" />
						</div>
						<div>
							<p className="text-white font-black tracking-wider text-sm font-[family-name:var(--font-display)]">
								VALIDATION FAILED
							</p>
							<p className="text-white/80 text-xs font-[family-name:var(--font-body)]">
								{errorCount} {errorCount === 1 ? "item has" : "items have"}{" "}
								stock issues
							</p>
						</div>
					</div>

					<Button
						onClick={onFixAll}
						disabled={isFixing}
						className="h-10 px-6 bg-black hover:bg-black/80 border-2 border-[var(--mecha-orange)] text-[var(--mecha-orange)] hover:text-white clip-mecha-button font-bold tracking-wider font-[family-name:var(--font-heading)] transition-all"
					>
						{isFixing ? (
							<>
								<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
								FIXING...
							</>
						) : (
							<>
								<RefreshCw className="w-4 h-4 mr-2" />
								FIX ISSUES
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
