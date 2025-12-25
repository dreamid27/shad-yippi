import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, ShoppingBag, ArrowLeft, Plus, Minus, Truck, Shield, RefreshCw, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/product/$id')({ component: ProductDetailPage })

function ProductDetailPage() {
  const { id } = Route.useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  // Mock product data - in a real app, this would come from an API
  const product = {
    id: id,
    name: 'ARCHITECTURAL COAT',
    designer: 'ÆTHER',
    price: 890,
    originalPrice: 1200,
    description: 'A statement piece that embodies brutalist architecture in garment form. This structured coat features exaggerated proportions, clean lines, and precision tailoring that creates a powerful silhouette.',
    details: [
      '100% Italian wool blend',
      'Oversized structured silhouette',
      'Notched lapels with geometric cut',
      'Kissed closure with hidden buttons',
      'Interior silk lining with monogram',
      'Dry clean only',
      'Made in Italy'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableSizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1544966503-7e3c4c371b9c?w=1200&h=1800&fit=crop',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200&h=1800&fit=crop',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=1800&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=1800&fit=crop'
    ],
    category: 'Outerwear',
    badge: 'NEW',
    rating: 4.8,
    reviews: 124
  }

  const relatedProducts = [
    {
      id: 2,
      name: 'SCULPTURAL KNIT',
      price: 420,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3106?w=600&h=900&fit=crop',
      category: 'Knitwear'
    },
    {
      id: 3,
      name: 'GEOMETRIC TROUSER',
      price: 520,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=900&fit=crop',
      category: 'Bottoms'
    },
    {
      id: 5,
      name: 'STRUCTURAL BOOT',
      price: 650,
      originalPrice: 850,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=900&fit=crop',
      category: 'Footwear',
      badge: 'SALE'
    },
    {
      id: 6,
      name: 'GEOMETRIC BAG',
      price: 320,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=900&fit=crop',
      category: 'Accessories'
    }
  ]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const addToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    // Handle add to cart logic
    console.log('Added to cart:', { product, size: selectedSize, quantity })
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/categories" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">BACK TO COLLECTIONS</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-xl font-black tracking-tighter uppercase">{product.name}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </button>
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
              {product.badge && (
                <div className="absolute top-4 left-4 z-20 bg-white text-black px-3 py-1 text-xs font-black tracking-wider">
                  {product.badge}
                </div>
              )}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
                style={{
                  backgroundImage: `url(${product.images[selectedImage]})`,
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-24 bg-gray-900 overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-white' : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tighter">{product.name}</h2>
                  <p className="text-lg text-gray-400">{product.designer}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-white' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">{product.rating} ({product.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  {product.originalPrice && (
                    <p className="text-lg text-gray-500 line-through">${product.originalPrice}</p>
                  )}
                  <p className="text-3xl font-bold">${product.price}</p>
                </div>
              </div>

              <p className="text-lg leading-relaxed text-gray-300">{product.description}</p>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium tracking-wide">SELECT SIZE</label>
                <Link to="/size-guide" className="text-sm text-gray-400 hover:text-white transition-colors">
                  SIZE GUIDE
                </Link>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => {
                  const isAvailable = product.availableSizes.includes(size)
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`py-4 border transition-all ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : isAvailable
                          ? 'border-white/20 hover:border-white/60'
                          : 'border-gray-800 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <label className="text-sm font-medium tracking-wide">QUANTITY</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-white/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-16 text-center py-3">{quantity}</div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-400">12 items in stock</p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <Button
                onClick={addToCart}
                className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg font-bold rounded-none"
              >
                ADD TO CART
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
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4">PRODUCT DETAILS</h3>
                <ul className="space-y-2 text-gray-300">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1 h-1 bg-white rounded-full mt-2 mr-3 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-6 py-6 border-t border-white/10">
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
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">COMPLETE THE LOOK</h2>
            <p className="text-xl text-gray-400">Pieces that complement this architectural design</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="group cursor-pointer">
                <div className="relative h-[500px] bg-gray-900 overflow-hidden mb-4">
                  {relatedProduct.badge && (
                    <div className="absolute top-4 left-4 z-20 bg-white text-black px-3 py-1 text-xs font-black tracking-wider">
                      {relatedProduct.badge}
                    </div>
                  )}
                  <div
                    className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${relatedProduct.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 tracking-widest">{relatedProduct.category}</p>
                  <h3 className="text-lg font-bold">{relatedProduct.name}</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-xl">${relatedProduct.price}</p>
                    {relatedProduct.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">${relatedProduct.originalPrice}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}