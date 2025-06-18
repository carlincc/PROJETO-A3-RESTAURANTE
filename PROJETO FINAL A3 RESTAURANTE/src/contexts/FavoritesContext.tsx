
import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favoriteProducts: number[];
  favoriteRestaurants: number[];
  toggleFavorite: (id: number, type: 'produto' | 'restaurante') => void;
  isFavorite: (id: number, type: 'produto' | 'restaurante') => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<number[]>([]);

  useEffect(() => {
    const savedFavoriteProducts = localStorage.getItem('favoriteProducts');
    const savedFavoriteRestaurants = localStorage.getItem('favoriteRestaurants');
    
    if (savedFavoriteProducts) {
      setFavoriteProducts(JSON.parse(savedFavoriteProducts));
    }
    
    if (savedFavoriteRestaurants) {
      setFavoriteRestaurants(JSON.parse(savedFavoriteRestaurants));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
  }, [favoriteProducts]);

  useEffect(() => {
    localStorage.setItem('favoriteRestaurants', JSON.stringify(favoriteRestaurants));
  }, [favoriteRestaurants]);

  const toggleFavorite = (id: number, type: 'produto' | 'restaurante') => {
    if (type === 'produto') {
      setFavoriteProducts(prev => 
        prev.includes(id) 
          ? prev.filter(productId => productId !== id)
          : [...prev, id]
      );
    } else {
      setFavoriteRestaurants(prev => 
        prev.includes(id) 
          ? prev.filter(restaurantId => restaurantId !== id)
          : [...prev, id]
      );
    }
  };

  const isFavorite = (id: number, type: 'produto' | 'restaurante'): boolean => {
    return type === 'produto' 
      ? favoriteProducts.includes(id)
      : favoriteRestaurants.includes(id);
  };

  return (
    <FavoritesContext.Provider value={{
      favoriteProducts,
      favoriteRestaurants,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
