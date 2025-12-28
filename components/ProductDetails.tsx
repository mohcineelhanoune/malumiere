


import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Star, Minus, Plus, ShoppingBag, Heart, Check, ArrowLeft, Truck, ShieldCheck, RefreshCw, Zap, Timer, ArrowLeftRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency, PRODUCTS } from '../services/mockData';
import ProductCard from './ProductCard';
import ExpressCheckoutModal from './ExpressCheckoutModal';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isCompared?: boolean;
  onToggleCompare?: (product: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  onBack, 
  onProductClick, 
  onQuickView,
  isCompared = false,
  onToggleCompare
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();
  
  // Extended variation logic with price modifiers and image offsets
  const colors = [
    { name: "Midnight Black", class: "bg-gray-900", priceMod: 0, imageOffset: 0 },
    { name: "Royal Gold", class: "bg-amber-400", priceMod: 150, imageOffset: 12 }, // +150 MAD
    { name: "Pearl White", class: "bg-gray-100", priceMod: 0, imageOffset: 25 },
    { name: "Deep Navy", class: "bg-blue-900", priceMod: 0, imageOffset: 34 }
  ];

  const sizes = [
    { name: "S", priceMod: 0 },
    { name: "M", priceMod: 0 },
    { name: "L", priceMod: 50 }, // +50 MAD
    { name: "XL", priceMod: 100 } // +100 MAD
  ];

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[1]); // Default M
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [currentImage, setCurrentImage] = useState(product.image);
  
  // Express Checkout State
  const [isExpressOpen, setIsExpressOpen] = useState(false);

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState(14 * 60 * 60 + 45 * 60 + 30); // Start with ~14h 45m

  // Calculate dynamic price based on selection
  const currentPrice = product.price + selectedColor.priceMod + selectedSize.priceMod;

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setIsAdded(false);
    setSelectedColor(colors[0]);
    setSelectedSize(sizes[1]);
    setActiveTab('description');
    
    // Reset timer roughly for new product view (simulated)
    setTimeLeft(14 * 60 * 60 + Math.floor(Math.random() * 3600));
  }, [product]);

  // Update image when color changes (Simulated for demo purposes)
  useEffect(() => {
    // If it's a picsum url (mock data), we can simulate a color change by changing the random seed
    if (product.image.includes('picsum.photos')) {
       // Extract base url
       const baseUrl = product.image.split('?')[0];
       // Create a deterministic but different random seed based on product ID and color
       const randomId = product.id + selectedColor.imageOffset;
       setCurrentImage(`${baseUrl}?random=${randomId}`);
    } else {
       setCurrentImage(product.image);
    }
  }, [selectedColor, product]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { h, m, s };
  };

  const time = formatTime(timeLeft);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    // Create a product object with the specific price/variation details
    const productVariant = {
        ...product,
        price: currentPrice,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(productVariant);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleExpressBuy = () => {
    setIsExpressOpen(true);
  };

  const similarProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // Mock variations based on category
  const hasVariations = product.category === "Clothing" || product.category === "Accessories";

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  // Gallery logic: use product.images if available, else simulate with current image and fallback
  const galleryImages = product.images && product.images.length > 0 
      ? product.images 
      : [currentImage, ...Array(3).fill(product.image)];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-40 transition-colors duration-300">
      <ExpressCheckoutModal 
        product={{...product, price: currentPrice}} 
        quantity={quantity} 
        isOpen={isExpressOpen} 
        onClose={() => setIsExpressOpen(false)} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Breadcrumb / Back */}
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {t('backToShop')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Image Gallery */}
          <div className="space-y-6 lg:sticky lg:top-24 transition-all duration-300">
            <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center p-8 relative group">
              <img 
                src={currentImage} 
                alt={product.title}
                className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Sale Badge on Details */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                    {t('save')} {discountPercentage}%
                </div>
              )}

              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button 
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                    isWishlisted 
                        ? 'bg-red-50 dark:bg-red-900/30 text-red-500' 
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-red-500'
                    }`}
                >
                    <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                {onToggleCompare && (
                    <button 
                        onClick={() => onToggleCompare(product)}
                        className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                        isCompared 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-amber-600'
                        }`}
                        title={isCompared ? t('removeFromCompare') : t('addToCompare')}
                    >
                        <ArrowLeftRight className="h-6 w-6" />
                    </button>
                )}
              </div>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {galleryImages.slice(0, 4).map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentImage(img)}
                  className={`aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl border-2 overflow-hidden p-2 flex items-center justify-center transition-all ${
                    currentImage === img 
                      ? 'border-amber-500 ring-2 ring-amber-200 dark:ring-amber-900' 
                      : 'border-transparent hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info & Tabs */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-amber-600 dark:text-amber-400 font-bold tracking-wider uppercase text-xs bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-6 space-x-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(product.rating.rate) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`}
                  />
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm border-l border-gray-200 dark:border-gray-700 pl-4 font-medium">
                {product.rating.rate} {t('rating')} <span className="mx-1">•</span> {product.rating.count} {t('reviews')}
              </span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              <span className={`text-4xl font-bold transition-all duration-300 ${discountPercentage > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                {formatCurrency(currentPrice)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex flex-col mb-1">
                    <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                        {formatCurrency(product.originalPrice + selectedColor.priceMod + selectedSize.priceMod)}
                    </span>
                </div>
              )}
            </div>

            {/* Upsell Countdown */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-100 dark:border-amber-900/50 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg text-amber-600 dark:text-amber-500">
                        <Timer className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{t('specialOffer')}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Order now to get <span className="font-bold text-green-600 dark:text-green-400">{t('priorityShipping')}</span></p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-2 min-w-[50px] shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="font-bold text-lg text-gray-900 dark:text-white leading-none">{String(time.h).padStart(2, '0')}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-medium">Hrs</span>
                    </div>
                    <span className="text-gray-300 font-bold">:</span>
                    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-2 min-w-[50px] shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="font-bold text-lg text-amber-600 dark:text-amber-500 leading-none">{String(time.m).padStart(2, '0')}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-medium">Min</span>
                    </div>
                    <span className="text-gray-300 font-bold">:</span>
                    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-2 min-w-[50px] shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="font-bold text-lg text-amber-600 dark:text-amber-500 leading-none">{String(time.s).padStart(2, '0')}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-medium">Sec</span>
                    </div>
                </div>
            </div>

            {/* Variations (Conditional) */}
            {hasVariations && (
              <div className="space-y-6 mb-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div>
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('color')}: <span className="text-gray-900 dark:text-white font-bold">{selectedColor.name}</span>
                    {selectedColor.priceMod > 0 && <span className="text-amber-600 text-xs ml-2 font-bold">(+{formatCurrency(selectedColor.priceMod)})</span>}
                  </span>
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`group w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColor.name === color.name 
                            ? 'border-amber-600 dark:border-amber-500 scale-110' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        title={color.name}
                      >
                        <span 
                          className={`w-8 h-8 rounded-full shadow-sm ring-1 ring-inset ring-black/10 transition-shadow ${color.class}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('size')}: <span className="text-gray-900 dark:text-white font-bold">{selectedSize.name}</span>
                    {selectedSize.priceMod > 0 && <span className="text-amber-600 text-xs ml-2 font-bold">(+{formatCurrency(selectedSize.priceMod)})</span>}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[3rem] h-10 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                          selectedSize.name === size.name
                            ? 'border-amber-600 text-amber-600 dark:border-amber-500 dark:text-amber-400 bg-white dark:bg-gray-800 shadow-sm'
                            : 'border-transparent bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions Block (Desktop) */}
            <div className="hidden lg:grid grid-cols-2 gap-4 mb-10">
               <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-all transform active:scale-[0.98] border-2 ${
                      isAdded 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-amber-600 hover:text-amber-600 dark:hover:border-amber-500 dark:hover:text-amber-400'
                  }`}
                >
                  {isAdded ? (
                      <>
                          <Check className="h-5 w-5" />
                          {t('added')}
                      </>
                  ) : (
                      <>
                          <ShoppingBag className="h-5 w-5" />
                          {t('addToCart')}
                      </>
                  )}
                </button>
                <button
                  onClick={handleExpressBuy}
                  className="py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 transition-all transform active:scale-[0.98] hover:-translate-y-0.5"
                >
                   <Zap className="h-5 w-5 fill-current" />
                   {t('expressCheckout')}
                </button>
            </div>

            {/* Product Highlights / Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <Truck className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('freeShipping')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('warranty')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <RefreshCw className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('returns')}</span>
                </div>
            </div>

            {/* Tabs for Details */}
            <div className="mt-4">
              <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
                {['Description', 'Specs', 'Reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase() as any)}
                    className={`pb-4 px-6 text-sm sm:text-base font-semibold transition-all whitespace-nowrap relative ${
                      activeTab === tab.toLowerCase()
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    {t(tab.toLowerCase() as any)}
                  </button>
                ))}
              </div>
              
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 min-h-[200px]">
                {activeTab === 'description' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                    <p className="leading-relaxed">
                      {product.description}
                    </p>
                    <p>
                        Elevate your daily routine with the {product.title}. Designed with precision and style in mind, it seamlessly integrates into your lifestyle while offering superior performance.
                    </p>
                    <ul className="space-y-2 list-none pl-0">
                        <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Premium materials for enhanced durability</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Ergonomically designed for maximum comfort</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Modern aesthetic that fits any environment</span>
                        </li>
                    </ul>
                  </div>
                )}
                {activeTab === 'specs' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
                        <div className="grid grid-cols-2 p-4 border-b border-gray-100 dark:border-gray-800 gap-4">
                            <span className="text-gray-500 dark:text-gray-400">Material</span>
                            <span className="font-medium text-gray-900 dark:text-white">Premium Composite</span>
                        </div>
                        <div className="grid grid-cols-2 p-4 border-b border-gray-100 dark:border-gray-800 gap-4">
                            <span className="text-gray-500 dark:text-gray-400">Weight</span>
                            <span className="font-medium text-gray-900 dark:text-white">1.2 lbs</span>
                        </div>
                        <div className="grid grid-cols-2 p-4 border-b border-gray-100 dark:border-gray-800 gap-4">
                            <span className="text-gray-500 dark:text-gray-400">Dimensions</span>
                            <span className="font-medium text-gray-900 dark:text-white">12" x 8" x 4"</span>
                        </div>
                        <div className="grid grid-cols-2 p-4 gap-4">
                            <span className="text-gray-500 dark:text-gray-400">Origin</span>
                            <span className="font-medium text-gray-900 dark:text-white">Imported</span>
                        </div>
                    </div>
                  </div>
                )}
                {activeTab === 'reviews' && (
                   <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                     <div className="flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-900 rounded-xl mb-6">
                        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{product.rating.rate}</div>
                        <div className="flex text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.round(product.rating.rate) ? 'fill-current' : 'text-gray-300'}`}
                            />
                            ))}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">Based on {product.rating.count} reviews</p>
                     </div>
                     
                     <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className="h-3 w-3 fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Excellent Quality</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    Absolutely love this product! The quality is unmatched and it arrived faster than expected.
                                </p>
                                <div className="text-xs text-gray-400">Verified Buyer • 2 weeks ago</div>
                            </div>
                        ))}
                     </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-16 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('similarProducts')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onQuickView={onQuickView}
                onProductClick={onProductClick}
                isCompared={isCompared && onToggleCompare ? true : false} 
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Fixed Bottom Container */}
      <div className="fixed bottom-0 left-0 right-0 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
         
         {/* Free Shipping Banner */}
         <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold py-1.5 flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2">
            <Check className="h-3.5 w-3.5" />
            <span>{t('freeShippingBanner')}</span>
         </div>

         {/* Shop Now Bar */}
         <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-4">
             <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="hidden md:flex flex-col">
                    <p className="font-bold text-gray-900 dark:text-white text-lg truncate max-w-xs">{product.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={`font-bold text-lg ${discountPercentage > 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {formatCurrency(currentPrice)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-gray-400 line-through text-xs">{formatCurrency(product.originalPrice + selectedColor.priceMod + selectedSize.priceMod)}</span>
                        )}
                        <span className="text-gray-300 mx-1">•</span>
                        <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                            <Check className="h-3 w-3" /> {t('inStock')}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Quantity for Fixed Banner */}
                     <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 h-12 sm:h-12 w-28 sm:w-auto justify-between sm:justify-start">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-2 sm:px-3 h-full hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                            {quantity}
                        </span>
                        <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-2 sm:px-3 h-full hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex gap-2 flex-1 sm:flex-initial">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`hidden sm:flex flex-1 sm:flex-none h-12 px-4 rounded-xl items-center justify-center gap-2 font-bold transition-all transform active:scale-[0.98] border-2 ${
                                isAdded
                                ? 'bg-green-600 border-green-600 text-white cursor-default'
                                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-amber-600 hover:text-amber-600'
                            }`}
                            title={t('addToCart')}
                        >
                            {isAdded ? (
                                 <Check className="h-5 w-5" />
                            ) : (
                                 <ShoppingBag className="h-5 w-5" />
                            )}
                            <span className="hidden lg:inline">{isAdded ? t('added') : t('add')}</span>
                        </button>
                        
                        <button
                        onClick={handleExpressBuy}
                        className="flex-1 sm:flex-none h-12 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-lg bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 hover:shadow-amber-600/25 transition-all transform active:scale-[0.98]"
                        >
                            <Zap className="h-5 w-5 fill-current" />
                            <span className="whitespace-nowrap">{t('expressCheckout')}</span>
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => toggleWishlist(product)}
                        className={`hidden sm:flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all ${
                            isWishlisted
                            ? 'border-red-100 bg-red-50 text-red-500 dark:border-red-900 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 dark:hover:border-red-800 dark:hover:bg-red-900/20'
                        }`}
                    >
                        <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default ProductDetails;
