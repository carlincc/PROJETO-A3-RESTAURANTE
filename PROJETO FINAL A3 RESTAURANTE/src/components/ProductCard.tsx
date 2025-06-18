
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Produto } from '../types';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useToast } from '../hooks/use-toast';
import StarRating from './StarRating';
import ProductModal from './ProductModal';
import FavoriteButton from './FavoriteButton';
import { avaliacoes } from '../data/mockData';

interface ProductCardProps {
  produto: Produto;
}

const ProductCard: React.FC<ProductCardProps> = ({ produto }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productReviews = avaliacoes.filter(av => av.produto && av.produto.id === produto.id);
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, av) => sum + av.nota, 0) / productReviews.length 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(produto);
    toast({
      title: "Produto adicionado!",
      description: `${produto.nome} foi adicionado ao carrinho.`,
    });
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={handleCardClick}>
        <CardContent className="p-0">
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <img
              src={produto.foto}
              alt={produto.nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
            
            <div className="absolute top-2 right-2">
              <FavoriteButton
                itemId={produto.id}
                itemType="produto"
                itemName={produto.nome}
                isFavorite={isFavorite(produto.id, 'produto')}
                onToggleFavorite={toggleFavorite}
                size="sm"
              />
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-gray-800">{produto.nome}</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {produto.categoria}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{produto.descricao}</p>
            
            <p className="text-xs text-gray-500 mb-3">{produto.restaurante.nome}</p>
            
            {productReviews.length > 0 && (
              <div className="flex items-center space-x-2 mb-3">
                <StarRating rating={averageRating} size={14} />
                <span className="text-xs text-gray-500">
                  ({productReviews.length})
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-orange-600">
                R$ {produto.preco.toFixed(2)}
              </span>
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductModal 
        produto={produto} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
