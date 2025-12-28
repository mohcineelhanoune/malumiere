
import React from 'react';
import { Plus, Star, Heart, ArrowLeftRight, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../services/mockData';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
  isCompared?: boolean;
  onToggleCompare?: (product: Product) => void;
  variant?: 'default' | 'minimal';
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onProductClick,
  isCompared = false,
  onToggleCompare,
  variant = 'default'
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer ${
        isCompared ? 'ring-2 ring-amber-500' : 'hover:shadow-lg'
      }`}
      onClick={handleCardClick}
    >
      {/* Image Container - 4:5 Aspect Ratio & Object Cover */}
      <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Overlay Gradient on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Compare Toggle (Top Left) */}
        {onToggleCompare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`absolute top-3 left-3 p-2 rounded-full transition-all shadow-sm z-10 flex items-center justify-center ${
              isCompared 
                ? 'bg-amber-600 text-white' 
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 hover:bg-amber-600 hover:text-white translate-x-[-150%] group-hover:translate-x-0'
            }`}
            title={isCompared ? "Remove from Compare" : "Add to Compare"}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start pointer-events-none z-10">
            {/* We hide the compare button default state, so badges can go here or we adjust layout */}
            {/* If compare is present, we might need to adjust top position or rely on hover visibility of compare button */}
        </div>
        
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
             {/* Sale Badge */}
            {discountPercentage > 0 && (
                <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm">
                    -{discountPercentage}%
                </span>
            )}
             {/* Category Badge - Only if Minimal */}
             {variant === 'minimal' && (
                 <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold rounded-sm text-gray-900 dark:text-white">
                    {product.category}
                 </span>
             )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all shadow-sm z-10 ${
            isWishlisted 
              ? 'bg-white text-red-500 hover:bg-gray-50' 
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-red-500 hover:bg-white translate-x-[150%] group-hover:translate-x-0'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Action Buttons (Bottom Overlay) */}
        <div className="absolute inset-x-4 bottom-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20">
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="bg-white dark:bg-gray-800 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white text-gray-900 dark:text-white p-3 rounded-lg shadow-lg transition-colors flex items-center justify-center w-full"
                title="Add to Cart"
             >
                <ShoppingBag className="h-5 w-5" />
             </button>
        </div>
      </div>

      {/* Content - Minimalist Style */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-1">
        <div className="flex justify-between items-start">
            <h3 
                className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
            >
                {product.title}
            </h3>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className={`text-base sm:text-lg font-bold ${product.originalPrice && product.originalPrice > product.price ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
