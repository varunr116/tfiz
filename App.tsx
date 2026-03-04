import React, { useState, useMemo, useEffect, useRef } from "react"
import {
  ShoppingBag,
  X,
  Star,
  ArrowLeft,
  ArrowUp,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  RefreshCw,
  Lock,
  Settings,
  LogOut,
  AlertCircle,
  QrCode,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Truck,
  ShieldCheck,
  Smartphone,
  MapPin,
  Mail,
  User,
  Zap,
  Info,
  Database,
  Eye,
  EyeOff,
  PlusSquare,
  Package,
  Gift,
  Trophy,
  Dice5,
} from "lucide-react"
import logoImg from "./logo.jpeg"
import {
  Product,
  CartItem,
  ARState,
  Category,
  BillingDetails,
  AREffect,
} from "./types.ts"
import { PRODUCTS, CATEGORIES } from "./constants.ts"

const CURRENCY = "₹"
const formatPrice = (price: number) =>
  `${CURRENCY}${price.toLocaleString("en-IN")}`

const BrandLogoIcon = ({
  className = "w-full h-full",
}: {
  className?: string
}) => (
  <img
    src={logoImg}
    alt="TFiZ logo"
    className={`object-cover scale-150 ${className}`}
  />
)

const DiceFace: React.FC<{ value: number }> = ({ value }) => {
  const pipBase = "w-2 h-2 rounded-full bg-black"
  const renderPips = () => {
    switch (value) {
      case 1:
        return (
          <div className="flex items-center justify-center h-full">
            <div className={pipBase} />
          </div>
        )
      case 2:
        return (
          <div className="flex flex-col justify-between h-full">
            <div className="flex justify-start">
              <div className={pipBase} />
            </div>
            <div className="flex justify-end">
              <div className={pipBase} />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="flex flex-col justify-between h-full">
            <div className="flex justify-start">
              <div className={pipBase} />
            </div>
            <div className="flex justify-center">
              <div className={pipBase} />
            </div>
            <div className="flex justify-end">
              <div className={pipBase} />
            </div>
          </div>
        )
      case 4:
        return (
          <div className="flex flex-col justify-between h-full">
            <div className="flex justify-between">
              <div className={pipBase} />
              <div className={pipBase} />
            </div>
            <div className="flex justify-between">
              <div className={pipBase} />
              <div className={pipBase} />
            </div>
          </div>
        )
      case 5:
        return (
          <div className="flex flex-col justify-between h-full">
            <div className="flex justify-between">
              <div className={pipBase} />
              <div className={pipBase} />
            </div>
            <div className="flex justify-center">
              <div className={pipBase} />
            </div>
            <div className="flex justify-between">
              <div className={pipBase} />
              <div className={pipBase} />
            </div>
          </div>
        )
      case 6:
      default:
        return (
          <div className="flex flex-col justify-between h-full">
            <div className="flex justify-between">
              <div className={pipBase} />
              <div className={pipBase} />
            </div>
            <div className="flex justify-between">
              <div className={pipBase} />
              <div className={pipBase} />
            </div>
            <div className="flex justify-between">
              <div className={pipBase} />
              <div className={pipBase} />
            </div>
          </div>
        )
    }
  }
  return <div className="w-full h-full p-3">{renderPips()}</div>
}

