import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Search, X, ShoppingBag, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/hooks/use-cart'

export const Route = createFileRoute('/categories')({ component: CategoriesPage })

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
	isOpen: boolean
	onClose: () => void
	brands: string[]
	selectedBrand: string | null
	onBrandChange: (brand: string | null) => void
	sizeOptions: string[]
	selectedSizes: string[]
	onSizesChange: (sizes: string[]) => void
	priceRanges: Array<{ id: string; label: string; min: number; max: number }>
	selectedPriceRange: string | null
	onPriceRangeChange: (range: string | null) => void
	onClearAll: () => void
}) {
	const drawerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (isOpen && drawerRef.current) {
			drawerRef.current.focus()
		}
	}, [isOpen])

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose()
			}
		}
		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isOpen, onClose])

	const toggleSize = (size: string) => {
		if (selectedSizes.includes(size)) {
			onSizesChange(selectedSizes.filter((s) => s !== size))
		} else {
			onSizesChange([...selectedSizes, size])
		}
	}

	return (
		<>
			{/* Overlay - Desktop only */}
			<div
				className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 hidden md:block ${
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
					${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}
				`}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-white/10">
					<h2 className="text-xl font-black tracking-tight">FILTERS</h2>
					<button
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
						<h3 className="text-sm font-bold tracking-wider text-gray-400 mb-4">BRANDS</h3>
						<div className="grid grid-cols-2 gap-2">
							{brands.map((brand) => (
								<button
									key={brand}
									onClick={() => onBrandChange(selectedBrand === brand ? null : brand)}
									className={`px-4 py-3 text-sm font-medium tracking-wide transition-all border ${
										selectedBrand === brand
											? 'bg-white text-black border-white'
											: 'border-white/20 hover:border-white/40 hover:bg-white/5'
									}`}
								>
									{brand}
								</button>
							))}
						</div>
					</div>

					{/* Sizes Section */}
					<div>
						<h3 className="text-sm font-bold tracking-wider text-gray-400 mb-4">SIZES</h3>
						<div className="flex flex-wrap gap-2">
							{sizeOptions.map((size) => (
								<button
									key={size}
									onClick={() => toggleSize(size)}
									className={`w-12 h-12 text-sm font-bold tracking-wide transition-all border ${
										selectedSizes.includes(size)
											? 'bg-white text-black border-white'
											: 'border-white/20 hover:border-white/40 hover:bg-white/5'
									}`}
								>
									{size}
								</button>
							))}
						</div>
					</div>

					{/* Price Range Section */}
					<div>
						<h3 className="text-sm font-bold tracking-wider text-gray-400 mb-4">PRICE RANGE</h3>
						<div className="space-y-2">
							{priceRanges.map((range) => (
								<button
									key={range.id}
									onClick={() =>
										onPriceRangeChange(selectedPriceRange === range.id ? null : range.id)
									}
									className={`w-full px-4 py-3 text-left text-sm font-medium tracking-wide transition-all border ${
										selectedPriceRange === range.id
											? 'bg-white text-black border-white'
											: 'border-white/20 hover:border-white/40 hover:bg-white/5'
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
							onClearAll()
						}}
						className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-medium tracking-wide"
					>
						CLEAR ALL
					</Button>
				</div>
			</div>
		</>
	)
}

