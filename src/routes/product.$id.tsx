import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Search,
	ShoppingBag,
	ArrowLeft,
	Plus,
	Minus,
	Truck,
	Shield,
	RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart, type Product } from "@/hooks/use-cart";
import {
	useProductDetail,
	VariantSelector,
	StockIndicator,
	type ProductVariant,
} from "@/features/products";

export const Route = createFileRoute("/product/$id")({
	component: ProductDetailPage,
});

function ProductDetailPage() {
	const { addItem, itemCount } = useCart();
	const { id } = Route.useParams();
	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
		null,
	);
	const [quantity, setQuantity] = useState(1);
	const [isZoomed, setIsZoomed] = useState(false);
	const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
	const [addedToCart, setAddedToCart] = useState(false);

	// Fetch product detail from API
	const { data: product, isLoading, isError } = useProductDetail(id);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		setZoomPosition({ x, y });
	};

	const handleAddToCart = () => {
		if (!selectedVariant) {
			alert("Please select all product options");
			return;
		}

		if (!selectedVariant.is_in_stock || selectedVariant.stock_quantity === 0) {
			alert("This variant is currently out of stock");
			return;
		}

		if (quantity > selectedVariant.stock_quantity) {
			alert(`Only ${selectedVariant.stock_quantity} items available in stock`);
			return;
		}

		// TODO: Replace with real cart integration
		// For now, use existing useCart hook (to be refactored in Day 7-8)
		const cartProduct: Product = {
			id: product!.id,
			name: product!.name,
			price: selectedVariant.final_price,
			image: product!.image_urls[0],
			category: product!.category.name,
		};

		for (let i = 0; i < quantity; i++) {
			addItem(cartProduct);
		}

		setAddedToCart(true);
		setTimeout(() => setAddedToCart(false), 2000);
	};

	const handleVariantChange = (variant: ProductVariant | null) => {
		setSelectedVariant(variant);
		// Reset quantity when variant changes
		if (variant) {
			setQuantity(1);
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-white/10">
					<div className="max-w-7xl mx-auto px-6 py-4">
						<div className="flex items-center justify-between">
							<Link
								to="/categories"
								className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
								<span className="text-sm font-medium">BACK TO COLLECTIONS</span>
							</Link>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-center min-h-[60vh]">
					<div className="animate-pulse space-y-4 text-center">
						<div className="h-8 w-64 bg-gray-800 mx-auto" />
						<p className="text-gray-400">Loading product...</p>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (isError || !product) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-white/10">
					<div className="max-w-7xl mx-auto px-6 py-4">
						<div className="flex items-center justify-between">
							<Link
								to="/categories"
								className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
								<span className="text-sm font-medium">BACK TO COLLECTIONS</span>
							</Link>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
					<p className="text-xl text-gray-400">Product not found</p>
					<Button
						onClick={() => window.location.reload()}
						variant="outline"
						className="border-white/20 text-white hover:bg-white/10 hover:text-white"
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Navigation Header */}
			<div className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-white/10">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-6">
							<Link
								to="/categories"
								className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
								<span className="text-sm font-medium">BACK TO COLLECTIONS</span>
							</Link>
							<div className="h-6 w-px bg-white/20" />
							<h1 className="text-xl font-black tracking-tighter uppercase">
								{product.name}
							</h1>
						</div>

						<div className="flex items-center space-x-4">
							<button
								type="button"
								className="p-2 hover:bg-white/10 rounded-full transition-colors"
							>
								<Search className="w-5 h-5" />
							</button>
							<Link
								to="/cart"
								className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
							>
								<ShoppingBag className="w-5 h-5" />
								{itemCount > 0 && (
									<span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-white text-black text-xs font-black rounded-sm">
										{itemCount}
									</span>
								)}
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Product Detail */}
			<div className="max-w-7xl mx-auto px-6 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
					{/* Product Images */}
					<div className="space-y-4">
						<div
							className="relative h-[600px] lg:h-[800px] bg-gray-900 overflow-hidden cursor-zoom-in"
							onMouseEnter={() => setIsZoomed(true)}
							onMouseLeave={() => setIsZoomed(false)}
							onMouseMove={handleMouseMove}
						>
							{product.status === "published" && (
								<div className="absolute top-4 left-4 z-20 bg-white text-black px-3 py-1 text-xs font-black tracking-wider">
									NEW
								</div>
							)}
							<div
								className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
								style={{
									backgroundImage: `url(${product.image_urls[selectedImage] || product.image_urls[0]})`,
									transform: isZoomed ? "scale(2)" : "scale(1)",
									transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
								}}
							/>
						</div>

						{/* Image thumbnails */}
						{product.image_urls.length > 1 && (
							<div className="grid grid-cols-4 gap-4">
								{product.image_urls.slice(0, 4).map((img, idx) => (
									<button
										type="button"
										key={idx}
										onClick={() => setSelectedImage(idx)}
										className={`aspect-square bg-gray-900 border-2 transition-all ${
											selectedImage === idx
												? "border-white"
												: "border-white/20 hover:border-white/60"
										}`}
									>
										<div
											className="w-full h-full bg-cover bg-center"
											style={{ backgroundImage: `url(${img})` }}
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Product Information */}
					<div className="space-y-8">
						<div className="space-y-4">
							<div className="flex items-start justify-between">
								<div className="space-y-2">
									<h2 className="text-4xl lg:text-5xl font-black tracking-tighter">
										{product.name}
									</h2>
									<p className="text-lg text-gray-400">{product.brand.name}</p>
								</div>
								<div className="text-right">
									{product.min_price !== product.max_price ? (
										<p className="text-3xl font-bold">
											${product.min_price} - ${product.max_price}
										</p>
									) : (
										<p className="text-3xl font-bold">${product.base_price}</p>
									)}
								</div>
							</div>

							<p className="text-lg leading-relaxed text-gray-300">
								{product.description}
							</p>

							{/* Stock indicator for product-level */}
							{!selectedVariant && (
								<div className="pt-2">
									<StockIndicator
										stockQuantity={product.has_stock ? 1 : 0}
										isActive={product.status === "published"}
										isInStock={product.has_stock}
									/>
								</div>
							)}
						</div>

						{/* Variant Selector */}
						{product.variants && product.variants.length > 0 && (
							<VariantSelector
								variants={product.variants}
								onVariantChange={handleVariantChange}
								selectedVariant={selectedVariant}
							/>
						)}

						{/* Quantity Selector */}
						{selectedVariant && (
							<div className="space-y-4">
								<label className="text-sm font-medium tracking-wide uppercase">
									Quantity
								</label>
								<div className="flex items-center space-x-4">
									<div className="flex items-center border border-white/20">
										<button
											type="button"
											onClick={() => setQuantity(Math.max(1, quantity - 1))}
											className="p-3 hover:bg-white/10 transition-colors"
										>
											<Minus className="w-4 h-4" />
										</button>
										<div className="w-16 text-center py-3">{quantity}</div>
										<button
											type="button"
											onClick={() =>
												setQuantity(
													Math.min(
														selectedVariant.stock_quantity,
														quantity + 1,
													),
												)
											}
											className="p-3 hover:bg-white/10 transition-colors"
										>
											<Plus className="w-4 h-4" />
										</button>
									</div>
									<p className="text-sm text-gray-400">
										{selectedVariant.stock_quantity} items in stock
									</p>
								</div>
							</div>
						)}

						{/* Add to Cart Button */}
						<div className="space-y-4">
							<Button
								onClick={handleAddToCart}
								disabled={
									!selectedVariant ||
									!selectedVariant.is_in_stock ||
									selectedVariant.stock_quantity === 0
								}
								className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg font-bold rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{addedToCart
									? "ADDED TO CART!"
									: selectedVariant
										? "ADD TO CART"
										: "SELECT OPTIONS"}
							</Button>
							<div className="grid grid-cols-2 gap-4">
								<Button
									variant="outline"
									className="border-white text-white hover:bg-white hover:text-black py-4 rounded-none"
								>
									ADD TO WISHLIST
								</Button>
								<Button
									variant="outline"
									className="border-white text-white hover:bg-white hover:text-black py-4 rounded-none"
								>
									SHARE
								</Button>
							</div>
						</div>

						{/* Product Details */}
						<div className="space-y-6 pt-6 border-t border-white/10">
							<div className="grid grid-cols-3 gap-6">
								<div className="text-center">
									<Truck className="w-6 h-6 mx-auto mb-2" />
									<p className="text-xs font-medium">FREE SHIPPING</p>
									<p className="text-xs text-gray-400">On orders over $500</p>
								</div>
								<div className="text-center">
									<Shield className="w-6 h-6 mx-auto mb-2" />
									<p className="text-xs font-medium">SECURE PAYMENT</p>
									<p className="text-xs text-gray-400">Encrypted checkout</p>
								</div>
								<div className="text-center">
									<RefreshCw className="w-6 h-6 mx-auto mb-2" />
									<p className="text-xs font-medium">EASY RETURNS</p>
									<p className="text-xs text-gray-400">30 day policy</p>
								</div>
							</div>

							{/* Product Metadata */}
							<div className="space-y-2 text-sm text-gray-400">
								<p>
									<span className="font-medium text-white">Category:</span>{" "}
									{product.category.name}
								</p>
								<p>
									<span className="font-medium text-white">Brand:</span>{" "}
									{product.brand.name}
								</p>
								{selectedVariant && (
									<p>
										<span className="font-medium text-white">SKU:</span>{" "}
										{selectedVariant.sku}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Related Products Section - TODO: Implement with real API in future */}
			{/* For now, removed to avoid mock data */}
		</div>
	);
}
