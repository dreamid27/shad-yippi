import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useCart, type CartItem } from '@/hooks/use-cart'
import type { Product, MenuItem } from '@/hooks/use-cart'

export const Route = createFileRoute('/cart')({ component: CartPage })

// Helper function to get image from either Product or MenuItem
function getItemImage(item: Product | MenuItem): string | undefined {
	if ('photos' in item) {
		// MenuItem type
		return item.photos?.[0]
	} else {
		// Product type
		return item.image
	}
}

// Helper function to get description from either Product or MenuItem
function getItemDescription(item: Product | MenuItem): string | undefined {
	if ('description' in item) {
		return item.description
	}
	return undefined
}

// Helper function to get dietary badges from MenuItem (fashion products don't have these)
function getDietaryBadges(item: Product | MenuItem) {
	if ('dietary' in item) {
		const badges = []
		if (item.dietary.vegan) badges.push({ label: 'VEGAN', color: 'green' })
		if (item.dietary.vegetarian) badges.push({ label: 'VEG', color: 'emerald' })
		if (item.dietary.gluten_free) badges.push({ label: 'GF', color: 'blue' })
		if (item.spice_level !== 'mild') badges.push({ label: item.spice_level.toUpperCase(), color: 'red' })
		return badges
	}
	return []
}