// ─────────────────────────────────────────────────────────────
// AR LENS OVERLAY — fullscreen iframe loading superhero-ar.html
// Replaces the old ARScanner component entirely
// ─────────────────────────────────────────────────────────────
const ARLensOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [loaded, setLoaded] = useState(false)

  // Prevent body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] bg-black flex flex-col"
      style={{ animation: "fadeIn 0.3s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

      {/* Loading state — shown until iframe fires onLoad */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
          <p className="text-white text-xs font-black uppercase tracking-[0.3em]">
            Activating AR Lens...
          </p>
        </div>
      )}

      {/* The iframe — loads superhero-ar.html from public folder */}
      <iframe
        src="/tfiz/superhero-ar.html"
        className="flex-1 w-full border-0"
        allow="camera; microphone; accelerometer; gyroscope"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        title="SuperheroAR"
        style={{ display: loaded ? "block" : "none" }}
      />

      {/* Close button — always on top */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-xl border border-white/20 text-white px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl"
        title="Close AR Lens">
        <X className="w-4 h-4" />
        <span className="hidden sm:inline">Close Lens</span>
      </button>

      {/* TFiZ branding watermark */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full pointer-events-none">
        <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <span className="text-white text-[9px] font-black uppercase tracking-widest">
          TFiZ AR Lens
        </span>
      </div>
    </div>
  )
}

// --- Main App ---
export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("tfiz_catalog")
    return saved ? JSON.parse(saved) : PRODUCTS
  })
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [purchasedIds, setPurchasedIds] = useState<string[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutStep, setIsCheckoutStep] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")

  // arState — isActive is the only flag we now need (iframe handles everything else)
  const [arActive, setArActive] = useState(false)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")

  const [discountValue, setDiscountValue] = useState<number>(0)
  const [gamePlayed, setGamePlayed] = useState<boolean>(false)
  const [isRolling, setIsRolling] = useState(false)
  const [diceValue, setDiceValue] = useState<number | null>(null)

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: 0,
    category: "T-shirts",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
    ],
    description: "",
    availability: true,
    rating: 5.0,
    reviews: 0,
  })

  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const orders = localStorage.getItem("tfiz_orders")
    if (orders) setPurchasedIds(JSON.parse(orders))
  }, [])

  useEffect(() => {
    localStorage.setItem("tfiz_catalog", JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (currentSlide === 2) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1))
    }, 8000)
    return () => clearInterval(timer)
  }, [currentSlide])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  const filteredProducts = useMemo(() => {
    return selectedCategory === "All"
      ? products
      : products.filter(
          (p) =>
            p.category.includes(selectedCategory as Category) ||
            p.category === selectedCategory,
        )
  }, [products, selectedCategory])

  const subtotalBeforeDiscount = useMemo(
    () => cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    [cartItems],
  )
  const discountAmount = useMemo(
    () => (subtotalBeforeDiscount * discountValue) / 100,
    [subtotalBeforeDiscount, discountValue],
  )
  const subtotal = subtotalBeforeDiscount - discountAmount

  const handleAddToCart = (p: Product) => {
    if (!p.availability) return
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === p.id)
      if (existing)
        return prev.map((i) =>
          i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      return [
        ...prev,
        {
          product: p,
          quantity: 1,
          selectedSize: p.sizes?.[0],
          selectedColor: p.colors?.[0],
        },
      ]
    })
    setIsCartOpen(true)
  }

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault()
    const newPurchases = [
      ...purchasedIds,
      ...cartItems.map((i) => i.product.id),
    ]
    setPurchasedIds(newPurchases)
    localStorage.setItem("tfiz_orders", JSON.stringify(newPurchases))
    setCartItems([])
    setIsCartOpen(false)
    setIsCheckoutStep(false)
    alert(
      `Order Confirmed! Your ${discountValue}% discount has been processed. Check your email for activation instructions.`,
    )
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword === "tfiz2025") {
      setIsAdminLoggedIn(true)
      setAdminPassword("")
    } else {
      alert("Unauthorized Access. Security alert triggered.")
    }
  }

  const toggleStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, availability: !p.availability } : p,
      ),
    )
  }

  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const id = `new-${Date.now()}`
    const productToAdd = { ...newProduct, id } as Product
    setProducts((prev) => [productToAdd, ...prev])
    setNewProduct({
      name: "",
      price: 0,
      originalPrice: 0,
      category: "T-shirts",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
      ],
      description: "",
      availability: true,
      rating: 5.0,
      reviews: 0,
    })
    alert("Protocol Success: Item Published to Catalog.")
  }

  const rollDiceForDiscount = () => {
    if (isRolling) return
    setIsRolling(true)
    const rolled = Math.floor(Math.random() * 6) + 1
    setDiceValue(rolled)
    let winDiscount = 10
    if (rolled === 3 || rolled === 4) winDiscount = 14
    if (rolled === 5 || rolled === 6) winDiscount = 18
    setTimeout(() => {
      setDiscountValue(winDiscount)
      setGamePlayed(true)
      setIsRolling(false)
    }, 800)
  }

  const [billing, setBilling] = useState<BillingDetails>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
    paymentMethod: "card",
  })

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white font-sans antialiased">
      {/* ── AR Lens Overlay — mounts when arActive is true ── */}
      {arActive && <ARLensOverlay onClose={() => setArActive(false)} />}

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-10 py-6 flex items-center justify-between">
        <div
          className="flex items-center gap-4 group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="flex items-center">
            <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1.5 mr-4 transition-transform group-hover:scale-110">
              <BrandLogoIcon />
            </div>
            <div className="flex items-center justify-center">
              <h1 className="text-4xl font-black tracking-tighter italic leading-none">
                TFiZ
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Open AR Lens button — now sets arActive */}
          <button
            onClick={() => setArActive(true)}
            className="group flex items-center gap-3 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest bg-black text-white hover:scale-105 transition-all shadow-xl active:scale-95">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[7px] opacity-40 lowercase italic font-bold">
                launch
              </span>
              <span>LENS</span>
            </div>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-3 bg-white hover:bg-black hover:text-white rounded-full transition-all relative border border-gray-200 shadow-sm">
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce-subtle">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="px-6 py-12 relative"
        ref={heroRef}
        onMouseMove={handleMouseMove}>
        <div className="max-w-[1440px] mx-auto min-h-[660px] relative overflow-hidden rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)]">
          <div
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center bg-black p-12 md:p-24 text-white ${currentSlide === 0 ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <div
              className="relative z-10 w-full transition-transform duration-200 ease-out flex flex-col items-start"
              style={{
                transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
              }}>
              <h2 className="text-8xl md:text-[140px] font-black tracking-tighter leading-[0.85] uppercase italic mb-12">
                WEAR <br /> THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                  DIGITAL.
                </span>
              </h2>
              <p className="text-lg md:text-xl text-white/40 font-black uppercase tracking-[0.05em] leading-relaxed max-w-2xl mb-12">
                PREMIUM LIFESTYLE GOODS CURATED BY TFiZ FOR THE DIGITAL NATIVE.
                EVERY PIECE FEATURES AN EMBEDDED SIGNATURE FOR IMMERSIVE AR
                ACTIVATION.
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("catalog")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-white text-black px-24 py-10 rounded-2xl font-black uppercase tracking-[0.2em] text-lg hover:scale-105 transition-all shadow-2xl active:scale-95">
                Shop Catalog
              </button>
            </div>
            <div className="absolute bottom-16 right-16 z-20 flex gap-4">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${currentSlide === i ? "bg-white" : "bg-white/20"}`}
                />
              ))}
            </div>
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center p-12 md:p-24 text-white bg-black ${currentSlide === 1 ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <div
              className="relative z-10 w-full transition-transform duration-200 ease-out flex flex-col items-start"
              style={{
                transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
              }}>
              <h2 className="text-8xl md:text-[140px] font-black tracking-tighter leading-[0.85] uppercase italic mb-12">
                ACTIVATE <br /> THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#a855f7] to-[#ec4899]">
                  VIBE.
                </span>
              </h2>
              <p className="text-lg md:text-xl text-white/40 font-black uppercase tracking-[0.05em] leading-relaxed max-w-2xl mb-12">
                THE SHIRT IS JUST THE START. SCAN THE EXCLUSIVE QR CODE ON YOUR
                PHYSICAL GARMENT TO UNLOCK IMMERSIVE LIVE AR EFFECTS IN
                REAL-TIME.
              </p>
              {/* This slide's CTA also opens the AR Lens */}
              <button
                onClick={() => setArActive(true)}
                className="bg-white text-black px-24 py-10 rounded-2xl font-black uppercase tracking-[0.2em] text-lg hover:scale-105 transition-all shadow-2xl active:scale-95">
                Open AR Lens
              </button>
            </div>
            <div className="absolute bottom-16 right-16 z-20 flex gap-4">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${currentSlide === i ? "bg-white" : "bg-white/20"}`}
                />
              ))}
            </div>
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center p-12 md:p-24 text-white bg-black ${currentSlide === 2 ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <div
              className="relative z-10 w-full flex flex-col lg:flex-row gap-12 items-center"
              style={{
                transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
              }}>
              <div className="flex-1 flex flex-col items-start">
                <h2 className="text-6xl md:text-[90px] font-black tracking-tighter leading-[0.9] uppercase italic mb-8">
                  ROLL <br /> THE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400">
                    PROTOCOL.
                  </span>
                </h2>
                <p className="text-sm md:text-base text-white/50 font-black uppercase tracking-[0.15em] leading-relaxed max-w-xl mb-6">
                  Roll the cube and let fate decide your discount for this
                  session.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  <span>Last Roll: {diceValue ?? "--"}</span>
                  {discountValue > 0 && (
                    <span className="text-green-400">
                      Current Reward: {discountValue}% Off
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-md h-80 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-[3rem] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#f97316_0,_transparent_60%),radial-gradient(circle_at_bottom,_#ef4444_0,_transparent_60%)]" />
                  <div className="relative flex flex-col items-center gap-8">
                    <div className="flex items-center justify-center">
                      <div
                        className={`w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-white via-gray-100 to-gray-300 text-black flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-black/20 transform ${isRolling ? "animate-spin" : "rotate-[-15deg]"}`}>
                        <DiceFace value={diceValue ?? 6} />
                      </div>
                    </div>
                    <button
                      onClick={rollDiceForDiscount}
                      disabled={isRolling}
                      className="px-10 py-4 rounded-full font-black uppercase tracking-[0.3em] text-xs shadow-2xl transition-all bg-white text-black hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3">
                      {isRolling ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Rolling...
                        </>
                      ) : (
                        <>
                          <Dice5 className="w-4 h-4" />
                          Roll Dice
                        </>
                      )}
                    </button>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      Discounts reset when you refresh the page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-16 right-16 z-20 flex gap-4">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${currentSlide === i ? "bg-white" : "bg-white/20"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gamified Discount Banner */}
      <section className="px-6 mb-12 max-w-[1440px] mx-auto">
        <div className="bg-gray-50 border border-gray-100 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-12 transition-transform duration-500 shrink-0">
              <Gift className="w-10 h-10 text-white animate-bounce-subtle" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-tight mb-2">
                {gamePlayed
                  ? `PROMO ACTIVATED: ${discountValue}% OFF`
                  : "UNLOCK YOUR DIGITAL REWARD"}
              </h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                {gamePlayed
                  ? `SAVINGS AUTOMATICALLY APPLIED AT CHECKOUT PROTOCOL ✅`
                  : "PARTICIPATE IN THE ACTIVATION GRID TO SECURE 10-20% SAVINGS 🎉"}
              </p>
            </div>
          </div>
          {!gamePlayed ? (
            <button
              onClick={() => {
                setCurrentSlide(2)
                heroRef.current?.scrollIntoView({ behavior: "smooth" })
              }}
              className="bg-black text-white px-12 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center gap-3 group relative z-10">
              Initialize Game <Trophy className="w-4 h-4 text-yellow-400" />
            </button>
          ) : (
            <div className="flex items-center gap-4 bg-white px-8 py-5 rounded-2xl border border-black/5 shadow-xl relative z-10">
              <span className="text-3xl font-black italic tracking-tighter">
                -{discountValue}%
              </span>
              <div className="w-px h-8 bg-gray-100 mx-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500">
                LOCKED IN
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 mb-24 overflow-x-auto no-scrollbar">
        <div className="max-w-[1440px] mx-auto flex gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-14 py-8 rounded-[2rem] font-black text-[14px] uppercase tracking-[0.25em] transition-all border-2 ${selectedCategory === cat ? "bg-black text-white border-black shadow-2xl scale-105" : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black hover:shadow-lg"}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Catalog */}
      <main id="catalog" className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
          {filteredProducts.map((p, idx) => (
            <div
              key={p.id}
              className={`group cursor-pointer bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 transition-all duration-700 animate-in fade-in slide-in-from-bottom-12 ${!p.availability ? "opacity-60 grayscale" : "hover:border-black/5 hover:shadow-3xl"}`}
              style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className={`w-full h-full object-cover transition-all duration-1000 ${p.availability ? "grayscale group-hover:grayscale-0 group-hover:scale-110" : ""}`}
                />
                <div className="absolute top-8 left-8 flex flex-col gap-3">
                  {!p.availability && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-6 py-3 rounded-full uppercase tracking-[0.3em] shadow-2xl animate-pulse">
                      SOLD OUT
                    </span>
                  )}
                  {p.discount && p.availability && (
                    <span className="bg-black text-white text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-2xl">
                      {p.discount}
                    </span>
                  )}
                  {p.arEffect && p.availability && (
                    <div className="bg-white/95 backdrop-blur-xl text-black text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest flex items-center gap-2.5 border border-black/5 shadow-2xl">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 animate-pulse" />{" "}
                      AR SIG. READY
                    </div>
                  )}
                </div>
                {p.availability && (
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="absolute bottom-10 right-10 w-20 h-20 bg-black text-white shadow-2xl rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-6 group-hover:translate-y-0 active:scale-90 hover:bg-zinc-800">
                    <Plus className="w-10 h-10" />
                  </button>
                )}
              </div>
              <div className="p-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">
                    {p.category}
                  </div>
                  <div className="flex-1 h-px bg-gray-50" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-6 uppercase italic leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-gray-400 transition-all">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-gray-900 tracking-tighter italic">
                    {formatPrice(p.price)}
                  </span>
                  <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-black">{p.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-40 px-10 border-t border-white/5 relative overflow-hidden mt-40">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-16 text-center relative z-10">
          <div
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-2xl shadow-white/10 p-2">
              <BrandLogoIcon />
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic">
              TFiZ
            </h1>
          </div>
          <div className="w-full relative">
            <div className="flex flex-wrap justify-center gap-16 text-[11px] font-black uppercase tracking-[0.4em] text-white/30">
              <a href="#" className="hover:text-white transition-colors">
                Digital Collectibles
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Activation Protocol
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Guard
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support Grid
              </a>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hover:text-white transition-all flex items-center gap-2 bg-white/5 px-6 py-2 rounded-full border border-white/10 italic">
                <Database className="w-3 h-3" /> Admin Protocol
              </button>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-white/10 transition-all flex items-center justify-center bg-white/5 px-5 py-3 rounded-full border border-white/20"
              aria-label="Scroll to top">
              <ArrowUp className="w-5 h-5 text-red-500" />
            </button>
          </div>
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">
            © 2025 TFiZ AR SYSTEMS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[4rem] shadow-3xl flex flex-col overflow-hidden">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                    Central Control Grid
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                    Inventory Management & Publication Layer
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAdminOpen(false)
                  setIsAdminLoggedIn(false)
                }}
                className="p-4 bg-white border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white">
              {!isAdminLoggedIn ? (
                <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto">
                  <Lock className="w-16 h-16 text-gray-200 mb-8" />
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">
                    Authorization Required
                  </h3>
                  <form
                    onSubmit={handleAdminLogin}
                    className="w-full space-y-6">
                    <input
                      autoFocus
                      type="password"
                      placeholder="Protocol Key (Password)"
                      className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] font-black tracking-widest focus:border-black outline-none transition-all text-center"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-full bg-black text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95">
                      Access Terminal
                    </button>
                  </form>
                  <p className="mt-8 text-[9px] text-gray-300 font-bold uppercase tracking-[0.4em] italic text-center">
                    Unauthorized attempts are logged & analyzed.
                  </p>
                </div>
              ) : (
                <div className="space-y-20">
                  <section>
                    <div className="flex items-center gap-4 mb-10">
                      <PlusSquare className="w-8 h-8 text-black" />
                      <h3 className="text-3xl font-black uppercase italic tracking-tight">
                        Publish New Commodity
                      </h3>
                    </div>
                    <form
                      onSubmit={handlePublishProduct}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                      <div className="space-y-6">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                          Identity Details
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Product Name"
                          className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                        />
                        <select
                          className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none appearance-none"
                          value={newProduct.category}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              category: e.target.value as Category,
                            }))
                          }>
                          {CATEGORIES.filter((c) => c !== "All").map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <textarea
                          placeholder="Description Archive"
                          className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none min-h-[120px]"
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-6">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                          Valuation Grid
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            required
                            type="number"
                            placeholder="Active Price"
                            className="p-6 bg-white border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none"
                            value={newProduct.price || ""}
                            onChange={(e) =>
                              setNewProduct((p) => ({
                                ...p,
                                price: Number(e.target.value),
                              }))
                            }
                          />
                          <input
                            type="number"
                            placeholder="Retail Original"
                            className="p-6 bg-white border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none"
                            value={newProduct.originalPrice || ""}
                            onChange={(e) =>
                              setNewProduct((p) => ({
                                ...p,
                                originalPrice: Number(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                          Visual Source (URL)
                        </label>
                        <input
                          type="text"
                          placeholder="Image URI"
                          className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none"
                          value={newProduct.images?.[0]}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              images: [e.target.value],
                            }))
                          }
                        />
                        <button
                          type="submit"
                          className="w-full bg-black text-white py-8 rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-sm shadow-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-4">
                          <Zap className="w-5 h-5 text-yellow-400" /> Commit to
                          Catalog
                        </button>
                      </div>
                    </form>
                  </section>
                  <section>
                    <div className="flex items-center gap-4 mb-10">
                      <Package className="w-8 h-8 text-black" />
                      <h3 className="text-3xl font-black uppercase italic tracking-tight">
                        Active Fulfillment Grid
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {products.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-8 p-6 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl transition-all group">
                          <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                            <img
                              src={p.images[0]}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none">
                              {p.name}
                            </h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                              {p.category} • {formatPrice(p.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${p.availability ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                              {p.availability
                                ? "SYNCED: IN STOCK"
                                : "OFFLINE: OUT OF STOCK"}
                            </span>
                            <button
                              onClick={() => toggleStock(p.id)}
                              className={`p-4 rounded-2xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest ${p.availability ? "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500" : "bg-black text-white"}`}>
                              {p.availability ? (
                                <>
                                  <EyeOff className="w-4 h-4" /> Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" /> Activate
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
            <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300">
                TFiZ COMMAND INTERFACE v4.2.0 • ENCRYPTION ACTIVE
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cart & Checkout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full p-12 flex flex-col shadow-3xl animate-in slide-in-from-right duration-500 rounded-l-[4rem]">
            <div className="flex justify-between items-center mb-16">
              <div className="space-y-1">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">
                  {isCheckoutStep ? "Secure Protocol" : "Current Bag"}
                </h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] italic">
                  {isCheckoutStep
                    ? "Encrypted Checkout Active"
                    : "Review Selected Goods"}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false)
                  setIsCheckoutStep(false)
                }}
                className="p-4 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all shadow-sm border border-gray-100">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-6">
              {!isCheckoutStep ? (
                cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300">
                    <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mb-8 border border-gray-100 shadow-inner">
                      <ShoppingBag className="w-16 h-16 opacity-20" />
                    </div>
                    <p className="font-black uppercase tracking-[0.3em] text-sm italic">
                      Protocol: Bag is Empty
                    </p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {cartItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-10 items-start animate-in fade-in slide-in-from-right-8"
                        style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="w-32 h-44 bg-gray-50 rounded-[2.5rem] overflow-hidden shrink-0 shadow-lg border border-gray-100">
                          <img
                            src={item.product.images[0]}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 py-2">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-black text-2xl uppercase italic tracking-tighter leading-none">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() =>
                                setCartItems((p) =>
                                  p.filter((_, i) => i !== idx),
                                )
                              }
                              className="text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-6 h-6" />
                            </button>
                          </div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">
                            {item.product.category}
                          </p>
                          <div className="flex justify-between items-center border-t border-dashed border-gray-100 pt-6">
                            <span className="font-black text-2xl italic">
                              {formatPrice(item.product.price)}
                            </span>
                            <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                              <button
                                onClick={() =>
                                  setCartItems((p) =>
                                    p.map((it, i) =>
                                      i === idx
                                        ? {
                                            ...it,
                                            quantity: Math.max(
                                              1,
                                              it.quantity - 1,
                                            ),
                                          }
                                        : it,
                                    ),
                                  )
                                }
                                className="text-gray-400 hover:text-black">
                                <Minus className="w-5 h-5" />
                              </button>
                              <span className="font-black text-lg">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  setCartItems((p) =>
                                    p.map((it, i) =>
                                      i === idx
                                        ? { ...it, quantity: it.quantity + 1 }
                                        : it,
                                    ),
                                  )
                                }
                                className="text-gray-400 hover:text-black">
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <form
                  id="checkout-form"
                  onSubmit={handlePurchase}
                  className="space-y-10 animate-in fade-in duration-500 px-2">
                  <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-[0.4em] text-[11px] text-gray-400 flex items-center gap-3 italic">
                      <User className="w-4 h-4" /> Identification
                    </h5>
                    <div className="grid grid-cols-1 gap-4">
                      <input
                        required
                        type="text"
                        placeholder="Full Identity"
                        className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none transition-all shadow-sm"
                        value={billing.fullName}
                        onChange={(e) =>
                          setBilling((p) => ({
                            ...p,
                            fullName: e.target.value,
                          }))
                        }
                      />
                      <input
                        required
                        type="email"
                        placeholder="Digital Address (Email)"
                        className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none transition-all shadow-sm"
                        value={billing.email}
                        onChange={(e) =>
                          setBilling((p) => ({ ...p, email: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-[0.4em] text-[11px] text-gray-400 flex items-center gap-3 italic">
                      <MapPin className="w-4 h-4" /> Fulfillment Grid
                    </h5>
                    <textarea
                      required
                      placeholder="Delivery Coordinates (Full Address)"
                      className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none transition-all min-h-[120px] shadow-sm"
                      value={billing.address}
                      onChange={(e) =>
                        setBilling((p) => ({ ...p, address: e.target.value }))
                      }
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        required
                        type="text"
                        placeholder="City"
                        className="p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none shadow-sm"
                        value={billing.city}
                        onChange={(e) =>
                          setBilling((p) => ({ ...p, city: e.target.value }))
                        }
                      />
                      <input
                        required
                        type="text"
                        placeholder="ZIP Protocol"
                        className="p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold focus:border-black outline-none shadow-sm"
                        value={billing.zip}
                        onChange={(e) =>
                          setBilling((p) => ({ ...p, zip: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-[0.4em] text-[11px] text-gray-400 flex items-center gap-3 italic">
                      <CreditCard className="w-4 h-4" /> Transaction Layer
                    </h5>
                    <div className="grid grid-cols-3 gap-4">
                      {(["card", "upi", "crypto"] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() =>
                            setBilling((p) => ({ ...p, paymentMethod: m }))
                          }
                          className={`p-6 rounded-[1.5rem] border font-black text-[10px] uppercase tracking-widest transition-all shadow-sm ${billing.paymentMethod === m ? "bg-black text-white border-black shadow-xl scale-105" : "bg-gray-50 text-gray-400 border-gray-100 hover:border-black/20"}`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}
            </div>
            <div className="mt-12 pt-12 border-t-2 border-dashed border-gray-100">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400 font-bold uppercase text-xs tracking-[0.3em]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalBeforeDiscount)}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between text-green-500 font-bold uppercase text-xs tracking-[0.3em]">
                    <span>Activated Discount ({discountValue}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-5xl font-black uppercase italic tracking-tighter pt-4">
                  <span>Pay</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
              {!isCheckoutStep ? (
                <button
                  onClick={() => setIsCheckoutStep(true)}
                  disabled={cartItems.length === 0}
                  className="w-full bg-black text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] active:scale-95 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.15)] disabled:bg-gray-100 disabled:text-gray-300 group overflow-hidden relative">
                  <span className="relative z-10">Initialize Checkout</span>
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <button
                    form="checkout-form"
                    type="submit"
                    className="w-full bg-black text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] active:scale-95 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex items-center justify-center gap-4 group">
                    <ShieldCheck className="w-8 h-8 text-green-400" /> Verify &
                    Authorize
                  </button>
                  <button
                    onClick={() => setIsCheckoutStep(false)}
                    className="w-full py-4 font-black uppercase text-[10px] tracking-[0.5em] text-gray-400 hover:text-black transition-all italic">
                    ← Revert to Bag
                  </button>
                </div>
              )}
              <div className="mt-8 flex items-center justify-center gap-3 text-gray-300 font-bold text-[9px] uppercase tracking-[0.4em] italic">
                <Lock className="w-3.5 h-3.5" /> End-to-End Secure Transaction
                Layer Active
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
