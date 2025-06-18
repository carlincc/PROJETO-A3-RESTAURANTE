
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePedidos } from '../contexts/PedidosContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { StatusPedido } from '../types';
import { Clock, CheckCircle, Truck, XCircle, Package } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const PedidosManager: React.FC = () => {
  const { user } = useAuth();
  const { pedidos, atualizarStatusPedido, cancelarPedido } = usePedidos();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const meusPedidos = user.tipo === 'cliente' 
    ? pedidos.filter(pedido => pedido.usuario.id === user.id)
    : pedidos;

  const getStatusIcon = (status: StatusPedido) => {
    switch (status) {
      case StatusPedido.CRIADO:
        return <Clock className="h-4 w-4" />;
      case StatusPedido.CONFIRMADO:
        return <CheckCircle className="h-4 w-4" />;
      case StatusPedido.EM_PREPARO:
        return <Package className="h-4 w-4" />;
      case StatusPedido.SAIU_PARA_ENTREGA:
        return <Truck className="h-4 w-4" />;
      case StatusPedido.ENTREGUE:
        return <CheckCircle className="h-4 w-4" />;
      case StatusPedido.CANCELADO:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: StatusPedido) => {
    switch (status) {
      case StatusPedido.CRIADO:
        return 'bg-yellow-100 text-yellow-800';
      case StatusPedido.CONFIRMADO:
        return 'bg-blue-100 text-blue-800';
      case StatusPedido.EM_PREPARO:
        return 'bg-orange-100 text-orange-800';
      case StatusPedido.SAIU_PARA_ENTREGA:
        return 'bg-purple-100 text-purple-800';
      case StatusPedido.ENTREGUE:
        return 'bg-green-100 text-green-800';
      case StatusPedido.CANCELADO:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const proximoStatus = (statusAtual: StatusPedido): StatusPedido | null => {
    switch (statusAtual) {
      case StatusPedido.CRIADO:
        return StatusPedido.CONFIRMADO;
      case StatusPedido.CONFIRMADO:
        return StatusPedido.EM_PREPARO;
      case StatusPedido.EM_PREPARO:
        return StatusPedido.SAIU_PARA_ENTREGA;
      case StatusPedido.SAIU_PARA_ENTREGA:
        return StatusPedido.ENTREGUE;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onCartClick={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.tipo === 'cliente' ? 'Meus Pedidos' : 'Gerenciar Pedidos'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user.tipo === 'cliente' 
              ? 'Acompanhe o status dos seus pedidos'
              : 'Gerencie todos os pedidos do sistema'
            }
          </p>
        </div>

        <div className="space-y-6">
          {meusPedidos.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Nenhum pedido encontrado</p>
              </CardContent>
            </Card>
          ) : (
            meusPedidos.map((pedido) => (
              <Card key={pedido.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Pedido #{pedido.codigo}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {pedido.dataCriacao.toLocaleDateString()} às {pedido.dataCriacao.toLocaleTimeString()}
                      </p>
                      {user.tipo !== 'cliente' && (
                        <p className="text-sm text-gray-600">Cliente: {pedido.usuario.nome}</p>
                      )}
                    </div>
                    <Badge className={`${getStatusColor(pedido.status)} flex items-center gap-1`}>
                      {getStatusIcon(pedido.status)}
                      {pedido.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Itens do Pedido:</h4>
                      <div className="space-y-2">
                        {pedido.itens.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span>{item.quantidade}x {item.produto.nome}</span>
                            <span className="font-medium">R$ {item.precoTotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="text-lg font-bold text-orange-600">
                          R$ {pedido.valorTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Endereço de Entrega:</h4>
                      <p className="text-sm text-gray-600">
                        {pedido.endereco.logradouro}, {pedido.endereco.numero}
                        <br />
                        {pedido.endereco.cidade.nome} - {pedido.endereco.estado.nome}
                        <br />
                        CEP: {pedido.endereco.cep}
                      </p>
                    </div>

                    {(user.tipo === 'gerente' || user.tipo === 'admin') && (
                      <div className="flex gap-2 pt-4 border-t">
                        {proximoStatus(pedido.status) && (
                          <Button
                            onClick={() => atualizarStatusPedido(pedido.id, proximoStatus(pedido.status)!)}
                            className="bg-orange-500 hover:bg-orange-600"
                            size="sm"
                          >
                            Avançar Status
                          </Button>
                        )}
                        
                        {pedido.status !== StatusPedido.CANCELADO && pedido.status !== StatusPedido.ENTREGUE && (
                          <Button
                            onClick={() => cancelarPedido(pedido.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Cancelar Pedido
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PedidosManager;
