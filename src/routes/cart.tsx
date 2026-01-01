import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	ShoppingBag,
	Trash2,
	Plus,
	Minus,
	AlertCircle,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	useCartStore,
	useCheckoutValidation,
	type StockValidationError,
} from "@/features/cart";
import { useAuthStore } from "@/features/auth";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
	const navigate = useNavigate();
	const { user, accessToken, isAuthenticated } = useAuthStore();
	const {
		cart,
		guestCart,
		isLoading,
		error,
		updateGuestItem,
		removeGuestItem,
		clearGuestCart,
		updateItem,
		removeItem,
	} = useCartStore();

	const { validateStock, isValidating, validationErrors, clearErrors } =
		useCheckoutValidation();

	const [removingItemId, setRemovingItemId] = useState<string | null>(null);
	const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
	const [isFixingErrors, setIsFixingErrors] = useState(false);

	// Determine which cart to display
	const displayCart = isAuthenticated ? cart : null;
	const displayGuestCart = !isAuthenticated ? guestCart : [];

	// Calculate totals
	const subtotal = isAuthenticated ? cart?.subtotal || 0 : 0;
	const itemCount = isAuthenticated
		? cart?.item_count || 0
		: guestCart.reduce((sum, item) => sum + item.quantity, 0);

	const TAX_RATE = 0.085;
	const FREE_DELIVERY_THRESHOLD = 50;
	const DELIVERY_FEE = 4.99;

	const tax = subtotal * TAX_RATE;
	const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
	const total = subtotal + tax + delivery;

	// Map validation errors to cart items
	const validationErrorMap = useMemo(() => {
		const map = new Map<string, StockValidationError>();
		for (const error of validationErrors) {
			map.set(error.productId, error);
		}
		return map;
	}, [validationErrors]);

	// Scroll to top on mount
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	// Handlers
	const handleRemoveItem = async (itemId: string) => {
		setRemovingItemId(itemId);
		setTimeout(async () => {
			if (isAuthenticated && accessToken) {
				await removeItem(accessToken, itemId);
			}
			setRemovingItemId(null);
			clearErrors();
		}, 300);
	};

	const handleRemoveGuestItem = (variantId: string) => {
		setRemovingItemId(variantId);
		setTimeout(() => {
			removeGuestItem(variantId);
			setRemovingItemId(null);
		}, 300);
	};

	const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
		if (isAuthenticated && accessToken) {
			setUpdatingItemId(itemId);
			await updateItem(accessToken, itemId, newQuantity);
			setUpdatingItemId(null);
			clearErrors();
		}
	};

	const handleUpdateGuestQuantity = (
		variantId: string,
		newQuantity: number,
	) => {
		updateGuestItem(variantId, newQuantity);
	};

	const handleClearCart = () => {
		if (isAuthenticated && cart && accessToken) {
			for (const item of cart.items) {
				handleRemoveItem(item.id);
			}
		} else {
			clearGuestCart();
		}
	};

	const handleProceedToCheckout = async () => {
		if (!isAuthenticated || !cart) return;

		const validationRequest = {
			items: cart.items.map((item) => ({
				productId: item.product.id,
				variantId: item.product_variant.id,
				quantity: item.quantity,
			})),
		};

		const result = await validateStock(validationRequest);

		if (result.valid) {
			navigate({ to: "/checkout" });
		}
	};

	const handleFixAllIssues = async () => {
		if (!isAuthenticated || !cart || !accessToken) return;

		setIsFixingErrors(true);

		for (const error of validationErrors) {
			if (
				error.error === "out_of_stock" ||
				error.error === "product_inactive"
			) {
				const item = cart.items.find((i) => i.product.id === error.productId);
				if (item) await handleRemoveItem(item.id);
			}
		}

		for (const error of validationErrors) {
			if (error.error === "insufficient_stock") {
				const item = cart.items.find((i) => i.product.id === error.productId);
				if (item) await handleUpdateQuantity(item.id, error.availableQty);
			}
		}

		setTimeout(async () => {
			const validationRequest = {
				items: cart.items.map((item) => ({
					productId: item.product.id,
					variantId: item.product_variant.id,
					quantity: item.quantity,
				})),
			};
			await validateStock(validationRequest);
			setIsFixingErrors(false);
		}, 500);
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
					<div className="animate-pulse space-y-6">
						<div className="h-10 w-48 bg-white/10 rounded mb-8" />
						<div className="grid lg:grid-cols-[1fr,400px] gap-8">
							<div className="space-y-6">
								{[1, 2, 3].map((i) => (
									<div key={i} className="h-48 bg-white/5" />
								))}
							</div>
							<div className="h-96 bg-white/5 lg:sticky lg:top-8" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Empty cart state
	if (itemCount === 0) {
		return (
			<div className="min-h-screen bg-black text-white flex flex-col">
				<header className="border-b border-white/10">
					<div className="max-w-7xl mx-auto px-4 md:px-6">
						<div className="flex items-center justify-between h-16">
							<Link
								to="/"
								className="flex items-center gap-2 hover:text-gray-300 transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
								<span className="hidden md:inline text-sm font-medium tracking-wide">
									BACK
								</span>
							</Link>
							<h1 className="text-lg md:text-xl font-black tracking-tighter">
								YOUR CART
							</h1>
							<div className="w-20" />
						</div>
					</div>
				</header>

				<div className="flex-1 flex items-center justify-center px-4 md:px-6">
					<div className="text-center max-w-md">
						<div className="mb-8 flex justify-center">
							<ShoppingBag className="w-24 h-24 text-white/10" />
						</div>
						<h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
							CART IS EMPTY
						</h2>
						<p className="text-gray-400 text-base mb-8">
							{isAuthenticated
								? "Your cart is waiting to be filled with amazing products"
								: "Start shopping to add items to your cart"}
						</p>
						<Link to="/categories">
							<Button className="bg-white text-black hover:bg-gray-200 rounded-none h-12 px-8 font-bold tracking-wide">
								BROWSE COLLECTIONS
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	// Guest cart view
	if (!isAuthenticated && displayGuestCart.length > 0) {
		return (
			<div className="min-h-screen bg-black text-white">
				<header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
					<div className="max-w-7xl mx-auto px-4 md:px-6">
						<div className="flex items-center justify-between h-16">
							<Link
								to="/"
								className="flex items-center gap-2 hover:text-gray-300 transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
								<span className="hidden md:inline text-sm font-medium tracking-wide">
									BACK
								</span>
							</Link>
							<div className="flex items-center gap-4">
								<h1 className="text-lg md:text-xl font-black tracking-tighter">
									YOUR CART
								</h1>
								<div className="flex items-center justify-center w-8 h-8 bg-white text-black text-sm font-black rounded-sm">
									{itemCount}
								</div>
							</div>
							<Button
								variant="ghost"
								onClick={handleClearCart}
								className="text-gray-400 hover:text-white hover:bg-white/5 md:block hidden"
							>
								Clear All
							</Button>
						</div>
					</div>
				</header>

				<div className="bg-yellow-900/20 border-b border-yellow-700/30">
					<div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
						<p className="text-sm text-yellow-400">
							<span className="font-bold">Guest Cart:</span> Login to see
							product details, prices, and checkout. Your cart will be saved.
						</p>
					</div>
				</div>

				<main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
					<div className="space-y-6">
						{displayGuestCart.map((item) => (
							<div
								key={item.product_variant_id}
								className={`transition-all duration-300 ${
									removingItemId === item.product_variant_id
										? "opacity-0 translate-x-8"
										: "opacity-100 translate-x-0"
								}`}
							>
								<div className="flex gap-4 md:gap-6 p-4 md:p-6 bg-white/5 border border-white/10">
									<div className="relative flex-shrink-0 w-24 md:w-32 h-24 md:h-32 bg-gray-900 flex items-center justify-center">
										<ShoppingBag className="w-8 h-8 text-white/20" />
									</div>

									<div className="flex-1 min-w-0">
										<h3 className="text-base md:text-lg font-bold tracking-tight mb-1">
											Variant ID: {item.product_variant_id.slice(0, 8)}...
										</h3>
										<p className="text-sm text-gray-400 mb-4">
											Login to see product details
										</p>

										<div className="flex items-center justify-between gap-4">
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() =>
														handleUpdateGuestQuantity(
															item.product_variant_id,
															item.quantity - 1,
														)
													}
													className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white hover:bg-white/5 transition-all disabled:opacity-30"
													disabled={item.quantity <= 1}
												>
													<Minus className="w-4 h-4" />
												</button>
												<div className="w-16 text-center font-bold tracking-wider">
													{item.quantity}
												</div>
												<button
													type="button"
													onClick={() =>
														handleUpdateGuestQuantity(
															item.product_variant_id,
															item.quantity + 1,
														)
													}
													className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white hover:bg-white/5 transition-all"
												>
													<Plus className="w-4 h-4" />
												</button>
											</div>

											<button
												type="button"
												onClick={() =>
													handleRemoveGuestItem(item.product_variant_id)
												}
												className="p-2 hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
							</div>
						))}

						<div className="pt-6 border-t border-white/10 text-center">
							<Link to="/login">
								<Button className="w-full md:w-auto bg-white text-black hover:bg-gray-200 rounded-none h-12 px-8 font-bold tracking-wide">
									LOGIN TO CHECKOUT
								</Button>
							</Link>
						</div>
					</div>
				</main>
			</div>
		);
	}

	// Authenticated cart view
	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
				<div className="max-w-7xl mx-auto px-4 md:px-6">
					<div className="flex items-center justify-between h-16">
						<Link
							to="/"
							className="flex items-center gap-2 hover:text-gray-300 transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
							<span className="hidden md:inline text-sm font-medium tracking-wide">
								BACK
							</span>
						</Link>
						<div className="flex items-center gap-4">
							<h1 className="text-lg md:text-xl font-black tracking-tighter">
								YOUR CART
							</h1>
							<div className="flex items-center justify-center w-8 h-8 bg-white text-black text-sm font-black rounded-sm">
								{itemCount}
							</div>
						</div>
						<Button
							variant="ghost"
							onClick={handleClearCart}
							className="text-gray-400 hover:text-white hover:bg-white/5 md:block hidden"
						>
							Clear All
						</Button>
					</div>
				</div>
			</header>

			{/* Error State */}
			{error && (
				<div className="bg-red-900/20 border-b border-red-700/30">
					<div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
						<p className="text-sm text-red-400">
							<span className="font-bold">Error:</span> {error}
						</p>
					</div>
				</div>
			)}

			{/* Validation Summary */}
			{validationErrors.length > 0 && (
				<div className="bg-red-900/20 border-b border-red-700/30">
					<div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
						<div className="flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<AlertCircle className="w-5 h-5 text-red-400" />
								<div>
									<p className="text-sm font-bold text-red-400">
										VALIDATION FAILED
									</p>
									<p className="text-xs text-red-400/80">
										{validationErrors.length}{" "}
										{validationErrors.length === 1 ? "item has" : "items have"}{" "}
										stock issues
									</p>
								</div>
							</div>

							<Button
								onClick={handleFixAllIssues}
								disabled={isFixingErrors}
								size="sm"
								className="bg-red-600 hover:bg-red-700 text-white rounded-none"
							>
								{isFixingErrors ? "FIXING..." : "FIX ISSUES"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
				<div className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12">
					{/* Items List */}
					<div className="space-y-6">
						{displayCart?.items.map((cartItem) => {
							const itemValidationError = validationErrorMap.get(
								cartItem.product.id,
							);
							const hasStockWarning =
								!itemValidationError &&
								cartItem.product_variant.stock_quantity < cartItem.quantity;
							const isOutOfStock =
								!itemValidationError && !cartItem.product_variant.is_in_stock;

							return (
								<div
									key={cartItem.id}
									className={`group transition-all duration-300 ${
										removingItemId === cartItem.id
											? "opacity-0 translate-x-8"
											: "opacity-100 translate-x-0"
									}`}
								>
									{/* Validation Error */}
									{itemValidationError && (
										<div className="mb-3 p-3 bg-red-900/20 border border-red-700/30">
											<div className="flex items-start gap-3">
												<AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
												<div className="flex-1">
													<p className="text-sm font-bold text-red-400 mb-1">
														{itemValidationError.error === "out_of_stock" &&
															"OUT OF STOCK"}
														{itemValidationError.error ===
															"insufficient_stock" && "INSUFFICIENT STOCK"}
														{itemValidationError.error === "product_inactive" &&
															"PRODUCT INACTIVE"}
													</p>
													<p className="text-xs text-red-400/80">
														{itemValidationError.error === "out_of_stock" &&
															"This item is no longer available. Remove to proceed."}
														{itemValidationError.error ===
															"insufficient_stock" &&
															`Only ${itemValidationError.availableQty} available. Requested: ${itemValidationError.requestedQty}`}
														{itemValidationError.error === "product_inactive" &&
															"This product is no longer available."}
													</p>
												</div>
												<Button
													size="sm"
													onClick={() => {
														if (
															itemValidationError.error === "insufficient_stock"
														) {
															handleUpdateQuantity(
																cartItem.id,
																itemValidationError.availableQty,
															);
														} else {
															handleRemoveItem(cartItem.id);
														}
													}}
													className="bg-red-600 hover:bg-red-700 text-white rounded-none text-xs"
												>
													{itemValidationError.error === "insufficient_stock"
														? "ADJUST"
														: "REMOVE"}
												</Button>
											</div>
										</div>
									)}

									{/* Cart Item */}
									<div className="flex gap-4 md:gap-6 p-4 md:p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
										{/* Image */}
										<div className="relative flex-shrink-0 w-24 md:w-32 h-24 md:h-32 bg-gray-900 overflow-hidden">
											{cartItem.product.image_urls[0] ? (
												<img
													src={cartItem.product.image_urls[0]}
													alt={cartItem.product.name}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<ShoppingBag className="w-8 h-8 text-white/20" />
												</div>
											)}
											{cartItem.quantity > 1 && (
												<div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm">
													<div className="flex items-center justify-center h-6 text-xs font-black tracking-wider">
														× {cartItem.quantity}
													</div>
												</div>
											)}
										</div>

										{/* Details */}
										<div className="flex-1 min-w-0 space-y-3">
											<div className="flex justify-between gap-4">
												<div className="flex-1 min-w-0">
													<Link
														to={`/product/${cartItem.product.id}`}
														className="hover:text-gray-300 transition-colors"
													>
														<h3 className="text-base md:text-lg font-bold tracking-tight mb-1 truncate">
															{cartItem.product.name}
														</h3>
													</Link>
													<div className="flex flex-wrap gap-1 mb-2">
														{Object.entries(
															cartItem.product_variant.attributes,
														).map(([key, value]) => (
															<span
																key={key}
																className="text-xs px-2 py-1 bg-white/10 text-gray-400"
															>
																{key}: {value}
															</span>
														))}
													</div>
													<p className="text-xs text-gray-500">
														SKU: {cartItem.product_variant.sku}
													</p>
												</div>
												<div className="text-right flex-shrink-0">
													<p className="text-lg md:text-xl font-black tracking-tight">
														${cartItem.subtotal.toFixed(2)}
													</p>
													<p className="text-xs text-gray-500">
														${cartItem.price_snapshot.toFixed(2)} each
													</p>
												</div>
											</div>

											{/* Stock Warnings */}
											{isOutOfStock && !itemValidationError && (
												<div className="px-2 py-1 bg-red-900/20 border border-red-700/30">
													<p className="text-xs text-red-400 font-bold">
														⚠ OUT OF STOCK
													</p>
												</div>
											)}

											{hasStockWarning && !itemValidationError && (
												<div className="px-2 py-1 bg-yellow-900/20 border border-yellow-700/30">
													<p className="text-xs text-yellow-400">
														⚠ Only {cartItem.product_variant.stock_quantity}{" "}
														available
													</p>
												</div>
											)}

											{/* Quantity Controls */}
											<div className="flex items-center justify-between gap-4 pt-2">
												<div className="flex items-center gap-2">
													<button
														type="button"
														onClick={() =>
															handleUpdateQuantity(
																cartItem.id,
																cartItem.quantity - 1,
															)
														}
														disabled={
															cartItem.quantity <= 1 ||
															updatingItemId === cartItem.id
														}
														className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
														aria-label="Decrease quantity"
													>
														<Minus className="w-4 h-4" />
													</button>

													<div className="w-16 text-center font-bold tracking-wider">
														{cartItem.quantity}
													</div>

													<button
														type="button"
														onClick={() =>
															handleUpdateQuantity(
																cartItem.id,
																cartItem.quantity + 1,
															)
														}
														disabled={updatingItemId === cartItem.id}
														className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
														aria-label="Increase quantity"
													>
														<Plus className="w-4 h-4" />
													</button>
												</div>

												<button
													type="button"
													onClick={() => handleRemoveItem(cartItem.id)}
													className="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-500 hover:text-red-400 transition-colors"
												>
													<Trash2 className="w-3 h-3" />
													REMOVE
												</button>
											</div>
										</div>
									</div>
								</div>
							);
						})}

						{/* Continue Shopping */}
						<div className="pt-6 border-t border-white/10">
							<Link to="/categories">
								<Button
									variant="outline"
									className="w-full md:w-auto border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-medium tracking-wide"
								>
									CONTINUE SHOPPING
								</Button>
							</Link>
						</div>
					</div>

					{/* Order Summary */}
					<div className="lg:sticky lg:top-8">
						<div className="bg-white/5 border border-white/10 p-6 md:p-8 space-y-6">
							<h2 className="text-xl font-black tracking-tight">
								ORDER SUMMARY
							</h2>

							{/* Price Breakdown */}
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400">Subtotal</span>
									<span className="font-bold tracking-wider">
										${subtotal.toFixed(2)}
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400">Tax (8.5%)</span>
									<span className="font-bold tracking-wider">
										${tax.toFixed(2)}
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400">Delivery</span>
									<span className="font-bold tracking-wider">
										{delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}
									</span>
								</div>

								<div className="h-px bg-white/10" />

								<div className="flex justify-between items-center pt-3">
									<span className="font-black tracking-tight text-lg">
										TOTAL
									</span>
									<span className="font-black tracking-tight text-2xl">
										${total.toFixed(2)}
									</span>
								</div>
							</div>

							{/* Free Delivery Progress */}
							{subtotal < FREE_DELIVERY_THRESHOLD && (
								<div className="bg-blue-900/20 border border-blue-700/30 p-4">
									<p className="text-xs font-medium tracking-wider text-blue-400 mb-2">
										FREE DELIVERY AVAILABLE
									</p>
									<div className="h-1 bg-blue-900/50 overflow-hidden">
										<div
											className="h-full bg-blue-500 transition-all duration-300"
											style={{
												width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%`,
											}}
										/>
									</div>
									<p className="text-xs text-gray-400 mt-2">
										Add ${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} more
										for free delivery
									</p>
								</div>
							)}

							{/* Checkout Button */}
							<Button
								onClick={handleProceedToCheckout}
								disabled={isValidating || validationErrors.length > 0}
								className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-14 font-bold tracking-wide text-base"
							>
								{isValidating
									? "VALIDATING STOCK..."
									: validationErrors.length > 0
										? "RESOLVE ERRORS"
										: "PROCEED TO CHECKOUT"}
							</Button>

							{/* Security Note */}
							<div className="flex items-center justify-center gap-2 text-xs text-gray-500">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								<span>Secure checkout powered by Stripe</span>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
