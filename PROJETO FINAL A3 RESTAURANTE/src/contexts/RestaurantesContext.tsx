
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Restaurante, Cozinha } from '../types';
import { restaurantes as initialRestaurantes, cozinhas } from '../data/mockData';

interface RestaurantesContextType {
  restaurantes: Restaurante[];
  criarRestaurante: (restaurante: Omit<Restaurante, 'id' | 'dataCadastro' | 'dataAtualizacao'>) => void;
  atualizarRestaurante: (id: number, restaurante: Partial<Restaurante>) => void;
  removerRestaurante: (id: number) => void;
  obterRestaurantePorId: (id: number) => Restaurante | undefined;
  cozinhas: Cozinha[];
}

const RestaurantesContext = createContext<RestaurantesContextType | undefined>(undefined);

export const useRestaurantes = () => {
  const context = useContext(RestaurantesContext);
  if (context === undefined) {
    throw new Error('useRestaurantes must be used within a RestaurantesProvider');
  }
  return context;
};

export const RestaurantesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>(initialRestaurantes);

  useEffect(() => {
    const savedRestaurantes = localStorage.getItem('restaurantes');
    if (savedRestaurantes) {
      setRestaurantes(JSON.parse(savedRestaurantes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('restaurantes', JSON.stringify(restaurantes));
  }, [restaurantes]);

  const criarRestaurante = (novoRestaurante: Omit<Restaurante, 'id' | 'dataCadastro' | 'dataAtualizacao'>) => {
    const restaurante: Restaurante = {
      ...novoRestaurante,
      id: Date.now(),
      dataCadastro: new Date(),
      dataAtualizacao: new Date()
    };
    setRestaurantes(prev => [...prev, restaurante]);
  };

  const atualizarRestaurante = (id: number, restauranteAtualizado: Partial<Restaurante>) => {
    setRestaurantes(prev => prev.map(restaurante => 
      restaurante.id === id 
        ? { ...restaurante, ...restauranteAtualizado, dataAtualizacao: new Date() }
        : restaurante
    ));
  };

  const removerRestaurante = (id: number) => {
    setRestaurantes(prev => prev.filter(restaurante => restaurante.id !== id));
  };

  const obterRestaurantePorId = (id: number): Restaurante | undefined => {
    return restaurantes.find(restaurante => restaurante.id === id);
  };

  return (
    <RestaurantesContext.Provider value={{
      restaurantes,
      criarRestaurante,
      atualizarRestaurante,
      removerRestaurante,
      obterRestaurantePorId,
      cozinhas
    }}>
      {children}
    </RestaurantesContext.Provider>
  );
};
