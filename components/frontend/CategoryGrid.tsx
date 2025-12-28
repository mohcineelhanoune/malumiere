
import React from 'react';
import { Category } from '../../types';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  selectedIds?: string[];
  onCategoryClick: (name: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, selectedIds, onCategoryClick }) => {
  // Filter and SORT categories based on the order of selectedIds
  const displayCategories = React.useMemo(() => {
    if (!selectedIds || selectedIds.length === 0) return categories;
    
    // Map selectedIds to actual category objects, preserving the order of the IDs
    return selectedIds
      .map(id => categories.find(cat => cat.id === id))
      .filter((cat): cat is Category => cat !== undefined);
  }, [categories, selectedIds]);

  if (displayCategories.length === 0) return null;

  return (
    <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Updated grid to 6 columns on large screens */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {displayCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat.name)}
            className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-800 flex flex-col"
          >
            {/* Image Container */}
            <div className="aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-center">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply dark:mix-blend-normal"
              />
            </div>
            
            {/* Label Overlay */}
            <div className="p-3 flex items-center justify-between mt-auto">
                <span className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 transition-colors uppercase tracking-tight truncate mr-2">
                    {cat.name}
                </span>
                <div className="p-1 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-amber-600 group-hover:text-white transition-all transform group-hover:translate-x-1 shrink-0">
                    <ArrowRight size={12} />
                </div>
            </div>

            {/* Bottom Glow on Hover */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
