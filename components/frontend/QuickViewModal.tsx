
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Star, Check, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { formatCurrency } from '../../services/mockData';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [isAdded, setIsAdded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const isWishlisted = isInWishlist(product.id);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all z-10 shadow-sm"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="aspect-square md:aspect-auto bg-gray-50 dark:bg-gray-100 relative flex items-center justify-center p-8">
               <img 
                 src={product.image} 
                 alt={product.title} 
                 className="max-w-full max-h-[400px] object-contain drop-shadow-lg mix-blend-multiply"
               />
               <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-md shadow-sm text-amber-600 dark:text-amber-400">
                  {product.category}
               </span>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-10 flex flex-col h-full bg-white dark:bg-gray-800">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {product.title}
                </h2>
                
                {/* Rating removed */}

                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    {formatCurrency(product.price)}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      In Stock
                    </span>
                </div>

                <div className="prose prose-sm text-gray-600 dark:text-gray-300 mb-8 flex-1">
                    <p className="leading-relaxed">{product.description}</p>
                    <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
                      Product ID: {product.id} • Free shipping on orders over $50
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-200 transform active:scale-[0.98] ${
                            isAdded 
                            ? 'bg-green-600 text-white ring-4 ring-green-100 dark:ring-green-900' 
                            : 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-50 dark:hover:bg-amber-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1'
                        }`}
                    >
                        {isAdded ? (
                            <>
                                <Check className="h-6 w-6 animate-bounce" />
                                Added
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="h-6 w-6" />
                                Add to Cart
                            </>
                        )}
                    </button>
                    
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center ${
                            isWishlisted
                            ? 'border-red-100 bg-red-50 text-red-500 dark:border-red-900 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 dark:hover:border-red-800 dark:hover:bg-red-900/20'
                        }`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
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
export default QuickViewModal;