function CartPage() {
	const { items, removeItem, updateQuantity, clearCart, subtotal, isHydrated } = useCart()
	const [isLoading, setIsLoading] = useState(true)
	const [removedItemId, setRemovedItemId] = useState<string | null>(null)
	const cartContainerRef = useRef<HTMLDivElement>(null)

	// Simulate loading state for smoother experience
	useEffect(() => {
		if (isHydrated) {
			const timer = setTimeout(() => setIsLoading(false), 300)
			return () => clearTimeout(timer)
		}
	}, [isHydrated])

	// Scroll to top on mount
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [])

	// Animate item removal
	const handleRemoveItem = (itemId: string) => {
		setRemovedItemId(itemId)
		setTimeout(() => {
			removeItem(itemId)
			setRemovedItemId(null)
		}, 300)
	}

	if (isLoading || !isHydrated) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
					<div className="animate-pulse">
						<div className="h-8 w-32 bg-white/10 rounded mb-8" />
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
		)
	}

	if (items.length === 0) {
		return (
			<div className="min-h-screen bg-black text-white flex flex-col">
				{/* Header */}
				<header className="border-b border-white/10">
					<div className="max-w-7xl mx-auto px-4 md:px-6">
						<div className="flex items-center justify-between h-16">
							<Link
								to="/"
								className="flex items-center gap-2 hover:text-gray-300 transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
								<span className="hidden md:inline text-sm font-medium tracking-wide">BACK</span>
							</Link>
							<h1 className="text-lg md:text-xl font-black tracking-tighter">YOUR CART</h1>
							<div className="w-20" />
						</div>
					</div>
				</header>

				{/* Empty State */}
				<div className="flex-1 flex items-center justify-center px-4 md:px-6">
					<div className="text-center max-w-md">
						<div className="mb-8 flex justify-center">
							<div className="relative">
								<ShoppingBag className="w-24 h-24 text-white/10" />
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-6xl font-black text-white/20">0</div>
								</div>
							</div>
						</div>
						<h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
							CART IS EMPTY
						</h2>
						<p className="text-gray-400 text-base mb-8">
							Your cart is waiting to be filled with delicious items
						</p>
						<Link to="/categories">
							<Button className="bg-white text-black hover:bg-gray-200 rounded-none h-12 px-8 font-bold tracking-wide text-base">
								BROWSE MENU
							</Button>
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-black text-white" ref={cartContainerRef}>
			{/* Header */}
			<header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
				<div className="max-w-7xl mx-auto px-4 md:px-6">
					<div className="flex items-center justify-between h-16">
						<Link
							to="/"
							className="flex items-center gap-2 hover:text-gray-300 transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
							<span className="hidden md:inline text-sm font-medium tracking-wide">BACK</span>
						</Link>
						<div className="flex items-center gap-4">
							<h1 className="text-lg md:text-xl font-black tracking-tighter">YOUR CART</h1>
							<div className="flex items-center justify-center w-8 h-8 bg-white text-black text-sm font-black rounded-sm">
								{items.reduce((total, item) => total + item.quantity, 0)}
							</div>
						</div>
						<Button
							variant="ghost"
							onClick={clearCart}
							className="text-gray-400 hover:text-white hover:bg-white/5 md:block hidden"
						>
							Clear All
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
				<div className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12">
					{/* Items List */}
					<div className="space-y-6">
						{/* Progress Bar */}
						<div className="mb-8">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-bold tracking-wider text-gray-400">
									ORDER PROGRESS
								</span>
								<span className="text-sm font-bold tracking-wider">
									{items.reduce((total, item) => total + item.quantity, 0)} ITEMS
								</span>
							</div>
							<div className="h-1 bg-white/10 overflow-hidden">
								<div className="h-full bg-white transition-all duration-500 ease-out" style={{ width: '100%' }} />
							</div>
						</div>

						{/* Cart Items */}
						{items.map((cartItem, index) => (
							<div
								key={cartItem.item.id}
								className={`group transition-all duration-300 ${
									removedItemId === cartItem.item.id
										? 'opacity-0 translate-x-8'
										: 'opacity-100 translate-x-0'
								}`}
								style={{
									animationDelay: `${index * 100}ms`,
								}}
							>
								<div className="flex gap-4 md:gap-6 p-4 md:p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
									{/* Item Image */}
									<div className="relative flex-shrink-0 aspect-square w-24 md:w-32 overflow-hidden">
										{getItemImage(cartItem.item) && (
											<div
												className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
												style={{
													backgroundImage: `url(${getItemImage(cartItem.item)})`,
													backgroundSize: 'cover',
													backgroundPosition: 'center',
												}}
											/>
										)}
										{cartItem.quantity > 1 && (
											<div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm">
												<div className="flex items-center justify-center h-6 text-xs font-black tracking-wider">
													× {cartItem.quantity}
												</div>
											</div>
										)}
									</div>

									{/* Item Details */}
									<div className="flex-1 min-w-0">
										<div className="flex justify-between gap-4 mb-2">
											<div className="flex-1 min-w-0">
												<h3 className="text-base md:text-lg font-bold tracking-tight mb-1 truncate">
													{cartItem.item.name}
												</h3>
												{getItemDescription(cartItem.item) && (
													<p className="text-sm text-gray-400 line-clamp-2 mb-2">
														{getItemDescription(cartItem.item)}
													</p>
												)}
											</div>
											<div className="text-right flex-shrink-0">
												<p className="text-lg md:text-xl font-black tracking-tight">
													${(cartItem.item.price * cartItem.quantity).toFixed(2)}
												</p>
												<p className="text-xs text-gray-500">
													${cartItem.item.price.toFixed(2)} each
												</p>
											</div>
										</div>

										{/* Quantity Controls */}
										<div className="flex items-center justify-between gap-4">
											<div className="flex items-center gap-2">
												<button
													onClick={() =>
														updateQuantity(String(cartItem.item.id), cartItem.quantity - 1)
													}
													className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-white/20 hover:border-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
													disabled={cartItem.quantity <= 1}
													aria-label="Decrease quantity"
												>
													<Minus className="w-4 h-4" />
												</button>
												<div className="w-12 md:w-16 text-center font-bold tracking-wider">
													{cartItem.quantity}
												</div>
												<button
													onClick={() =>
														updateQuantity(String(cartItem.item.id), cartItem.quantity + 1)
													}
													className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-white/20 hover:border-white hover:bg-white/5 transition-all"
													aria-label="Increase quantity"
												>
													<Plus className="w-4 h-4" />
												</button>
											</div>

											{/* Dietary Badges */}
											<div className="flex flex-wrap gap-1.5">
												{getDietaryBadges(cartItem.item).map((badge, idx) => (
													<span
														key={idx}
														className={`px-2 py-1 text-[10px] font-bold tracking-wider border ${
															badge.color === 'green'
																? 'bg-green-900/50 text-green-400 border-green-700/50'
																: badge.color === 'emerald'
																	? 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50'
																	: badge.color === 'blue'
																		? 'bg-blue-900/50 text-blue-400 border-blue-700/50'
																		: 'bg-red-900/50 text-red-400 border-red-700/50'
														}`}
													>
														{badge.label}
													</span>
												))}
											</div>

											{/* Remove Button */}
											<button
												onClick={() => handleRemoveItem(String(cartItem.item.id))}
												className="md:hidden p-2 hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400"
												aria-label="Remove item"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>

										{/* Remove Button Desktop */}
										<div className="hidden md:block mt-3 pt-3 border-t border-white/5">
											<button
												onClick={() => handleRemoveItem(String(cartItem.item.id))}
												className="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-500 hover:text-red-400 transition-colors"
											>
												<Trash2 className="w-3 h-3" />
												REMOVE
											</button>
										</div>
									</div>
								</div>
							</div>
						))}

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
							<h2 className="text-xl font-black tracking-tight">ORDER SUMMARY</h2>

							{/* Subtotal */}
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400">Subtotal</span>
									<span className="font-bold tracking-wider">${subtotal.toFixed(2)}</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400">Tax (8.5%)</span>
									<span className="font-bold tracking-wider">${(subtotal * 0.085).toFixed(2)}</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400">Delivery</span>
									<span className="font-bold tracking-wider">
										{subtotal >= 50 ? 'FREE' : '$4.99'}
									</span>
								</div>

								<div className="h-px bg-white/10" />

								<div className="flex justify-between items-center pt-3">
									<span className="font-black tracking-tight text-lg">TOTAL</span>
									<span className="font-black tracking-tight text-2xl">
										${(subtotal + subtotal * 0.085 + (subtotal >= 50 ? 0 : 4.99)).toFixed(2)}
									</span>
								</div>
							</div>

							{/* Free Delivery Notice */}
							{subtotal < 50 && (
								<div className="bg-blue-900/20 border border-blue-700/30 p-4">
									<p className="text-xs font-medium tracking-wider text-blue-400 mb-2">
										FREE DELIVERY AVAILABLE
									</p>
									<div className="h-1 bg-blue-900/50 overflow-hidden">
										<div
											className="h-full bg-blue-500 transition-all duration-300"
											style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
										/>
									</div>
									<p className="text-xs text-gray-400 mt-2">
										Add ${(50 - subtotal).toFixed(2)} more for free delivery
									</p>
								</div>
							)}

							{/* Checkout Button */}
							<Button className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-14 font-bold tracking-wide text-base group">
								<span>PROCEED TO CHECKOUT</span>
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Button>

							{/* Security Note */}
							<div className="flex items-center justify-center gap-2 text-xs text-gray-500">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
								<span>Secure checkout powered by Stripe</span>
							</div>

							{/* Promo Code */}
							<div className="pt-4 border-t border-white/10">
								<p className="text-xs font-bold tracking-wider text-gray-400 mb-2">
									PROMO CODE
								</p>
								<div className="flex gap-2">
									<input
										type="text"
										placeholder="Enter code"
										className="flex-1 bg-transparent border border-white/20 px-4 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:border-white transition-colors"
									/>
									<Button
										variant="outline"
										className="border-white/20 text-white hover:bg-white/10 rounded-none h-10 px-4 font-medium"
									>
										APPLY
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
