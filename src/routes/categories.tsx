import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, ShoppingBag, ArrowLeft, Grid, List } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/categories')({ component: CategoriesPage })

function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { id: 'all', name: 'ALL', description: 'Complete collection' },
    { id: 'outerwear', name: 'OUTERWEAR', description: 'Coats and jackets' },
    { id: 'knitwear', name: 'KNITWEAR', description: 'Sweaters and cardigans' },
    { id: 'bottoms', name: 'BOTTOMS', description: 'Trousers and skirts' },
    { id: 'shirts', name: 'SHIRTS', description: 'Shirts and blouses' },
    { id: 'footwear', name: 'FOOTWEAR', description: 'Shoes and boots' },
    { id: 'accessories', name: 'ACCESSORIES', description: 'Bags and small goods' }
  ]

  const products = [
    {
      id: 1,
      name: 'ARCHITECTURAL COAT',
      price: 890,
      originalPrice: 1200,
      image: 'https://images.unsplash.com/photo-1544966503-7e3c4c371b9c?w=800&h=1200&fit=crop',
      category: 'outerwear',
      badge: 'NEW',
      description: 'Structured wool coat with geometric silhouette'
    },
    {
      id: 2,
      name: 'SCULPTURAL KNIT',
      price: 420,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3106?w=800&h=1200&fit=crop',
      category: 'knitwear',
      badge: null,
      description: 'Oversized cashmere blend with asymmetric cut'
    },
    {
      id: 3,
      name: 'GEOMETRIC TROUSER',
      price: 520,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1200&fit=crop',
      category: 'bottoms',
      badge: 'LIMITED',
      description: 'Wide-leg trousers with architectural pleating'
    },
    {
      id: 4,
      name: 'MINIMALIST SHIRT',
      price: 380,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1200&fit=crop',
      category: 'shirts',
      badge: null,
      description: 'Crisp poplin with mandarin collar'
    },
    {
      id: 5,
      name: 'STRUCTURAL BOOT',
      price: 650,
      originalPrice: 850,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1200&fit=crop',
      category: 'footwear',
      badge: 'SALE',
      description: 'Chelsea boot with brutalist sole design'
    },
    {
      id: 6,
      name: 'GEOMETRIC BAG',
      price: 320,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1200&fit=crop',
      category: 'accessories',
      badge: null,
      description: 'Structured leather tote with architectural lines'
    },
    {
      id: 7,
      name: 'MONOLITH COAT',
      price: 1200,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=1200&fit=crop',
      category: 'outerwear',
      badge: 'EXCLUSIVE',
      description: 'Monolithic silhouette with exaggerated proportions'
    },
    {
      id: 8,
      name: 'FORM KNIT SWEATER',
      price: 480,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=1200&fit=crop',
      category: 'knitwear',
      badge: null,
      description: 'Ribbed knit with geometric pattern work'
    }
  ]

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
  }, [selectedCategory, searchQuery, sortBy])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">BACK TO HOME</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-2xl font-black tracking-tighter">COLLECTIONS</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Input
                  type="search"
                  placeholder="SEARCH..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-white/20 text-white placeholder:text-gray-600 rounded-none w-64"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border border-white/20 text-white px-4 py-2 rounded-none"
                >
                  <option value="featured">FEATURED</option>
                  <option value="price-low">PRICE: LOW TO HIGH</option>
                  <option value="price-high">PRICE: HIGH TO LOW</option>
                  <option value="name">NAME: A-Z</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 border border-white/20">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="sticky top-16 z-30 bg-gray-950 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 text-sm font-medium tracking-wide transition-all ${
                  selectedCategory === category.id
                    ? 'bg-white text-black'
                    : 'border border-white/20 hover:bg-white/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Search and Sort */}
      <div className="md:hidden px-6 py-4 space-y-4 border-b border-white/10">
        <Input
          type="search"
          placeholder="SEARCH..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-white/20 text-white placeholder:text-gray-600 rounded-none"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-transparent border border-white/20 text-white px-4 py-2 rounded-none"
        >
          <option value="featured">FEATURED</option>
          <option value="price-low">PRICE: LOW TO HIGH</option>
          <option value="price-high">PRICE: HIGH TO LOW</option>
          <option value="name">NAME: A-Z</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black mb-2">
              {categories.find(c => c.id === selectedCategory)?.name} COLLECTION
            </h2>
            <p className="text-gray-400">
              {filteredProducts.length} ITEMS
              {selectedCategory !== 'all' && ` • ${categories.find(c => c.id === selectedCategory)?.description}`}
            </p>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group cursor-pointer block">
                <div className="relative h-[500px] bg-gray-900 overflow-hidden mb-4">
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-20 bg-white text-black px-3 py-1 text-xs font-black tracking-wider">
                      {product.badge}
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute top-4 right-4 z-20 bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider">
                      SALE
                    </div>
                  )}
                  <div
                    className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${product.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-none mb-2">
                      ADD TO CART
                    </Button>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black rounded-none">
                      QUICK VIEW
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xl font-bold">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group block">
                <div className="flex flex-col md:flex-row gap-6 p-6 border border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="relative h-64 md:h-40 md:w-64 bg-gray-900 overflow-hidden flex-shrink-0">
                    {product.badge && (
                      <div className="absolute top-2 left-2 z-20 bg-white text-black px-2 py-1 text-xs font-black tracking-wider">
                        {product.badge}
                      </div>
                    )}
                    <div
                      className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-all duration-700"
                      style={{
                        backgroundImage: `url(${product.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  </div>
                  <div className="flex-grow space-y-3">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                      <p className="text-gray-400">{product.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold">${product.price}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button className="bg-white text-black hover:bg-gray-200 rounded-none">
                          ADD TO CART
                        </Button>
                        <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none">
                          QUICK VIEW
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-xl text-gray-400 mb-4">NO PRODUCTS FOUND</p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none" onClick={() => {
              setSelectedCategory('all')
              setSearchQuery('')
            }}>
              CLEAR FILTERS
            </Button>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">STAY UPDATED</h2>
          <p className="text-lg text-gray-400 mb-8">
            Be the first to know about new arrivals and exclusive collections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="bg-transparent border-white text-white placeholder:text-gray-600 rounded-none h-14"
            />
            <Button className="bg-white text-black hover:bg-gray-200 px-8 rounded-none h-14">
              SUBSCRIBE
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}