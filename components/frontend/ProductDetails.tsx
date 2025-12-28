import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../../types';
import { Star, Minus, Plus, ShoppingBag, Heart, Check, ArrowLeft, Truck, ShieldCheck, RefreshCw, Zap, Timer, ArrowLeftRight, ChevronDown, ChevronUp, FileText, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency, PRODUCTS } from '../../services/mockData';
import { generateAiDescription } from '../../services/mockAi';
import ProductCard from './ProductCard';
import ExpressCheckoutModal from './ExpressCheckoutModal';

interface ProductDetailsProps {
  product: Product;
  relatedProducts?: Product[];
  onBack: () => void;
  onProductClick: (product: Product) => void;
  isCompared?: boolean;
  onToggleCompare?: (product: Product) => void;
}

// Fix AccordionItem typing to ensure children are accepted properly by using React.FC
const AccordionItem: React.FC<{ title: string, isOpen: boolean, onClick: () => void, children: React.ReactNode }> = ({ title, isOpen, onClick, children }) => (
  <div className="border-b border-gray-200 dark:border-gray-800">
    <button
      className="w-full py-5 flex items-center justify-between text-left focus:outline-none group bg-white dark:bg-gray-950 transition-colors"
      onClick={onClick}
    >
      <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-amber-600 dark:text-amber-500' : 'text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500'}`}>
        {title}
      </span>
      {isOpen ? (
        <ChevronUp className="h-5 w-5 text-amber-600 dark:text-amber-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500" />
      )}
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="pt-2 text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </div>
  </div>
);

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  relatedProducts = [],
  onBack, 
  onProductClick, 
  isCompared = false,
  onToggleCompare
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const colors = [
    { name: "Midnight Black", class: "bg-gray-900", priceMod: 0, imageOffset: 0 },
    { name: "Royal Gold", class: "bg-amber-400", priceMod: 150, imageOffset: 12 }, 
    { name: "Pearl White", class: "bg-gray-100", priceMod: 0, imageOffset: 25 },
    { name: "Deep Navy", class: "bg-blue-900", priceMod: 0, imageOffset: 34 }
  ];

  const sizes = [
    { name: "S", priceMod: 0 },
    { name: "M", priceMod: 0 },
    { name: "L", priceMod: 50 }, 
    { name: "XL", priceMod: 100 } 
  ];

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[1]); 
  const [isAdded, setIsAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('description');
  const [currentImage, setCurrentImage] = useState(product.image);
  
  const [aiDescription, setAiDescription] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [isExpressOpen, setIsExpressOpen] = useState(false);

  const [timeLeft, setTimeLeft] = useState(14 * 60 * 60 + 45 * 60 + 30); 

  const currentPrice = product.price + selectedColor.priceMod + selectedSize.priceMod;

  // Create temporary CartItem for Express Checkout
  const checkoutItem: CartItem = {
      ...product,
      price: currentPrice,
      quantity: quantity
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setIsAdded(false);
    setSelectedColor(colors[0]);
    setSelectedSize(sizes[1]);
    setOpenSection('description');
    
    setTimeLeft(14 * 60 * 60 + Math.floor(Math.random() * 3600));

    const loadAiContent = async () => {
        setLoadingAi(true);
        try {
            const desc = await generateAiDescription(product.title, product.category, ""); 
            setAiDescription(desc);
        } catch (error) {
            console.error("Failed to generate AI description", error);
            setAiDescription(product.description); 
        } finally {
            setLoadingAi(false);
        }
    };
    loadAiContent();

  }, [product]);

  useEffect(() => {
    if (product.image.includes('picsum.photos')) {
       const baseUrl = product.image.split('?')[0];
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

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Logic for similar products from API data
  const sourceProducts = relatedProducts && relatedProducts.length > 0 ? relatedProducts : PRODUCTS;
  let similar = sourceProducts.filter(p => p.category === product.category && p.id !== product.id);
  if (similar.length < 4) {
      const others = sourceProducts.filter(p => p.category !== product.category && p.id !== product.id);
      similar = [...similar, ...others];
  }
  const similarProducts = similar.slice(0, 10);

  const hasVariations = product.category === "Clothing" || product.category === "Accessories";

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  const galleryImages = product.images && product.images.length > 0 
      ? product.images 
      : [currentImage, ...Array(3).fill(product.image)];

  // Stock Logic
  const stockCount = product.stock !== undefined ? product.stock : 10;
  const isOutOfStock = stockCount <= 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-40 transition-colors duration-300">
      <ExpressCheckoutModal 
        items={[checkoutItem]}
        isOpen={isExpressOpen} 
        onClose={() => setIsExpressOpen(false)} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
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
            {/* Updated to 4:5 and object-cover for minimalist look */}
            <div className="aspect-[4/5] bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 relative group">
              <img 
                src={currentImage} 
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                    {t('save')} {discountPercentage}%
                </div>
              )}

              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button 
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                    isWishlisted 
                        ? 'bg-white text-red-500' 
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
                  className={`aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    currentImage === img 
                      ? 'ring-2 ring-amber-500' 
                      : 'hover:opacity-80'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {product.title}
            </h1>

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

            {/* Actions Block (Desktop) */}
            <div className="hidden lg:grid grid-cols-2 gap-4 mb-10">
               <button
                  onClick={handleAddToCart}
                  disabled={isAdded || isOutOfStock}
                  className={`py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-all transform active:scale-[0.98] border-2 ${
                      isOutOfStock
                      ? 'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed'
                      : isAdded 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-amber-600 hover:text-amber-600 dark:hover:border-amber-500 dark:hover:text-amber-400'
                  }`}
                >
                  {isOutOfStock ? (
                      <>
                          <ShoppingBag className="h-5 w-5" />
                          {t('outOfStock')}
                      </>
                  ) : isAdded ? (
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
                  disabled={isOutOfStock}
                  className={`py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-lg transition-all transform active:scale-[0.98] hover:-translate-y-0.5 ${
                      isOutOfStock
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 hover:shadow-amber-600/30'
                  }`}
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

            {/* Accordion System */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-800">
                {/* Description Panel */}
                <AccordionItem 
                    title={t('description')} 
                    isOpen={openSection === 'description'} 
                    onClick={() => toggleSection('description')}
                >
                    <div className="space-y-4">
                        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/20 text-center">
                            <p className="font-bold text-amber-800 dark:text-amber-400 text-sm mb-1">{t('promoTitle')}</p>
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('promoDelivery')}</p>
                        </div>
                        
                        {loadingAi ? (
                            <div className="flex items-center gap-2 py-4 text-amber-600 animate-pulse">
                                <Sparkles className="h-5 w-5" />
                                <span className="font-medium">Generating premium description...</span>
                            </div>
                        ) : (
                            <p className="leading-relaxed whitespace-pre-line">
                                {aiDescription || product.description}
                            </p>
                        )}
                    </div>
                </AccordionItem>

                {/* Downloads Panel */}
                <AccordionItem 
                    title={t('downloads')} 
                    isOpen={openSection === 'downloads'} 
                    onClick={() => toggleSection('downloads')}
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        {product.ft_url ? (
                            <a href={product.ft_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-lg font-bold transition-colors shadow-sm">
                                <FileText className="h-5 w-5" /> {t('techSheet')}
                            </a>
                        ) : (
                            <span className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-500 px-4 py-3 rounded-lg font-bold cursor-not-allowed">
                                <FileText className="h-5 w-5" /> {t('techSheet')} (Unavailable)
                            </span>
                        )}
                        
                        {product.fi_url ? (
                            <a href={product.fi_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-lg font-bold transition-colors shadow-sm">
                                <FileText className="h-5 w-5" /> {t('instructionSheet')}
                            </a>
                        ) : (
                            <span className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-500 px-4 py-3 rounded-lg font-bold cursor-not-allowed">
                                <FileText className="h-5 w-5" /> {t('instructionSheet')} (Unavailable)
                            </span>
                        )}
                    </div>
                </AccordionItem>

                {/* Payment Panel */}
                <AccordionItem 
                    title={t('paymentMethods')} 
                    isOpen={openSection === 'payment'} 
                    onClick={() => toggleSection('payment')}
                >
                    <p className="leading-relaxed">
                        {t('paymentText')}
                    </p>
                </AccordionItem>

                {/* Delivery Panel */}
                <AccordionItem 
                    title={t('deliveryTime')} 
                    isOpen={openSection === 'delivery'} 
                    onClick={() => toggleSection('delivery')}
                >
                    <p className="leading-relaxed">
                        {t('deliveryText')}
                    </p>
                </AccordionItem>

                {/* Installation Panel */}
                <AccordionItem 
                    title={t('installationService')} 
                    isOpen={openSection === 'installation'} 
                    onClick={() => toggleSection('installation')}
                >
                    <p className="leading-relaxed">
                        {t('installationText')}
                    </p>
                </AccordionItem>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-16 mt-16">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('similarProducts')}</h2>
             <div className="flex gap-2">
                <button 
                  onClick={() => scroll('left')}
                  className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
             </div>
          </div>
          
          <div className="relative group">
             <div 
               ref={scrollContainerRef}
               className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
             >
                {similarProducts.map((p, idx) => (
                   <div key={`${p.id}-${idx}`} className="min-w-[160px] sm:min-w-[280px] md:min-w-[calc(25%-18px)] snap-start">
                      <ProductCard 
                        product={p} 
                        onProductClick={onProductClick}
                        isCompared={isCompared && onToggleCompare ? true : false} 
                        onToggleCompare={onToggleCompare}
                        variant="minimal"
                      />
                   </div>
                ))}
             </div>
             
             {/* Fade gradients for scrolling indication */}
             <div className="absolute top-0 bottom-6 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent pointer-events-none sm:hidden" />
             <div className="absolute top-0 bottom-6 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent pointer-events-none sm:hidden" />
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
                        {isOutOfStock ? (
                            <span className="text-red-600 dark:text-red-400 font-medium flex items-center gap-1 text-xs">
                                <X className="h-3 w-3" /> {t('outOfStock')}
                            </span>
                        ) : (
                            <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1 text-xs">
                                <Check className="h-3 w-3" /> {t('inStock')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Quantity for Fixed Banner */}
                     <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 h-12 sm:h-12 w-28 sm:w-auto justify-between sm:justify-start">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-2 sm:px-3 h-full hover:text-amber-600 dark:hover:text-amber-400 transition-colors disabled:opacity-50"
                            disabled={isOutOfStock}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                            {quantity}
                        </span>
                        <button 
                            onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                            className="px-2 sm:px-3 h-full hover:text-amber-600 dark:hover:text-amber-400 transition-colors disabled:opacity-50"
                            disabled={isOutOfStock || quantity >= stockCount}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex gap-2 flex-1 sm:flex-initial">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded || isOutOfStock}
                            className={`hidden sm:flex flex-1 sm:flex-none h-12 px-4 rounded-xl items-center justify-center gap-2 font-bold transition-all transform active:scale-[0.98] border-2 ${
                                isOutOfStock
                                ? 'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed'
                                : isAdded
                                    ? 'bg-green-600 border-green-600 text-white cursor-default'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-amber-600 hover:text-amber-600'
                            }`}
                            title={t('addToCart')}
                        >
                            {isOutOfStock ? (
                                <X className="h-5 w-5" />
                            ) : isAdded ? (
                                 <Check className="h-5 w-5" />
                            ) : (
                                 <ShoppingBag className="h-5 w-5" />
                            )}
                            <span className="hidden lg:inline">{isOutOfStock ? t('outOfStock') : isAdded ? t('added') : t('add')}</span>
                        </button>
                        
                        <button
                        onClick={handleExpressBuy}
                        disabled={isOutOfStock}
                        className={`flex-1 sm:flex-none h-12 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-lg transition-all transform active:scale-[0.98] ${
                            isOutOfStock
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-50 dark:hover:bg-amber-600 hover:shadow-amber-600/25'
                        }`}
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
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;