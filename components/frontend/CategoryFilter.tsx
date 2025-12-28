
import React from 'react';
import { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  
  return (
    <div className="w-full mb-8">
      <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 select-none">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(isSelected ? 'All' : category.name)}
              className={`group flex flex-col items-center gap-2 min-w-[80px] sm:min-w-[100px] transition-all duration-300 focus:outline-none`}
            >
              <div 
                className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-amber-600 dark:ring-amber-500 ring-offset-2 dark:ring-offset-gray-900 scale-105 shadow-md' 
                    : 'ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-amber-300 dark:hover:ring-amber-700 hover:shadow-md'
                }`}
              >
                <div className={`absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors ${isSelected ? 'bg-transparent' : ''}`} />
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span 
                className={`text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                }`}
              >
                {category.name}
              </span>
            </button>
          );
        })}
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

export default CategoryFilter;
