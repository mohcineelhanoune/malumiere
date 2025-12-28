
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { X, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../services/mockData';

interface FloatingNotificationProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const FloatingNotification: React.FC<FloatingNotificationProps> = ({ products, onProductClick }) => {
  const [visible, setVisible] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Show notification after 5 seconds
    const timer = setTimeout(() => {
      // Pick a random product
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      setProduct(randomProduct);
      setVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [products]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
  };

  const handleClick = () => {
    if (product) {
        onProductClick(product);
        setVisible(false);
    }
  };

  if (!visible || !product) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div 
        onClick={handleClick}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-700 p-4 max-w-sm cursor-pointer hover:scale-105 transition-transform relative group"
      >
        <button 
            onClick={handleClose}
            className="absolute -top-2 -right-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        >
            <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
            <div className="h-16 w-16 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                <img src={product.image} alt={product.title} className="h-full w-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-500 mb-1 uppercase tracking-wide">
                    <TrendingUp className="h-3 w-3" />
                    Trending Now
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 mb-1">
                    {product.title}
                </h4>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                           -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingNotification;
