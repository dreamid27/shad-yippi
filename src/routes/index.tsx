import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/hooks/use-cart'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
	const { itemCount } = useCart()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const [isCollectionsVisible, setIsCollectionsVisible] = useState(false)
  const [isProductsVisible, setIsProductsVisible] = useState(false)
  const [isBrandStoryVisible, setIsBrandStoryVisible] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const collectionsRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const brandStoryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsHeroVisible(true)
        }
      })
    }, { threshold: 0.2 })

    const collectionsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsCollectionsVisible(true)
        }
      })
    }, observerOptions)

    const productsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsProductsVisible(true)
        }
      })
    }, observerOptions)

    const brandStoryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsBrandStoryVisible(true)
        }
      })
    }, observerOptions)

    if (heroRef.current) heroObserver.observe(heroRef.current)
    if (collectionsRef.current) collectionsObserver.observe(collectionsRef.current)
    if (productsRef.current) productsObserver.observe(productsRef.current)
    if (brandStoryRef.current) brandStoryObserver.observe(brandStoryRef.current)

    return () => {
      heroObserver.disconnect()
      collectionsObserver.disconnect()
      productsObserver.disconnect()
      brandStoryObserver.disconnect()
    }
  }, [])

  const products = [
    {
      id: 1,
      name: 'ARCHITECTURAL COAT',
      price: 890,
      image: 'https://images.unsplash.com/photo-1544966503-7e3c4c371b9c?w=800&h=1200&fit=crop',
      category: 'Outerwear'
    },
    {
      id: 2,
      name: 'SCULPTURAL KNIT',
      price: 420,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3106?w=800&h=1200&fit=crop',
      category: 'Knitwear'
    },
    {
      id: 3,
      name: 'GEOMETRIC TROUSER',
      price: 520,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1200&fit=crop',
      category: 'Bottoms'
    },
    {
      id: 4,
      name: 'MINIMALIST SHIRT',
      price: 380,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1200&fit=crop',
      category: 'Shirts'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-black/90 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-black tracking-tighter">ÆTHER</Link>

            <div className="hidden md:flex items-center space-x-12">
              <Link to="/categories" className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors">COLLECTIONS</Link>
              <Link to="/categories" className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors">NEW ARRIVALS</Link>
              <Link to="/categories" className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors">CLOTHING</Link>
              <Link to="/categories" className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors">FOOTWEAR</Link>
              <Link to="/categories" className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors">ACCESSORIES</Link>
              <Link to="/editorial" className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors">EDITORIAL</Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-white text-black text-xs font-black rounded-sm">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-t border-white/10">
            <div className="px-6 py-6 space-y-4">
              <Link to="/categories" className="block text-lg font-medium">COLLECTIONS</Link>
              <Link to="/categories" className="block text-lg font-medium">NEW ARRIVALS</Link>
              <Link to="/categories" className="block text-lg font-medium">CLOTHING</Link>
              <Link to="/categories" className="block text-lg font-medium">FOOTWEAR</Link>
              <Link to="/categories" className="block text-lg font-medium">ACCESSORIES</Link>
              <Link to="/editorial" className="block text-lg font-medium">EDITORIAL</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        <div
          className="absolute inset-0 opacity-40 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className={`text-6xl md:text-8xl font-black mb-6 tracking-tighter transition-all duration-1000 ease-out ${
            isHeroVisible
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-8'
          }`}>
            <span className="inline-block transition-all duration-700 delay-300">
              STRUCTURAL
            </span>
            <br />
            <span className={`block text-8xl md:text-9xl transition-all duration-700 delay-500 ${
              isHeroVisible
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-8'
            }`}>
              ELEGANCE
            </span>
          </h1>
          <p className={`text-xl md:text-2xl mb-8 text-gray-300 font-light tracking-wide transition-all duration-700 delay-700 ${
            isHeroVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 transform translate-y-8'
          }`}>
            Redefining minimalism through architectural precision
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-900 ${
            isHeroVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 transform translate-y-8'
          }`}>
            <Link to="/categories">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-12 py-6 rounded-none transform hover:scale-105 transition-all duration-300">
                EXPLORE COLLECTION
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black text-lg px-12 py-6 rounded-none transform hover:scale-105 transition-all duration-300">
              VIEW EDITORIAL
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-1 h-16 bg-gradient-to-b from-white/60 to-white/20 mx-auto" />
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section ref={collectionsRef} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isCollectionsVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}>
            <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">NEW COLLECTION</h2>
            <p className="text-xl text-gray-400">Essential pieces reimagined through brutalist design</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className={`group relative h-[600px] bg-gray-900 overflow-hidden cursor-pointer transition-all duration-1000 ease-out ${
              isCollectionsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`} style={{ transitionDelay: '200ms' }}>
              <div
                className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-700"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1200&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative h-full flex items-end p-8">
                <div className="bg-black/80 backdrop-blur-sm p-8">
                  <h3 className="text-3xl font-black mb-2">STRUCTURAL FORMS</h3>
                  <p className="text-gray-300 mb-4">Architectural silhouettes meets contemporary design</p>
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className={`group relative h-[600px] bg-gray-900 overflow-hidden cursor-pointer transition-all duration-1000 ease-out ${
              isCollectionsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`} style={{ transitionDelay: '400ms' }}>
              <div
                className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-700"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=1200&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative h-full flex items-end p-8">
                <div className="bg-black/80 backdrop-blur-sm p-8">
                  <h3 className="text-3xl font-black mb-2">MINIMAL ESSENTIALS</h3>
                  <p className="text-gray-300 mb-4">Pure forms reduced to their essential elements</p>
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="group relative h-[600px] bg-gray-900 overflow-hidden cursor-pointer">
              <div
                className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-700"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=1200&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative h-full flex items-end p-8">
                <div className="bg-black/80 backdrop-blur-sm p-8">
                  <h3 className="text-3xl font-black mb-2">MINIMAL ESSENTIALS</h3>
                  <p className="text-gray-300 mb-4">Pure forms reduced to their essential elements</p>
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section ref={productsRef} className="py-24 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className={`flex items-center justify-between mb-16 transition-all duration-1000 ease-out ${
            isProductsVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}>
            <div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter">FEATURED</h2>
              <p className="text-xl text-gray-400">Curated selections from our latest collection</p>
            </div>
            <Link to="/categories">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-none">
                VIEW ALL
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group cursor-pointer block">
                <div className={`relative h-[500px] bg-gray-900 overflow-hidden mb-4 transition-all duration-1000 ease-out ${
                  isProductsVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`} style={{ transitionDelay: `${index * 100}ms` }}>
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
                    <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-none">
                      ADD TO CART
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 tracking-widest">{product.category}</p>
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-xl">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section ref={brandStoryRef} className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className={`text-5xl md:text-7xl font-black mb-12 tracking-tighter transition-all duration-1000 ease-out ${
            isBrandStoryVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}>
            OUR PHILOSOPHY
          </h2>
          <div className="space-y-8 text-xl leading-relaxed text-gray-300">
            <p className={`transition-all duration-700 delay-300 ${
              isBrandStoryVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}>
              ÆTHER emerged from the intersection of architectural minimalism and contemporary fashion.
              We believe clothing should be structural yet fluid, bold yet restrained.
            </p>
            <p className={`transition-all duration-700 delay-500 ${
              isBrandStoryVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}>
              Each piece is a meditation on form, designed with brutalist precision and refined through
              meticulous attention to material and construction. Our silhouettes are defined by clean lines,
              unexpected proportions, and the interplay between shadow and light.
            </p>
            <p className={`transition-all duration-700 delay-700 ${
              isBrandStoryVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}>
              This is not merely clothing. This is wearable architecture.
            </p>
          </div>
          <div className="mt-16 flex flex-col sm:flex-row gap-8 justify-center">
            <div className="text-center">
              <div className="text-4xl font-black mb-2">2017</div>
              <p className="text-gray-400">FOUNDED</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">27</div>
              <p className="text-gray-400">COUNTRIES</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">100%</div>
              <p className="text-gray-400">ETHICAL PRODUCTION</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">JOIN THE UNIVERSE</h2>
          <p className="text-xl text-gray-400 mb-12">
            Receive exclusive access to new collections and editorial content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="bg-transparent border-white text-white placeholder:text-gray-600 rounded-none h-16 text-lg"
            />
            <Button className="bg-white text-black hover:bg-gray-200 px-8 rounded-none h-16">
              SUBSCRIBE
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-6">
            By subscribing, you agree to our privacy policy and terms of service.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-black mb-4">ÆTHER</h3>
              <p className="text-gray-400">Structural elegance redefined.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">SHOP</h4>
              <div className="space-y-2 text-gray-400">
                <p className="hover:text-white cursor-pointer transition-colors">New Arrivals</p>
                <p className="hover:text-white cursor-pointer transition-colors">Clothing</p>
                <p className="hover:text-white cursor-pointer transition-colors">Footwear</p>
                <p className="hover:text-white cursor-pointer transition-colors">Accessories</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">EXPLORE</h4>
              <div className="space-y-2 text-gray-400">
                <p className="hover:text-white cursor-pointer transition-colors">Editorial</p>
                <p className="hover:text-white cursor-pointer transition-colors">About</p>
                <p className="hover:text-white cursor-pointer transition-colors">Sustainability</p>
                <p className="hover:text-white cursor-pointer transition-colors">Stockists</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">SUPPORT</h4>
              <div className="space-y-2 text-gray-400">
                <p className="hover:text-white cursor-pointer transition-colors">Contact</p>
                <p className="hover:text-white cursor-pointer transition-colors">Shipping</p>
                <p className="hover:text-white cursor-pointer transition-colors">Returns</p>
                <p className="hover:text-white cursor-pointer transition-colors">Size Guide</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 ÆTHER. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <p className="hover:text-white cursor-pointer transition-colors">Privacy Policy</p>
              <p className="hover:text-white cursor-pointer transition-colors">Terms of Service</p>
              <p className="hover:text-white cursor-pointer transition-colors">Cookie Policy</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