function CategoriesPage() {
	const { itemCount, addItem } = useCart()
	// State
	const [category, setCategory] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const [brand, setBrand] = useState<string | null>(null)
	const [sizes, setSizes] = useState<string[]>([])
	const [priceRange, setPriceRange] = useState<string | null>(null)
	const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured')
	const [isSearchActive, setIsSearchActive] = useState(false)
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
	const [isSortOpen, setIsSortOpen] = useState(false)

	const searchInputRef = useRef<HTMLInputElement>(null)
	const categoryScrollRef = useRef<HTMLDivElement>(null)

	// Focus search input when activated
	useEffect(() => {
		if (isSearchActive && searchInputRef.current) {
			searchInputRef.current.focus()
		}
	}, [isSearchActive])

	// Prevent body scroll when drawer is open
	useEffect(() => {
		if (isFilterDrawerOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isFilterDrawerOpen])

	// Categories
	const categories = [
		{ id: null, name: 'ALL', description: 'Complete collection' },
		{ id: 'outerwear', name: 'OUTERWEAR', description: 'Coats and jackets' },
		{ id: 'knitwear', name: 'KNITWEAR', description: 'Sweaters and cardigans' },
		{ id: 'bottoms', name: 'BOTTOMS', description: 'Trousers and skirts' },
		{ id: 'shirts', name: 'SHIRTS', description: 'Shirts and blouses' },
		{ id: 'footwear', name: 'FOOTWEAR', description: 'Shoes and boots' },
		{ id: 'accessories', name: 'ACCESSORIES', description: 'Bags and small goods' },
	]

	// Filter options
	const brands = ['MONOLITH', 'ARCHITECTURAL', 'SCULPTURAL', 'GEOMETRIC', 'MINIMALIST', 'STRUCTURAL']
	const sizeOptions = ['XS', 'S', 'M', 'L', 'XL']
	const priceRanges = [
		{ id: 'under-500', label: 'Under $500', min: 0, max: 500 },
		{ id: '500-1000', label: '$500 - $1000', min: 500, max: 1000 },
		{ id: 'over-1000', label: 'Over $1000', min: 1000, max: Infinity },
	]

	const sortOptions = [
		{ id: 'featured', label: 'FEATURED' },
		{ id: 'price-low', label: 'PRICE: LOW TO HIGH' },
		{ id: 'price-high', label: 'PRICE: HIGH TO LOW' },
		{ id: 'name', label: 'NAME: A-Z' },
	]

	// Products data
	const products = [
		{
			id: 1,
			name: 'ARCHITECTURAL COAT',
			price: 890,
			originalPrice: 1200,
			image: 'https://images.unsplash.com/photo-1544966503-7e3c4c371b9c?w=800&h=1200&fit=crop',
			category: 'outerwear',
			brand: 'ARCHITECTURAL',
			sizes: ['S', 'M', 'L'],
			badge: 'NEW',
			description: 'Structured wool coat with geometric silhouette',
		},
		{
			id: 2,
			name: 'SCULPTURAL KNIT',
			price: 420,
			originalPrice: null,
			image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3106?w=800&h=1200&fit=crop',
			category: 'knitwear',
			brand: 'SCULPTURAL',
			sizes: ['XS', 'S', 'M'],
			badge: null,
			description: 'Oversized cashmere blend with asymmetric cut',
		},
		{
			id: 3,
			name: 'GEOMETRIC TROUSER',
			price: 520,
			originalPrice: null,
			image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1200&fit=crop',
			category: 'bottoms',
			brand: 'GEOMETRIC',
			sizes: ['M', 'L', 'XL'],
			badge: 'LIMITED',
			description: 'Wide-leg trousers with architectural pleating',
		},
		{
			id: 4,
			name: 'MINIMALIST SHIRT',
			price: 380,
			originalPrice: null,
			image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1200&fit=crop',
			category: 'shirts',
			brand: 'MINIMALIST',
			sizes: ['XS', 'S', 'M', 'L'],
			badge: null,
			description: 'Crisp poplin with mandarin collar',
		},
		{
			id: 5,
			name: 'STRUCTURAL BOOT',
			price: 650,
			originalPrice: 850,
			image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1200&fit=crop',
			category: 'footwear',
			brand: 'STRUCTURAL',
			sizes: ['S', 'M', 'L'],
			badge: 'SALE',
			description: 'Chelsea boot with brutalist sole design',
		},
		{
			id: 6,
			name: 'GEOMETRIC BAG',
			price: 320,
			originalPrice: null,
			image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1200&fit=crop',
			category: 'accessories',
			brand: 'GEOMETRIC',
			sizes: ['M'],
			badge: null,
			description: 'Structured leather tote with architectural lines',
		},
		{
			id: 7,
			name: 'MONOLITH COAT',
			price: 1200,
			originalPrice: null,
			image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=1200&fit=crop',
			category: 'outerwear',
			brand: 'MONOLITH',
			sizes: ['S', 'M', 'L', 'XL'],
			badge: 'EXCLUSIVE',
			description: 'Monolithic silhouette with exaggerated proportions',
		},
		{
			id: 8,
			name: 'FORM KNIT SWEATER',
			price: 480,
			originalPrice: null,
			image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=1200&fit=crop',
			category: 'knitwear',
			brand: 'SCULPTURAL',
			sizes: ['S', 'M', 'L'],
			badge: null,
			description: 'Ribbed knit with geometric pattern work',
		},
	]

	// Filter and sort products
	const filteredProducts = useMemo(() => {
		let filtered = [...products]

		// Filter by category
		if (category) {
			filtered = filtered.filter((product) => product.category === category)
		}

		// Filter by search query
		if (search) {
			filtered = filtered.filter(
				(product) =>
					product.name.toLowerCase().includes(search.toLowerCase()) ||
					product.description.toLowerCase().includes(search.toLowerCase())
			)
		}

		// Filter by brand
		if (brand) {
			filtered = filtered.filter((product) => product.brand === brand)
		}

		// Filter by sizes
		if (sizes.length > 0) {
			filtered = filtered.filter((product) => sizes.some((size) => product.sizes.includes(size)))
		}

		// Filter by price range
		if (priceRange) {
			const range = priceRanges.find((r) => r.id === priceRange)
			if (range) {
				filtered = filtered.filter(
					(product) => product.price >= range.min && product.price < range.max
				)
			}
		}

		// Sort products
		switch (sortBy) {
			case 'price-low':
				filtered.sort((a, b) => a.price - b.price)
				break
			case 'price-high':
				filtered.sort((a, b) => b.price - a.price)
				break
			case 'name':
				filtered.sort((a, b) => a.name.localeCompare(b.name))
				break
			case 'featured':
			default:
				// Keep original order (featured first)
				break
		}

		return filtered
	}, [category, search, brand, sizes, priceRange, sortBy])

	// Active filters count
	const activeFiltersCount = (brand ? 1 : 0) + (sizes.length > 0 ? 1 : 0) + (priceRange ? 1 : 0)

	// Active filters for chips
	const activeFilters = useMemo(() => {
		const filters: Array<{ type: 'brand' | 'size' | 'price'; label: string }> = []

		if (brand) {
			filters.push({ type: 'brand', label: brand })
		}

		if (sizes.length > 0) {
			filters.push({ type: 'size', label: `${sizes.length} size${sizes.length > 1 ? 's' : ''}` })
		}

		if (priceRange) {
			const range = priceRanges.find((r) => r.id === priceRange)
			if (range) {
				filters.push({ type: 'price', label: range.label })
			}
		}

		return filters
	}, [brand, sizes, priceRange])

	const clearAllFilters = () => {
		setBrand(null)
		setSizes([])
		setPriceRange(null)
	}

	const removeFilter = (type: 'brand' | 'size' | 'price') => {
		if (type === 'brand') setBrand(null)
		if (type === 'size') setSizes([])
		if (type === 'price') setPriceRange(null)
	}

	const currentCategory = categories.find((c) => c.id === category) || categories[0]

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
				<div className="max-w-7xl mx-auto px-4 md:px-6">
					<div className="flex items-center justify-between h-16">
						{/* Mobile: Search Active State */}
						{isSearchActive ? (
							<div className="flex items-center gap-3 w-full md:hidden">
								<button
									onClick={() => {
										setIsSearchActive(false)
										setSearch('')
									}}
									className="p-2 -ml-2 hover:bg-white/10 transition-colors"
									aria-label="Close search"
								>
									<ArrowLeft className="w-5 h-5" />
								</button>
								<Input
									ref={searchInputRef}
									type="search"
									placeholder="SEARCH..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="flex-1 bg-transparent border-white/20 text-white placeholder:text-gray-500 rounded-none h-10"
								/>
								<button
									onClick={() => setSearch('')}
									className="p-2 hover:bg-white/10 transition-colors"
									aria-label="Clear search"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
						) : (
							<>
								{/* Left side */}
								<div className="flex items-center gap-4 md:gap-6">
									<Link
										to="/"
										className="flex items-center gap-2 hover:text-gray-300 transition-colors"
									>
										<ArrowLeft className="w-5 h-5" />
										<span className="hidden md:inline text-sm font-medium tracking-wide">
											BACK
										</span>
									</Link>
									<div className="hidden md:block h-5 w-px bg-white/20" />
									<h1 className="text-lg md:text-xl font-black tracking-tighter">COLLECTIONS</h1>
								</div>

								{/* Right side */}
								<div className="flex items-center gap-2 md:gap-4">
									{/* Desktop Search */}
									<div className="hidden md:block">
										<Input
											type="search"
											placeholder="SEARCH..."
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											className="w-64 bg-transparent border-white/20 text-white placeholder:text-gray-500 rounded-none h-10"
										/>
									</div>

									{/* Mobile Search Toggle */}
									<button
										onClick={() => setIsSearchActive(true)}
										className="md:hidden p-2 hover:bg-white/10 transition-colors"
										aria-label="Open search"
									>
										<Search className="w-5 h-5" />
									</button>

									{/* Cart */}
									<Link
										to="/cart"
										className="relative p-2 hover:bg-white/10 transition-colors"
										aria-label="Shopping cart"
									>
										<ShoppingBag className="w-5 h-5" />
										{itemCount > 0 && (
											<span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-white text-black text-xs font-black rounded-sm">
												{itemCount}
											</span>
										)}
									</Link>
								</div>
							</>
						)}
					</div>
				</div>
			</header>

			{/* Category Tabs */}
			<div className="sticky top-16 z-30 bg-gray-950 border-b border-white/10">
				<div className="max-w-7xl mx-auto">
					<div
						ref={categoryScrollRef}
						className="flex overflow-x-auto scrollbar-hide px-4 md:px-6 py-3 gap-2"
						style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
					>
						{categories.map((cat) => (
							<button
								key={cat.id ?? 'all'}
								onClick={() => setCategory(cat.id)}
								className={`flex-shrink-0 px-4 py-2 text-sm font-medium tracking-wide transition-all whitespace-nowrap ${
									category === cat.id
										? 'text-white border-b-2 border-white'
										: 'text-gray-400 hover:text-white border-b-2 border-transparent'
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
								onClick={() => setIsSortOpen(!isSortOpen)}
								className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-white/40 transition-colors text-sm font-medium tracking-wide"
							>
								<span className="hidden sm:inline">
									{sortOptions.find((o) => o.id === sortBy)?.label}
								</span>
								<span className="sm:hidden">SORT</span>
								<ChevronDown
									className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
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
												onClick={() => {
													setSortBy(option.id as typeof sortBy)
													setIsSortOpen(false)
												}}
												className={`w-full px-4 py-3 text-left text-sm font-medium tracking-wide transition-colors ${
													sortBy === option.id
														? 'bg-white text-black'
														: 'hover:bg-white/10'
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
						<div className="flex items-center gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
							<span className="flex-shrink-0 text-sm text-gray-400">
								{filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
							</span>
							<div className="h-4 w-px bg-white/20 flex-shrink-0" />
							{activeFilters.map((filter) => (
								<button
									key={filter.type}
									onClick={() => removeFilter(filter.type)}
									className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium tracking-wide group"
								>
									<span>{filter.label}</span>
									<X className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
								</button>
							))}
							<button
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
					<p className="text-gray-400 text-sm md:text-base">{currentCategory.description}</p>
				</div>

				{/* Grid */}
				{filteredProducts.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
						{filteredProducts.map((product) => (
							<div key={product.id} className="group cursor-pointer">
								<Link
									to="/product/$id"
									params={{ id: String(product.id) }}
									className="block"
								>
									<div className="relative aspect-[3/4] bg-gray-900 overflow-hidden mb-4">
										{product.badge && (
											<div className="absolute top-3 left-3 z-20 bg-white text-black px-2.5 py-1 text-xs font-black tracking-wider">
												{product.badge}
											</div>
										)}
										{product.originalPrice && (
											<div className="absolute top-3 right-3 z-20 bg-red-600 text-white px-2.5 py-1 text-xs font-black tracking-wider">
												SALE
											</div>
										)}
										<div
											className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
											style={{
												backgroundImage: `url(${product.image})`,
												backgroundSize: 'cover',
												backgroundPosition: 'center',
											}}
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										<div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
											<Button
												onClick={(e) => {
													e.preventDefault()
													e.stopPropagation()
													addItem(product as any)
												}}
												className="w-full bg-white text-black hover:bg-gray-200 rounded-none font-bold tracking-wide"
											>
												ADD TO CART
											</Button>
										</div>
									</div>
								</Link>
								<div className="space-y-1.5">
									<h3 className="text-base font-bold tracking-tight">{product.name}</h3>
									<p className="text-sm text-gray-400 line-clamp-1">{product.description}</p>
									<div className="flex items-center gap-2">
										<p className="text-lg font-bold">${product.price}</p>
										{product.originalPrice && (
											<p className="text-sm text-gray-500 line-through">
												${product.originalPrice}
											</p>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-16 md:py-24">
						<p className="text-lg text-gray-400 mb-6">NO PRODUCTS FOUND</p>
						<Button
							variant="outline"
							className="border-white text-white hover:bg-white hover:text-black rounded-none font-medium tracking-wide"
							onClick={() => {
								setCategory(null)
								setSearch('')
								clearAllFilters()
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
					<h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">STAY UPDATED</h2>
					<p className="text-gray-400 mb-8">
						Be the first to know about new arrivals and exclusive collections
					</p>
					<div className="flex flex-col sm:flex-row gap-3">
						<Input
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
	)
}
