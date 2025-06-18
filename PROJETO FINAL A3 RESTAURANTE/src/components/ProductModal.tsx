
import React from 'react';
import { X, Plus } from 'lucide-react';
import { Produto } from '../types';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import ProductReviews from './ProductReviews';

interface ProductModalProps {
  produto: Produto | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ produto, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!produto) return null;

  const handleAddToCart = () => {
    addToCart(produto);
    toast({
      title: "Produto adicionado!",
      description: `${produto.nome} foi adicionado ao carrinho.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{produto.nome}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={produto.foto}
              alt={produto.nome}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">{produto.nome}</h3>
            <p className="text-gray-600 mb-4">{produto.descricao}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-orange-600">
                R$ {produto.preco.toFixed(2)}
              </span>
              <Button
                onClick={handleAddToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
          
          <ProductReviews produto={produto} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
