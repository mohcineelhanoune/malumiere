
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';

interface WishlistViewProps {
  onQuickView: (product: Product) => void;
  onNavigateHome: () => void;
  onProductClick: (product: Product) => void;
}

const WishlistView: React.FC<WishlistViewProps> = ({ onQuickView, onNavigateHome, onProductClick }) => {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-6">
          <Heart className="h-12 w-12 text-red-400 dark:text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          Start saving your favorite items by clicking the heart icon on any product you love.
        </p>
        <button
          onClick={onNavigateHome}
          className="bg-amber-600 dark:bg-amber-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200 dark:shadow-none"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{wishlistItems.length} items saved for later</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {wishlistItems.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={onQuickView}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistView;
