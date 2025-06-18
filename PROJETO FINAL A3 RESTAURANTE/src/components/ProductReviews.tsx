
import React, { useState } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Produto, Avaliacao } from '../types';
import { useAuth } from '../contexts/AuthContext';
import StarRating from './StarRating';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { avaliacoes } from '../data/mockData';

interface ProductReviewsProps {
  produto: Produto;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ produto }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const productReviews = avaliacoes.filter(av => av.produto && av.produto.id === produto.id);
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, av) => sum + av.nota, 0) / productReviews.length 
    : 0;

  const handleSubmitReview = () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para avaliar produtos.",
        variant: "destructive"
      });
      return;
    }

    if (newComment.trim().length < 10) {
      toast({
        title: "Comentário muito curto",
        description: "Por favor, escreva um comentário com pelo menos 10 caracteres.",
        variant: "destructive"
      });
      return;
    }

    // Aqui seria feita a integração com backend
    const newReview: Avaliacao = {
      id: avaliacoes.length + 1,
      nota: newRating,
      comentario: newComment,
      dataCriacao: new Date(),
      usuario: user,
      produto: produto
    };

    avaliacoes.push(newReview);

    toast({
      title: "Avaliação enviada!",
      description: "Obrigado por sua avaliação!"
    });

    setIsReviewModalOpen(false);
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold">Avaliações</h3>
          {productReviews.length > 0 && (
            <div className="flex items-center space-x-2">
              <StarRating rating={averageRating} size={20} />
              <span className="text-sm text-gray-600">
                ({productReviews.length} avaliação{productReviews.length !== 1 ? 'ões' : ''})
              </span>
            </div>
          )}
        </div>

        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Avaliar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Avaliar {produto.nome}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sua nota:</label>
                <StarRating 
                  rating={newRating} 
                  size={24} 
                  interactive 
                  onRatingChange={setNewRating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comentário:</label>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Conte-nos sobre sua experiência com este produto..."
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitReview} className="w-full">
                Enviar Avaliação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {productReviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Ainda não há avaliações para este produto.</p>
            <p className="text-sm text-gray-400">Seja o primeiro a avaliar!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {productReviews.slice(0, 3).map((avaliacao) => (
            <Card key={avaliacao.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{avaliacao.usuario.nome}</span>
                    <StarRating rating={avaliacao.nota} size={16} />
                  </div>
                  <span className="text-sm text-gray-500">
                    {avaliacao.dataCriacao.toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700">{avaliacao.comentario}</p>
              </CardContent>
            </Card>
          ))}
          
          {productReviews.length > 3 && (
            <Button variant="outline" className="w-full">
              Ver todas as {productReviews.length} avaliações
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
