import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Pagination } from "@/components/common/pagination";
import { PageHeader } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	type Product,
	type ProductFilterParams,
	ProductSkeleton,
	useProducts,
} from "@/features/products";
import { useCart } from "@/hooks/use-cart";
import { useDebounce } from "@/hooks/use-debounce";
import type { MenuItem } from "@/services/api";

// Adapter function to convert Product to MenuItem for cart
function productToCartItem(product: Product): MenuItem {
	return {
		id: product.id,
		name: product.name,
		price: product.min_price ?? product.base_price,
		description: product.description,
		category: product.category?.name ?? "uncategorized",
		photos: product.image_urls,
		dietary: {
			vegan: false,
			vegetarian: false,
			glutenFree: false,
			nutFree: false,
			dairyFree: false,
		},
	};
}

export const Route = createFileRoute("/categories")({
	component: CategoriesPage,
});

// Filter Drawer Component
function FilterDrawer({
	isOpen,
	onClose,
	brands,
	selectedBrand,
	onBrandChange,
	sizeOptions,
	selectedSizes,
	onSizesChange,
	priceRanges,
	selectedPriceRange,
	onPriceRangeChange,
	onClearAll,
}: {
	isOpen: boolean;
	onClose: () => void;
	brands: string[];
	selectedBrand: string | null;
	onBrandChange: (brand: string | null) => void;
	sizeOptions: string[];
	selectedSizes: string[];
	onSizesChange: (sizes: string[]) => void;
	priceRanges: Array<{ id: string; label: string; min: number; max: number }>;
	selectedPriceRange: string | null;
	onPriceRangeChange: (range: string | null) => void;
	onClearAll: () => void;
}) {
	const drawerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && drawerRef.current) {
			drawerRef.current.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	const toggleSize = (size: string) => {
		if (selectedSizes.includes(size)) {
			onSizesChange(selectedSizes.filter((s) => s !== size));
		} else {
			onSizesChange([...selectedSizes, size]);
		}
	};

	return (
		<>
			{/* Overlay - Desktop only */}
			<div
				className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 hidden md:block ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Drawer */}
			<div
				ref={drawerRef}
				role="dialog"
				aria-modal="true"
				aria-label="Filter options"
				tabIndex={-1}
				className={`fixed z-50 bg-black border-l border-white/10 flex flex-col transition-transform duration-300 ease-out
					/* Mobile: full screen from bottom */
					inset-0 md:inset-auto
					/* Desktop: slide from right */
					md:top-0 md:right-0 md:bottom-0 md:w-[400px]
					${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}
				`}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-white/10">
					<h2 className="text-xl font-black tracking-tight">FILTERS</h2>
					<button
						type="button"
						onClick={onClose}
						className="p-2 hover:bg-white/10 transition-colors"
						aria-label="Close filters"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6 space-y-8">
					{/* Brands Section */}
					<div>
						<h3 className="text-sm font-bold tracking-wider text-gray-400 mb-4">
							BRANDS
						</h3>
						<div className="grid grid-cols-2 gap-2">
							{brands.map((brand) => (
								<button
									key={brand}
									type="button"
									onClick={() =>
										onBrandChange(selectedBrand === brand ? null : brand)
									}
									className={`px-4 py-3 text-sm font-medium tracking-wide transition-all border ${
										selectedBrand === brand
											? "bg-white text-black border-white"
											: "border-white/20 hover:border-white/40 hover:bg-white/5"
									}`}
								>
									{brand}
								</button>
							))}
						</div>
					</div>

					{/* Sizes Section */}
					<div>
						<h3 className="text-sm font-bold tracking-wider text-gray-400 mb-4">
							SIZES
						</h3>
						<div className="flex flex-wrap gap-2">
							{sizeOptions.map((size) => (
								<button
									key={size}
									type="button"
									onClick={() => toggleSize(size)}
									className={`w-12 h-12 text-sm font-bold tracking-wide transition-all border ${
										selectedSizes.includes(size)
											? "bg-white text-black border-white"
											: "border-white/20 hover:border-white/40 hover:bg-white/5"
									}`}
								>
									{size}
								</button>
							))}
						</div>
					</div>

					{/* Price Range Section */}
					<div>
						<h3 className="text-sm font-bold tracking-wider text-gray-400 mb-4">
							PRICE RANGE
						</h3>
						<div className="space-y-2">
							{priceRanges.map((range) => (
								<button
									key={range.id}
									type="button"
									onClick={() =>
										onPriceRangeChange(
											selectedPriceRange === range.id ? null : range.id,
										)
									}
									className={`w-full px-4 py-3 text-left text-sm font-medium tracking-wide transition-all border ${
										selectedPriceRange === range.id
											? "bg-white text-black border-white"
											: "border-white/20 hover:border-white/40 hover:bg-white/5"
									}`}
								>
									{range.label}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-white/10 space-y-3">
					<Button
						onClick={onClose}
						className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-12 font-bold tracking-wide"
					>
						APPLY FILTERS
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							onClearAll();
						}}
						className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-medium tracking-wide"
					>
						CLEAR ALL
					</Button>
				</div>
			</div>
		</>
	);
}

