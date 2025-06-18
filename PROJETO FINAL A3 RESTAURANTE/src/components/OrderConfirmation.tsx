
import React from 'react';
import { CheckCircle, MapPin, CreditCard, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CartItem } from '../types';

interface EnderecoForm {
  nome: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  cidade: string;
  estado: string;
}

interface OrderConfirmationProps {
  items: CartItem[];
  total: number;
  endereco: EnderecoForm;
  formaPagamento: string;
  onClose: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  items,
  total,
  endereco,
  formaPagamento,
  onClose
}) => {
  const formasPagamentoLabels: { [key: string]: string } = {
    pix: 'PIX',
    dinheiro: 'Dinheiro',
    debito: 'Cartão de Débito',
    credito: 'Cartão de Crédito'
  };

  const numeropedido = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h2>
        <p className="text-gray-600">Pedido #{numeropedido}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Dados de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Nome:</span> {endereco.nome}
          </div>
          <div>
            <span className="font-medium">Telefone:</span> {endereco.telefone}
          </div>
          <div>
            <span className="font-medium">Endereço:</span> {endereco.logradouro}, {endereco.numero}
          </div>
          <div>
            <span className="font-medium">CEP:</span> {endereco.cep}
          </div>
          <div>
            <span className="font-medium">Cidade:</span> {endereco.cidade} - {endereco.estado}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Forma de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{formasPagamentoLabels[formaPagamento]}</p>
          <p className="text-sm text-gray-500 mt-1">Pagamento será realizado na entrega</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.produto.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium">{item.produto.nome}</h4>
                  <p className="text-sm text-gray-500">Qtd: {item.quantidade}</p>
                </div>
                <div className="text-orange-600 font-semibold">
                  R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                </div>
              </div>
            ))}
            
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-xl font-bold text-orange-600">
                R$ {total.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-orange-700">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Tempo estimado: 20-30 minutos</span>
          </div>
          <p className="text-sm text-orange-600 mt-2">
            Você receberá atualizações sobre o status do seu pedido.
          </p>
        </CardContent>
      </Card>

      <Button
        onClick={onClose}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
        size="lg"
      >
        Fechar
      </Button>
    </div>
  );
};

export default OrderConfirmation;
