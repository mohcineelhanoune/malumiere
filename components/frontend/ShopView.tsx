
import React, { useRef, useEffect, useCallback } from 'react';
import { Product, Category } from '../../types';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import { Filter, ArrowUpDown, ChevronDown, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  sortBy: string;
  loadingMore: boolean;
  hasMore: boolean;
  onSelectCategory: (category: string) => void;
  onSortChange: (sort: string) => void;
  onProductClick: (product: Product) => void;
  isCompared: (productId: number) => boolean;
  onToggleCompare: (product: Product) => void;
  onLoadMore: () => void;
}

const ShopView: React.FC<ShopViewProps> = ({
  products,
  categories,
  selectedCategory,
  sortBy,
  loadingMore,
  hasMore,
  onSelectCategory,
  onSortChange,
  onProductClick,
  isCompared,
  onToggleCompare,
  onLoadMore
}) => {
  const { t } = useLanguage();
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Last element ref for infinite scroll
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, { threshold: 0.1 }); // Reduced threshold for better triggering
    
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, onLoadMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Shop Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {selectedCategory === 'On Sale' ? t('flashDeals') : t('shopAll')}
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            {selectedCategory === 'On Sale' ? t('limitedOffer') : t('shopAllSubtitle')}
          </p>
        </div>

        {/* Sort Control */}
        <div className="flex items-center self-start md:self-end">
          <div className="relative group min-w-[180px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:border-amber-300 dark:hover:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none cursor-pointer"
            >
              <option value="featured">{t('featured')}</option>
              <option value="price-asc">{t('priceLowHigh')}</option>
              <option value="price-desc">{t('priceHighLow')}</option>
              <option value="rating">{t('topRated')}</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Carousel Filter */}
      <CategoryFilter 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={onSelectCategory} 
      />
      
      {/* Product Grid */}
      {products.length === 0 ? (
        hasMore ? (
          // If no products match current filter but there is more data, render loader to trigger fetch of next page
          <div ref={lastElementRef} className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
             <Loader2 className="h-8 w-8 animate-spin text-amber-600 mb-4" />
             <p className="text-gray-500 dark:text-gray-400">Searching products in {selectedCategory}...</p>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <Filter className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{t('noProducts')}</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">{t('tryCategory')}</p>
            <button 
              onClick={() => onSelectCategory('All')}
              className="text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 hover:underline"
            >
              {t('clearFilters')}
            </button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              ref={index === products.length - 1 ? lastElementRef : null}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
              style={{ animationDelay: `${(index % 10) * 50}ms` }}
            >
              <ProductCard 
                product={product} 
                onProductClick={onProductClick}
                isCompared={isCompared(product.id)}
                onToggleCompare={onToggleCompare}
              />
            </div>
          ))}
        </div>
      )}

      {/* Loading Indicator (Bottom) */}
      {loadingMore && products.length > 0 && (
        <div className="py-8 flex justify-center w-full">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium text-sm">Loading more products...</span>
          </div>
        </div>
      )}
      
      {!hasMore && products.length > 0 && (
        <div className="py-12 text-center text-gray-400 dark:text-gray-600">
          <span className="text-sm font-medium">You've reached the end of the list</span>
        </div>
      )}
    </div>
  );
};

export default ShopView;
