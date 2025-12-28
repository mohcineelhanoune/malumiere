
import React, { useRef } from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface CategoryShowcaseProps {
  title: string;
  subtitle?: string;
  category: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  isCompared: (productId: number) => boolean;
  onToggleCompare: (product: Product) => void;
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ 
  title, 
  subtitle, 
  category, 
  products, 
  onProductClick,
  isCompared,
  onToggleCompare
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter products by category
  const categoryProducts = products.filter(p => p.category === category);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (categoryProducts.length === 0) return null;

  return (
    <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-end justify-between mb-6 px-1">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
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
          {categoryProducts.map((product) => (
            <div 
              key={product.id} 
              className="min-w-[280px] sm:min-w-[300px] md:min-w-[calc(25%-18px)] snap-start"
            >
              <ProductCard 
                product={product} 
                onProductClick={onProductClick}
                isCompared={isCompared(product.id)}
                onToggleCompare={onToggleCompare}
              />
            </div>
          ))}
          
          {/* View All Link Card */}
          <div className="min-w-[140px] sm:min-w-[200px] flex items-center justify-center snap-start">
             <button className="group/btn flex flex-col items-center gap-4 text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                <div className="h-16 w-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center group-hover/btn:border-amber-600 dark:group-hover/btn:border-amber-500 group-hover/btn:scale-110 transition-all">
                    <ArrowRight className="h-6 w-6" />
                </div>
                <span className="font-medium">View All {category}</span>
             </button>
          </div>
        </div>
        
        {/* Fade gradients for scrolling indication */}
        <div className="absolute top-0 bottom-6 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent pointer-events-none sm:hidden" />
        <div className="absolute top-0 bottom-6 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-950 dark:to-transparent pointer-events-none sm:hidden" />
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

export default CategoryShowcase;
