import { Link } from "@tanstack/react-router";
import { Trash2, Plus, Minus, Package } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CartItem } from "../types";
import type { StockValidationError } from "../types";
import { StockValidationErrorBadge } from "./stock-validation-error";

interface CartItemCardProps {
	item: CartItem;
	onUpdateQuantity: (itemId: string, newQuantity: number) => void;
	onRemove: (itemId: string) => void;
	validationError?: StockValidationError;
	isRemoving?: boolean;
	isUpdating?: boolean;
	animationDelay?: number;
}

export function CartItemCard({
	item,
	onUpdateQuantity,
	onRemove,
	validationError,
	isRemoving = false,
	isUpdating = false,
	animationDelay = 0,
}: CartItemCardProps) {
	const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

	const handleRemove = () => {
		if (showRemoveConfirm) {
			onRemove(item.id);
			setShowRemoveConfirm(false);
		} else {
			setShowRemoveConfirm(true);
			setTimeout(() => setShowRemoveConfirm(false), 3000); // Reset after 3s
		}
	};

	const handleQuantityChange = (delta: number) => {
		const newQuantity = item.quantity + delta;
		if (newQuantity >= 1) {
			onUpdateQuantity(item.id, newQuantity);
		}
	};

	const handleAdjustToAvailable = (availableQty: number) => {
		onUpdateQuantity(item.id, availableQty);
	};

	// Calculate if quantity exceeds stock
	const hasStockWarning =
		!validationError && item.product_variant.stock_quantity < item.quantity;
	const isOutOfStock = !validationError && !item.product_variant.is_in_stock;

	return (
		<div
			className={`group transition-all duration-500 animate-slide-in-left ${
				isRemoving
					? "opacity-0 translate-x-8 scale-95"
					: "opacity-100 translate-x-0 scale-100"
			}`}
			style={{ animationDelay: `${animationDelay}ms` }}
		>
			{/* Validation Error */}
			{validationError && (
				<StockValidationErrorBadge
					error={validationError}
					onRemove={handleRemove}
					onAdjust={
						validationError.error === "insufficient_stock"
							? handleAdjustToAvailable
							: undefined
					}
				/>
			)}

			{/* Main Card */}
			<div className="relative overflow-hidden">
				{/* Tech grid background */}
				<div className="absolute inset-0 tech-grid opacity-30" />

				{/* HUD corners */}
				<div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--mecha-orange)]" />
				<div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--mecha-orange)]" />
				<div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--mecha-orange)]" />
				<div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--mecha-orange)]" />

				<div className="relative clip-mecha-panel bg-[var(--mecha-gray-dark)] border border-[var(--mecha-orange)]/30 hover:border-[var(--mecha-orange)]/60 transition-all p-4 md:p-6">
					<div className="flex gap-4 md:gap-6">
						{/* Product Image */}
						<div className="relative flex-shrink-0">
							<div className="w-24 h-24 md:w-32 md:h-32 clip-mecha-panel-sm overflow-hidden bg-[var(--mecha-black)]">
								{item.product.image_urls[0] ? (
									<img
										src={item.product.image_urls[0]}
										alt={item.product.name}
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<Package className="w-8 h-8 text-white/20" />
									</div>
								)}
							</div>

							{/* Quantity badge */}
							{item.quantity > 1 && (
								<div className="absolute -top-2 -right-2 w-8 h-8 clip-mecha-button bg-[var(--mecha-orange)] flex items-center justify-center">
									<span className="text-xs font-black text-black font-[family-name:var(--font-display)]">
										×{item.quantity}
									</span>
								</div>
							)}
						</div>

						{/* Item Details */}
						<div className="flex-1 min-w-0 space-y-3">
							{/* Header: Name & Price */}
							<div className="flex justify-between gap-4">
								<div className="flex-1 min-w-0">
									<Link
										to={`/product/${item.product.id}`}
										className="group/link inline-block"
									>
										<h3 className="text-base md:text-lg font-bold tracking-tight text-white font-[family-name:var(--font-heading)] mb-1 truncate group-hover/link:text-[var(--mecha-orange)] transition-colors">
											{item.product.name}
										</h3>
									</Link>

									{/* Variant attributes */}
									<div className="flex flex-wrap gap-1.5 mb-2">
										{Object.entries(item.product_variant.attributes).map(
											([key, value]) => (
												<span
													key={key}
													className="text-xs px-2 py-1 clip-mecha-button bg-[var(--mecha-black)] text-[var(--mecha-orange)]/80 border border-[var(--mecha-orange)]/20 font-[family-name:var(--font-body)]"
												>
													{key.toUpperCase()}: {value}
												</span>
											),
										)}
									</div>

									<p className="text-xs text-white/40 font-[family-name:var(--font-body)]">
										SKU: {item.product_variant.sku}
									</p>
								</div>

								{/* Price */}
								<div className="text-right flex-shrink-0">
									<p className="text-xl md:text-2xl font-black tracking-tight text-[var(--mecha-orange)] font-[family-name:var(--font-display)]">
										${item.subtotal.toFixed(2)}
									</p>
									<p className="text-xs text-white/40 font-[family-name:var(--font-body)]">
										${item.price_snapshot.toFixed(2)} each
									</p>
								</div>
							</div>

							{/* Stock Warnings (non-validation) */}
							{isOutOfStock && !validationError && (
								<div className="caution-stripes-sm p-2 clip-mecha-button">
									<p className="text-xs text-white font-bold tracking-wider font-[family-name:var(--font-display)]">
										⚠ OUT OF STOCK
									</p>
								</div>
							)}

							{hasStockWarning && !validationError && (
								<div className="bg-yellow-900/20 border border-yellow-600/30 p-2 clip-mecha-button">
									<p className="text-xs text-yellow-400 font-[family-name:var(--font-body)]">
										⚠ Only {item.product_variant.stock_quantity} available
									</p>
								</div>
							)}

							{/* Quantity Controls */}
							<div className="flex items-center justify-between gap-4 pt-2">
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => handleQuantityChange(-1)}
										disabled={item.quantity <= 1 || isUpdating}
										className="w-10 h-10 clip-mecha-button flex items-center justify-center border-2 border-[var(--mecha-orange)]/30 hover:border-[var(--mecha-orange)] hover:bg-[var(--mecha-orange)]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn"
										aria-label="Decrease quantity"
									>
										<Minus className="w-4 h-4 text-[var(--mecha-orange)] group-hover/btn:text-white transition-colors" />
									</button>

									<div className="w-16 h-10 clip-mecha-button bg-[var(--mecha-black)] border-2 border-[var(--mecha-orange)]/50 flex items-center justify-center">
										<span className="text-base font-black text-[var(--mecha-orange)] tracking-wider font-[family-name:var(--font-display)]">
											{item.quantity}
										</span>
									</div>

									<button
										type="button"
										onClick={() => handleQuantityChange(1)}
										disabled={isUpdating}
										className="w-10 h-10 clip-mecha-button flex items-center justify-center border-2 border-[var(--mecha-orange)]/30 hover:border-[var(--mecha-orange)] hover:bg-[var(--mecha-orange)]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn"
										aria-label="Increase quantity"
									>
										<Plus className="w-4 h-4 text-[var(--mecha-orange)] group-hover/btn:text-white transition-colors" />
									</button>
								</div>

								{/* Remove Button */}
								<Button
									onClick={handleRemove}
									disabled={isUpdating}
									variant="ghost"
									size="sm"
									className={`h-10 px-4 clip-mecha-button transition-all font-[family-name:var(--font-heading)] ${
										showRemoveConfirm
											? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
											: "bg-[var(--mecha-gray)] hover:bg-red-900/40 text-white/60 hover:text-red-400 border-2 border-white/10 hover:border-red-500/30"
									}`}
								>
									<Trash2 className="w-3.5 h-3.5 mr-2" />
									<span className="text-xs font-bold tracking-wider">
										{showRemoveConfirm ? "CONFIRM?" : "REMOVE"}
									</span>
								</Button>
							</div>
						</div>
					</div>

					{/* Loading overlay */}
					{isUpdating && (
						<div className="absolute inset-0 bg-[var(--mecha-black)]/60 backdrop-blur-sm flex items-center justify-center">
							<div className="w-8 h-8 border-2 border-[var(--mecha-orange)] border-t-transparent rounded-full animate-spin" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
