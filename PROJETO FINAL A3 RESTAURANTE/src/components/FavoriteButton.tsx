
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

interface FavoriteButtonProps {
  itemId: number;
  itemType: 'produto' | 'restaurante';
  itemName: string;
  isFavorite: boolean;
  onToggleFavorite: (id: number, type: 'produto' | 'restaurante') => void;
  size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  itemType,
  itemName,
  isFavorite,
  onToggleFavorite,
  size = 'md'
}) => {
  const { toast } = useToast();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(itemId, itemType);
    
    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: `${itemName} foi ${isFavorite ? 'removido dos' : 'adicionado aos'} seus favoritos.`,
    });
  };

  const sizeClasses = {
    sm: 'h-6 w-6 p-1',
    md: 'h-8 w-8 p-1',
    lg: 'h-10 w-10 p-2'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={`${sizeClasses[size]} rounded-full hover:bg-red-50 transition-colors`}
    >
      <Heart
        size={iconSizes[size]}
        className={`transition-colors ${
          isFavorite 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-400 hover:text-red-400'
        }`}
      />
    </Button>
  );
};

export default FavoriteButton;