export function CategoriesPage() {
	const { addItem } = useCart();
	const newsletterEmailId = useId();

	// Filter state
	const [category, setCategory] = useState<string | null>(null);
	const [searchInput, setSearchInput] = useState("");
	const [brand, setBrand] = useState<string | null>(null);
	const [sizes, setSizes] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<
		"featured" | "price-low" | "price-high" | "name"
	>("featured");
	const [page, setPage] = useState(1);

	// UI state
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [isSortOpen, setIsSortOpen] = useState(false);

	const categoryScrollRef = useRef<HTMLDivElement>(null);

	// Debounce search
	const debouncedSearch = useDebounce(searchInput, 300);

	// Categories (TODO: fetch from API in future)
	const categories = [
		{ id: null, name: "ALL", description: "Complete collection" },
		{ id: "outerwear", name: "OUTERWEAR", description: "Coats and jackets" },
		{
			id: "knitwear",
			name: "KNITWEAR",
			description: "Sweaters and cardigans",
		},
		{ id: "bottoms", name: "BOTTOMS", description: "Trousers and skirts" },
		{ id: "shirts", name: "SHIRTS", description: "Shirts and blouses" },
		{ id: "footwear", name: "FOOTWEAR", description: "Shoes and boots" },
		{
			id: "accessories",
			name: "ACCESSORIES",
			description: "Bags and small goods",
		},
	];

	// Filter options (TODO: fetch from API in future)
	const brands = [
		"MONOLITH",
		"ARCHITECTURAL",
		"SCULPTURAL",
		"GEOMETRIC",
		"MINIMALIST",
		"STRUCTURAL",
	] as const;
	const sizeOptions = ["XS", "S", "M", "L", "XL"] as const;
	const priceRanges = useMemo(
		() => [
			{ id: "under-500", label: "Under $500", min: 0, max: 500 },
			{ id: "500-1000", label: "$500 - $1000", min: 500, max: 1000 },
			{ id: "over-1000", label: "Over $1000", min: 1000, max: Infinity },
		],
		[],
	);

	const sortOptions = useMemo(
		() => [
			{ id: "featured", label: "FEATURED" },
			{ id: "price-low", label: "PRICE: LOW TO HIGH" },
			{ id: "price-high", label: "PRICE: HIGH TO LOW" },
			{ id: "name", label: "NAME: A-Z" },
		],
		[],
	);

	// Build API filters
	const apiFilters: ProductFilterParams = useMemo(() => {
		const filters: ProductFilterParams = {
			page,
			limit: 20,
		};

		if (debouncedSearch) filters.search = debouncedSearch;
		if (category) filters.category_id = category;
		if (brand) filters.brand_id = brand;

		// Map sizes - use first selected size for now (API supports single size filter)
		if (sizes.length > 0) filters.size = sizes[0];

		// Map price range
		if (priceRange) {
			const range = priceRanges.find((r) => r.id === priceRange);
			if (range) {
				filters.min_price = range.min;
				if (range.max !== Infinity) filters.max_price = range.max;
			}
		}

		// Map sort
		if (sortBy === "price-low") {
			filters.sort_by = "price";
			filters.sort_order = "asc";
		} else if (sortBy === "price-high") {
			filters.sort_by = "price";
			filters.sort_order = "desc";
		} else if (sortBy === "name") {
			filters.sort_by = "name";
			filters.sort_order = "asc";
		}
		// 'featured' = default sort from backend

		return filters;
	}, [
		debouncedSearch,
		category,
		brand,
		sizes,
		priceRange,
		sortBy,
		page,
		priceRanges,
	]);

	// Fetch products from API
	const { data, isLoading, isError } = useProducts(apiFilters);

	// Prevent body scroll when drawer is open
	useEffect(() => {
		if (isFilterDrawerOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isFilterDrawerOpen]);

	// Reset page when filters change
	// biome-ignore lint/correctness/useExhaustiveDependencies: Dependencies intentionally included to reset page when filters change
	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, category, brand, sizes, priceRange, sortBy]);

	// Active filters count
	const activeFiltersCount =
		(brand ? 1 : 0) + (sizes.length > 0 ? 1 : 0) + (priceRange ? 1 : 0);

	// Active filters for chips
	const activeFilters = useMemo(() => {
		const filters: Array<{ type: "brand" | "size" | "price"; label: string }> =
			[];

		if (brand) {
			filters.push({ type: "brand", label: brand });
		}

		if (sizes.length > 0) {
			filters.push({
				type: "size",
				label: `${sizes.length} size${sizes.length > 1 ? "s" : ""}`,
			});
		}

		if (priceRange) {
			const range = priceRanges.find((r) => r.id === priceRange);
			if (range) {
				filters.push({ type: "price", label: range.label });
			}
		}

		return filters;
	}, [brand, sizes, priceRange, priceRanges]);

	const clearAllFilters = () => {
		setBrand(null);
		setSizes([]);
		setPriceRange(null);
	};

	const removeFilter = (type: "brand" | "size" | "price") => {
		if (type === "brand") setBrand(null);
		if (type === "size") setSizes([]);
		if (type === "price") setPriceRange(null);
	};

	const currentCategory =
		categories.find((c) => c.id === category) || categories[0];

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<PageHeader
				title="COLLECTIONS"
				searchValue={searchInput}
				onSearchChange={setSearchInput}
				onSearchClear={() => setSearchInput("")}
			/>

			{/* Category Tabs */}
			<div className="sticky top-16 z-30 bg-gray-950 border-b border-white/10">
				<div className="max-w-7xl mx-auto">
					<div
						ref={categoryScrollRef}
						className="flex overflow-x-auto scrollbar-hide px-4 md:px-6 py-3 gap-2"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{categories.map((cat) => (
							<button
								key={cat.id ?? "all"}
								type="button"
								onClick={() => setCategory(cat.id)}
								className={`flex-shrink-0 px-4 py-2 text-sm font-medium tracking-wide transition-all whitespace-nowrap ${
									category === cat.id
										? "text-white border-b-2 border-white"
										: "text-gray-400 hover:text-white border-b-2 border-transparent"
								}`}
							>
								{cat.name}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Toolbar */}
			<div className="border-b border-white/10 bg-black">
				<div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
					<div className="flex items-center justify-end gap-3">
						{/* Sort Dropdown */}
						<div className="relative">
							<button
								type="button"
								onClick={() => setIsSortOpen(!isSortOpen)}
								className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-white/40 transition-colors text-sm font-medium tracking-wide"
							>
								<span className="hidden sm:inline">
									{sortOptions.find((o) => o.id === sortBy)?.label}
								</span>
								<span className="sm:hidden">SORT</span>
								<ChevronDown
									className={`w-4 h-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
								/>
							</button>

							{isSortOpen && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setIsSortOpen(false)}
										aria-hidden="true"
									/>
									<div className="absolute right-0 top-full mt-1 z-50 bg-black border border-white/20 min-w-[200px]">
										{sortOptions.map((option) => (
											<button
												key={option.id}
												type="button"
												onClick={() => {
													setSortBy(option.id as typeof sortBy);
													setIsSortOpen(false);
												}}
												className={`w-full px-4 py-3 text-left text-sm font-medium tracking-wide transition-colors ${
													sortBy === option.id
														? "bg-white text-black"
														: "hover:bg-white/10"
												}`}
											>
												{option.label}
											</button>
										))}
									</div>
								</>
							)}
						</div>

						{/* Filter Button */}
						<button
							type="button"
							onClick={() => setIsFilterDrawerOpen(true)}
							className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-white/40 transition-colors text-sm font-medium tracking-wide"
						>
							<SlidersHorizontal className="w-4 h-4" />
							<span>FILTERS</span>
							{activeFiltersCount > 0 && (
								<span className="flex items-center justify-center w-5 h-5 bg-white text-black text-xs font-bold">
									{activeFiltersCount}
								</span>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Active Filters Chips */}
			{activeFilters.length > 0 && (
				<div className="border-b border-white/10 bg-gray-950/50">
					<div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
						<div
							className="flex items-center gap-3 overflow-x-auto"
							style={{ scrollbarWidth: "none" }}
						>
							<span className="flex-shrink-0 text-sm text-gray-400">
								{data?.data.length || 0} item
								{(data?.data.length || 0) !== 1 ? "s" : ""}
							</span>
							<div className="h-4 w-px bg-white/20 flex-shrink-0" />
							{activeFilters.map((filter) => (
								<button
									key={filter.type}
									type="button"
									onClick={() => removeFilter(filter.type)}
									className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium tracking-wide group"
								>
									<span>{filter.label}</span>
									<X className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
								</button>
							))}
							<button
								type="button"
								onClick={clearAllFilters}
								className="flex-shrink-0 text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-2"
							>
								Clear all
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Products Grid */}
			<main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
				{/* Section Header */}
				<div className="mb-8">
					<h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
						{currentCategory.name}
					</h2>
					<p className="text-gray-400 text-sm md:text-base">
						{currentCategory.description}
					</p>
				</div>

				{/* Loading State */}
				{isLoading && <ProductSkeleton count={12} />}

				{/* Error State */}
				{isError && (
					<div className="text-center py-16 md:py-24">
						<p className="text-lg text-red-400 mb-6">
							Failed to load products. Please try again.
						</p>
						<Button
							variant="outline"
							className="border-white text-white hover:bg-white hover:text-black rounded-none font-medium tracking-wide"
							onClick={() => window.location.reload()}
						>
							RETRY
						</Button>
					</div>
				)}

				{/* Products Grid */}
				{!isLoading && !isError && data && data.data.length > 0 && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
							{data.data.map((product) => (
								<div key={product.id} className="group cursor-pointer">
									<Link
										to="/product/$id"
										params={{ id: product.id }}
										className="block"
									>
										<div className="relative aspect-[3/4] bg-gray-900 overflow-hidden mb-4">
											{/* TODO: Show badge from product status */}
											<div
												className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
												style={{
													backgroundImage: `url(${product.image_urls[0]})`,
													backgroundSize: "cover",
													backgroundPosition: "center",
												}}
												role="img"
												aria-label={product.name}
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
											<div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
												<Button
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														addItem(productToCartItem(product));
													}}
													className="w-full bg-white text-black hover:bg-gray-200 rounded-none font-bold tracking-wide"
												>
													ADD TO CART
												</Button>
											</div>
										</div>
									</Link>
									<div className="space-y-1.5">
										<h3 className="text-base font-bold tracking-tight">
											{product.name}
										</h3>
										<p className="text-sm text-gray-400 line-clamp-1">
											{product.description}
										</p>
										<div className="flex items-center gap-2">
											<p className="text-lg font-bold">${product.min_price}</p>
											{product.min_price !== product.max_price && (
												<p className="text-sm text-gray-500">
													- ${product.max_price}
												</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Pagination */}
						{data.pagination.total_pages > 1 && (
							<Pagination
								currentPage={data.pagination.page}
								totalPages={data.pagination.total_pages}
								onPageChange={setPage}
							/>
						)}
					</>
				)}

				{/* Empty State */}
				{!isLoading && !isError && data && data.data.length === 0 && (
					<div className="text-center py-16 md:py-24">
						<p className="text-lg text-gray-400 mb-6">NO PRODUCTS FOUND</p>
						<Button
							variant="outline"
							className="border-white text-white hover:bg-white hover:text-black rounded-none font-medium tracking-wide"
							onClick={() => {
								setCategory(null);
								setSearchInput("");
								clearAllFilters();
							}}
						>
							CLEAR ALL FILTERS
						</Button>
					</div>
				)}
			</main>

			{/* Newsletter Section */}
			<section className="py-16 md:py-24 px-4 md:px-6 bg-gray-950 border-t border-white/10">
				<div className="max-w-lg mx-auto text-center">
					<h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
						STAY UPDATED
					</h2>
					<p className="text-gray-400 mb-8">
						Be the first to know about new arrivals and exclusive collections
					</p>
					<div className="flex flex-col sm:flex-row gap-3">
						<Input
							id={newsletterEmailId}
							name="email"
							type="email"
							placeholder="EMAIL ADDRESS"
							className="flex-1 bg-transparent border-white/20 text-white placeholder:text-gray-500 rounded-none h-12"
						/>
						<Button className="bg-white text-black hover:bg-gray-200 px-6 rounded-none h-12 font-bold tracking-wide">
							SUBSCRIBE
						</Button>
					</div>
				</div>
			</section>

			{/* Filter Drawer */}
			<FilterDrawer
				isOpen={isFilterDrawerOpen}
				onClose={() => setIsFilterDrawerOpen(false)}
				brands={brands}
				selectedBrand={brand}
				onBrandChange={setBrand}
				sizeOptions={sizeOptions}
				selectedSizes={sizes}
				onSizesChange={setSizes}
				priceRanges={priceRanges}
				selectedPriceRange={priceRange}
				onPriceRangeChange={setPriceRange}
				onClearAll={clearAllFilters}
			/>
		</div>
	);
}
