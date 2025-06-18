
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePedidos } from '../contexts/PedidosContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, ShoppingBag, Heart, MapPin, Clock } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { produtos, restaurantes } from '../data/mockData';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { pedidos } = usePedidos();
  const { favoriteProducts, favoriteRestaurants } = useFavorites();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const meusPedidos = pedidos.filter(pedido => pedido.usuario.id === user.id);
  const meusProdutosFavoritos = produtos.filter(produto => favoriteProducts.includes(produto.id));
  const meusRestaurantesFavoritos = restaurantes.filter(restaurante => favoriteRestaurants.includes(restaurante.id));

  const totalGasto = meusPedidos.reduce((total, pedido) => total + pedido.valorTotal, 0);
  const pedidosRealizados = meusPedidos.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onCartClick={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header do perfil */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <User className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.nome}</h1>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Membro desde {user.dataCadastro.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <ShoppingBag className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{pedidosRealizados}</p>
                  <p className="text-sm text-gray-600">Pedidos realizados</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <span className="text-2xl font-bold text-green-600">R$ {totalGasto.toFixed(2)}</span>
                  <p className="text-sm text-gray-600">Total gasto</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {favoriteProducts.length + favoriteRestaurants.length}
                  </p>
                  <p className="text-sm text-gray-600">Favoritos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de conteúdo */}
        <Tabs defaultValue="pedidos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pedidos">Meus Pedidos</TabsTrigger>
            <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          {/* Aba de Pedidos */}
          <TabsContent value="pedidos">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                {meusPedidos.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Você ainda não fez nenhum pedido</p>
                    <Button 
                      onClick={() => navigate('/')}
                      className="mt-4 bg-orange-500 hover:bg-orange-600"
                    >
                      Fazer primeiro pedido
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {meusPedidos.slice(0, 5).map((pedido) => (
                      <div key={pedido.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">Pedido #{pedido.codigo}</h4>
                            <p className="text-sm text-gray-600">{pedido.restaurante.nome}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{pedido.status}</Badge>
                            <p className="text-sm text-gray-500 mt-1">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {pedido.dataCriacao.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            {pedido.itens.length} item{pedido.itens.length !== 1 ? 'ns' : ''}
                          </p>
                          <p className="font-bold text-orange-600">
                            R$ {pedido.valorTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {meusPedidos.length > 5 && (
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/pedidos')}
                        className="w-full"
                      >
                        Ver todos os pedidos
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Favoritos */}
          <TabsContent value="favoritos">
            <div className="space-y-6">
              {/* Produtos Favoritos */}
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Favoritos</CardTitle>
                </CardHeader>
                <CardContent>
                  {meusProdutosFavoritos.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum produto favoritado ainda
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {meusProdutosFavoritos.map((produto) => (
                        <div key={produto.id} className="border rounded-lg p-4">
                          <img
                            src={produto.foto}
                            alt={produto.nome}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <h4 className="font-medium">{produto.nome}</h4>
                          <p className="text-sm text-gray-600">{produto.restaurante.nome}</p>
                          <p className="font-bold text-orange-600">
                            R$ {produto.preco.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Restaurantes Favoritos */}
              <Card>
                <CardHeader>
                  <CardTitle>Restaurantes Favoritos</CardTitle>
                </CardHeader>
                <CardContent>
                  {meusRestaurantesFavoritos.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum restaurante favoritado ainda
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {meusRestaurantesFavoritos.map((restaurante) => (
                        <div key={restaurante.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{restaurante.nome}</h4>
                              <p className="text-sm text-gray-600">{restaurante.cozinha.nome}</p>
                              <p className="text-sm text-gray-500">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {restaurante.endereco.bairro}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">★ {restaurante.avaliacoes}</p>
                              <p className="text-sm text-gray-500">{restaurante.tempoEntrega}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Configurações */}
          <TabsContent value="configuracoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Informações Pessoais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome</label>
                        <p className="text-gray-700">{user.nome}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <p className="text-gray-700">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Ações da Conta</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        Alterar Senha
                      </Button>
                      <Button variant="outline" size="sm">
                        Gerenciar Endereços
                      </Button>
                      <Button variant="outline" size="sm">
                        Configurações de Notificação
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
