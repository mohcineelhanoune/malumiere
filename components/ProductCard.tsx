
import React from 'react';
import { Plus, Star, Eye, Heart, ArrowLeftRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../services/mockData';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  isCompared?: boolean;
  onToggleCompare?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onQuickView, 
  onProductClick,
  isCompared = false,
  onToggleCompare
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
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:z-10 ${
        isCompared ? 'border-amber-500 ring-1 ring-amber-500 dark:border-amber-500' : 'border-gray-100 dark:border-gray-700'
      }`}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-white relative p-4 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Compare Toggle (Top Left) */}
        {onToggleCompare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`absolute top-3 left-3 p-2 rounded-lg transition-all shadow-sm z-10 flex items-center gap-1.5 ${
              isCompared 
                ? 'bg-amber-600 text-white' 
                : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-500 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-600'
            }`}
            title={isCompared ? "Remove from Compare" : "Add to Compare"}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        )}

        <div className="absolute bottom-3 left-3 flex flex-col gap-2 items-start pointer-events-none z-10">
            {/* Category Badge - Moved to bottom left */}
            <span className="bg-gray-100/90 dark:bg-gray-700/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold rounded-md text-gray-600 dark:text-gray-300">
                {product.category}
            </span>
            
            {/* Sale Badge */}
            {discountPercentage > 0 && (
                <span className="bg-red-600/90 backdrop-blur-sm px-2 py-1 text-xs font-bold rounded-md text-white shadow-sm">
                    -{discountPercentage}%
                </span>
            )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-sm z-10 ${
            isWishlisted 
              ? 'bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50' 
              : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Action Overlay (Visible on hover) */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white/95 via-white/80 to-transparent dark:from-gray-800/95 dark:via-gray-800/80 pt-12 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-3 items-center justify-center opacity-0 group-hover:opacity-100 z-20">
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-xl shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                title="Add to Cart"
             >
                <ShoppingBag className="h-5 w-5" />
             </button>
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(product);
                }}
                className="bg-white dark:bg-gray-700 text-gray-700 dark:text-white p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-transform hover:scale-110 shadow-md border border-gray-100 dark:border-gray-600"
                title="Quick View"
             >
                <Eye className="h-5 w-5" />
             </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col bg-white dark:bg-gray-800">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
          >
            {product.title}
          </h3>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.round(product.rating.rate) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({product.rating.count})</span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                </span>
            )}
            <span className={`text-xl font-bold ${product.originalPrice && product.originalPrice > product.price ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                {formatCurrency(product.price)}
            </span>
          </div>
          
          {/* Mobile-friendly Add Button (Desktop uses overlay) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="lg:hidden p-2 bg-gray-900 dark:bg-gray-700 hover:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg transition-colors shadow-sm hover:shadow-md active:scale-95"
            title="Add to Cart"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
