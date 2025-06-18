
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  selectedRestaurant: string;
  onRestaurantChange: (restaurant: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  categories: string[];
  restaurants: string[];
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedRestaurant,
  onRestaurantChange,
  sortBy,
  onSortChange,
  onClearFilters,
  categories,
  restaurants
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedRestaurant !== 'todos' || 
                          priceRange.min > 0 || 
                          priceRange.max < 100;

  return (
    <div className="mb-6 space-y-4">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar produtos ou restaurantes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Botões de ação */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1">
              {selectedCategories.length + (selectedRestaurant !== 'todos' ? 1 : 0)}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nome">Nome A-Z</SelectItem>
            <SelectItem value="preco-asc">Menor preço</SelectItem>
            <SelectItem value="preco-desc">Maior preço</SelectItem>
            <SelectItem value="avaliacao">Melhor avaliação</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Painel de filtros */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categorias */}
              <div>
                <h4 className="font-medium mb-3">Categorias</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label htmlFor={category} className="text-sm cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restaurantes */}
              <div>
                <h4 className="font-medium mb-3">Restaurante</h4>
                <Select value={selectedRestaurant} onValueChange={onRestaurantChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os restaurantes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os restaurantes</SelectItem>
                    {restaurants.map((restaurant) => (
                      <SelectItem key={restaurant} value={restaurant}>
                        {restaurant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Faixa de preço */}
              <div>
                <h4 className="font-medium mb-3">Faixa de Preço</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min || ''}
                      onChange={(e) => onPriceRangeChange({
                        ...priceRange,
                        min: Number(e.target.value) || 0
                      })}
                      className="w-20"
                    />
                    <span>até</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max === 100 ? '' : priceRange.max}
                      onChange={(e) => onPriceRangeChange({
                        ...priceRange,
                        max: Number(e.target.value) || 100
                      })}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchAndFilters;
