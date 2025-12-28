
import React from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PromotionalSectionProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onViewAll?: () => void;
}

const PromotionalSection: React.FC<PromotionalSectionProps> = ({ products, onProductClick, onViewAll }) => {
  const { t } = useLanguage();
  
  // Filter products that have an originalPrice (indicating they are on sale)
  const saleProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);

  if (saleProducts.length === 0) return null;

  // Display only first 4 products
  const displayProducts = saleProducts.slice(0, 4);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-red-600 dark:text-red-500 fill-current" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('flashDeals')}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('limitedOffer')}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-full border border-red-100 dark:border-red-900/20">
                <Clock className="h-4 w-4" />
                <span>{t('endsIn')}</span>
            </div>
            
            {onViewAll && (
                <button 
                    onClick={onViewAll}
                    className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                    {t('viewAll')} <ArrowRight className="h-4 w-4" />
                </button>
            )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/10 dark:to-amber-900/10 p-3 sm:p-6 rounded-2xl border border-red-100 dark:border-red-900/20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayProducts.map(product => (
                <ProductCard 
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                    variant="minimal"
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionalSection;
