
import React from 'react';
import { Button } from './ui/button';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const categoryIcons: { [key: string]: string } = {
    'Todos': '🍽️',
    'Pizza': '🍕',
    'Hambúrguer': '🍔',
    'Bebidas': '🥤'
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-orange-600 mb-4">Categorias</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className={`${
              selectedCategory === category
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'border-orange-300 text-orange-600 hover:bg-orange-50'
            }`}
          >
            <span className="mr-2">{categoryIcons[category] || '🍽️'}</span>
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
