
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pedido, StatusPedido, CategoriaPedido, ItemPedido, Endereco, FormaPagamento } from '../types';
import { useAuth } from './AuthContext';
import { restaurantes, formasPagamento } from '../data/mockData';

interface PedidosContextType {
  pedidos: Pedido[];
  criarPedido: (itens: ItemPedido[], endereco: Endereco, formaPagamento: string, categoria: CategoriaPedido) => Pedido;
  atualizarStatusPedido: (pedidoId: number, status: StatusPedido) => void;
  cancelarPedido: (pedidoId: number) => void;
  obterPedidoPorId: (id: number) => Pedido | undefined;
  obterPedidosUsuario: (usuarioId: number) => Pedido[];
  obterPedidosPorCategoria: (categoria: CategoriaPedido) => Pedido[];
}

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

export const usePedidos = () => {
  const context = useContext(PedidosContext);
  if (context === undefined) {
    throw new Error('usePedidos must be used within a PedidosProvider');
  }
  return context;
};

export const PedidosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const savedPedidos = localStorage.getItem('pedidos');
    if (savedPedidos) {
      setPedidos(JSON.parse(savedPedidos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  const criarPedido = (itens: ItemPedido[], endereco: Endereco, formaPagamentoTipo: string, categoria: CategoriaPedido = CategoriaPedido.DELIVERY): Pedido => {
    if (!user) throw new Error('Usuário não autenticado');

    const valorTotal = itens.reduce((sum, item) => sum + item.precoTotal, 0);
    const taxaFrete = categoria === CategoriaPedido.DELIVERY ? restaurantes[0].taxaFrete : 0;
    const formaPagamento = formasPagamento.find(fp => fp.descricao.toLowerCase().includes(formaPagamentoTipo)) || formasPagamento[0];

    const novoPedido: Pedido = {
      id: Date.now(),
      codigo: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      desconto: 0,
      taxaFrete,
      valorTotal: valorTotal + taxaFrete,
      dataCriacao: new Date(),
      status: StatusPedido.CRIADO,
      categoria,
      usuario: user,
      restaurante: restaurantes[0],
      formaPagamento,
      endereco,
      itens
    };

    setPedidos(prev => [...prev, novoPedido]);
    return novoPedido;
  };

  const atualizarStatusPedido = (pedidoId: number, status: StatusPedido) => {
    setPedidos(prev => prev.map(pedido => {
      if (pedido.id === pedidoId) {
        const pedidoAtualizado = { ...pedido, status };
        
        if (status === StatusPedido.CONFIRMADO) {
          pedidoAtualizado.dataConfirmacao = new Date();
        } else if (status === StatusPedido.ENTREGUE) {
          pedidoAtualizado.dataEntrega = new Date();
        } else if (status === StatusPedido.CANCELADO) {
          pedidoAtualizado.dataCancelamento = new Date();
        }
        
        return pedidoAtualizado;
      }
      return pedido;
    }));
  };

  const cancelarPedido = (pedidoId: number) => {
    atualizarStatusPedido(pedidoId, StatusPedido.CANCELADO);
  };

  const obterPedidoPorId = (id: number): Pedido | undefined => {
    return pedidos.find(pedido => pedido.id === id);
  };

  const obterPedidosUsuario = (usuarioId: number): Pedido[] => {
    return pedidos.filter(pedido => pedido.usuario.id === usuarioId);
  };

  const obterPedidosPorCategoria = (categoria: CategoriaPedido): Pedido[] => {
    return pedidos.filter(pedido => pedido.categoria === categoria);
  };

  return (
    <PedidosContext.Provider value={{
      pedidos,
      criarPedido,
      atualizarStatusPedido,
      cancelarPedido,
      obterPedidoPorId,
      obterPedidosUsuario,
      obterPedidosPorCategoria
    }}>
      {children}
    </PedidosContext.Provider>
  );
};
