
import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Star, Trash2, Check } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../services/mockData';
import { useCart } from '../contexts/CartContext';

interface ComparisonModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (productId: number) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ products, isOpen, onClose, onRemove }) => {
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  return (
    <div className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Compare Products</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{products.length} items selected</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Comparison Table */}
        <div className="overflow-x-auto flex-1 p-6 custom-scrollbar">
          {products.length === 0 ? (
             <div className="text-center py-20">
                <p className="text-gray-500">No products to compare.</p>
             </div>
          ) : (
            <div className="min-w-max">
              <div className="grid gap-8" style={{ gridTemplateColumns: `150px repeat(${products.length}, minmax(250px, 1fr))` }}>
                
                {/* Labels Column */}
                <div className="flex flex-col gap-6 pt-[280px] font-medium text-gray-500 dark:text-gray-400 text-sm">
                  <div className="h-8 flex items-center">Price</div>
                  <div className="h-8 flex items-center">Rating</div>
                  <div className="h-8 flex items-center">Category</div>
                  <div className="h-8 flex items-center">Availability</div>
                  <div className="h-24 flex items-start pt-2">Description</div>
                  <div className="h-12 flex items-center">Action</div>
                </div>

                {/* Product Columns */}
                {products.map((product) => (
                  <div key={product.id} className="flex flex-col gap-6 relative">
                    {/* Product Header Card */}
                    <div className="relative h-[280px] flex flex-col">
                        <button 
                            onClick={() => onRemove(product.id)}
                            className="absolute -top-2 -right-2 z-10 p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700 relative group">
                            <img 
                                src={product.image} 
                                alt={product.title} 
                                className="max-w-full max-h-[160px] object-contain mix-blend-multiply dark:mix-blend-normal" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors rounded-xl" />
                            <button 
                                onClick={() => onRemove(product.id)}
                                className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-900/80 text-gray-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 min-h-[3rem]">
                            {product.title}
                        </h3>
                    </div>

                    {/* Attributes */}
                    <div className="h-8 flex items-center text-lg font-bold text-amber-600 dark:text-amber-500">
                        {formatCurrency(product.price)}
                    </div>

                    <div className="h-8 flex items-center">
                        <div className="flex text-yellow-400 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating.rate) ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                            ))}
                        </div>
                        <span className="text-xs text-gray-400 ml-2">({product.rating.count})</span>
                    </div>

                    <div className="h-8 flex items-center text-sm text-gray-700 dark:text-gray-300">
                        {product.category}
                    </div>

                    <div className="h-8 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            In Stock
                        </span>
                    </div>

                    <div className="h-24 overflow-y-auto text-sm text-gray-600 dark:text-gray-400 leading-relaxed custom-scrollbar pr-2">
                        {product.description}
                    </div>

                    <div className="h-12 flex items-center">
                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addedIds.includes(product.id)}
                            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                                addedIds.includes(product.id)
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-900 dark:bg-gray-700 text-white hover:bg-amber-600 dark:hover:bg-amber-500'
                            }`}
                        >
                             {addedIds.includes(product.id) ? (
                                <>
                                    <Check className="h-4 w-4" /> Added
                                </>
                             ) : (
                                <>
                                    <ShoppingBag className="h-4 w-4" /> Add to Cart
                                </>
                             )}
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default ComparisonModal;
