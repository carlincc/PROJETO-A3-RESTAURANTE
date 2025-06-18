
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Produto } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (produto: Produto, quantidade?: number, observacao?: string) => void;
  removeFromCart: (produtoId: number) => void;
  updateQuantity: (produtoId: number, quantidade: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (produto: Produto, quantidade: number = 1, observacao?: string) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.produto.id === produto.id);
      if (existingItem) {
        return prev.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade, observacao }
            : item
        );
      }
      return [...prev, { produto, quantidade, observacao }];
    });
  };

  const removeFromCart = (produtoId: number) => {
    setItems(prev => prev.filter(item => item.produto.id !== produtoId));
  };

  const updateQuantity = (produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(produtoId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.produto.id === produtoId
          ? { ...item, quantidade }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.produto.preco * item.quantidade), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
