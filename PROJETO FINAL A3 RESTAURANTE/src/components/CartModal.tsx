import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, MapPin, CreditCard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { usePedidos } from '../contexts/PedidosContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useToast } from '../hooks/use-toast';
import OrderConfirmation from './OrderConfirmation';
import { ItemPedido, CategoriaPedido } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EnderecoForm {
  nome: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  cidade: string;
  estado: string;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { criarPedido } = usePedidos();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [pedidoCriado, setPedidoCriado] = useState<any>(null);
  const [endereco, setEndereco] = useState<EnderecoForm>({
    nome: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    cidade: '',
    estado: ''
  });
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    setEndereco(prev => ({ ...prev, cep: cleanCep }));

    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setEndereco(prev => ({
            ...prev,
            logradouro: data.logradouro,
            cidade: data.localidade,
            estado: data.uf
          }));
          toast({
            title: "CEP encontrado!",
            description: "Endereço preenchido automaticamente.",
          });
        } else {
          toast({
            title: "CEP não encontrado",
            description: "Verifique o CEP informado.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Erro ao buscar CEP",
          description: "Tente novamente ou preencha manualmente.",
          variant: "destructive"
        });
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleFinalizarPedido = () => {
    if (!endereco.nome || !endereco.telefone || !endereco.cep || !endereco.numero || !endereco.logradouro || !endereco.cidade || !endereco.estado) {
      toast({
        title: "Preencha todos os campos",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Converter items do carrinho para ItemPedido
      const itens: ItemPedido[] = items.map(item => ({
        id: Date.now() + Math.random(),
        quantidade: item.quantidade,
        precoUnitario: item.produto.preco,
        precoTotal: item.produto.preco * item.quantidade,
        observacao: item.observacao,
        produto: item.produto
      }));

      // Criar endereço no formato correto
      const enderecoCompleto = {
        id: Date.now(),
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        bairro: 'Centro', // Simplificado
        cidade: { id: 1, nome: endereco.cidade },
        estado: { id: 1, nome: endereco.estado }
      };

      const pedido = criarPedido(itens, enderecoCompleto, formaPagamento, CategoriaPedido.DELIVERY);
      setPedidoCriado(pedido);
      setShowConfirmation(true);
      
      toast({
        title: "Pedido criado com sucesso!",
        description: `Pedido #${pedido.codigo} foi confirmado.`
      });
    } catch (error) {
      toast({
        title: "Erro ao criar pedido",
        description: "Tente novamente ou faça login.",
        variant: "destructive"
      });
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho para continuar.",
        variant: "destructive"
      });
      return;
    }

    setShowCheckout(true);
  };

  const handleCloseConfirmation = () => {
    clearCart();
    setShowCheckout(false);
    setShowConfirmation(false);
    setFormaPagamento('pix');
    setPedidoCriado(null);
    setEndereco({
      nome: '',
      telefone: '',
      cep: '',
      logradouro: '',
      numero: '',
      cidade: '',
      estado: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[90vh] flex flex-col">
        <CardHeader className="relative flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-center">
            {showConfirmation ? 'Pedido Confirmado' : showCheckout ? 'Finalizar Pedido' : 'Carrinho'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto">
          {showConfirmation && pedidoCriado ? (
            <OrderConfirmation
              items={items}
              total={total}
              endereco={endereco}
              formaPagamento={formaPagamento}
              onClose={handleCloseConfirmation}
            />
          ) : showCheckout ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={endereco.nome}
                    onChange={(e) => setEndereco(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={endereco.telefone}
                    onChange={(e) => setEndereco(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <div className="relative">
                    <Input
                      id="cep"
                      value={endereco.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="00000-000"
                      maxLength={8}
                    />
                    {loadingCep && (
                      <MapPin className="absolute right-3 top-3 h-4 w-4 animate-spin text-orange-500" />
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="logradouro">Rua</Label>
                  <Input
                    id="logradouro"
                    value={endereco.logradouro}
                    onChange={(e) => setEndereco(prev => ({ ...prev, logradouro: e.target.value }))}
                    placeholder="Nome da rua"
                  />
                </div>

                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={endereco.numero}
                    onChange={(e) => setEndereco(prev => ({ ...prev, numero: e.target.value }))}
                    placeholder="Número da casa/apartamento"
                  />
                </div>

                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={endereco.cidade}
                    onChange={(e) => setEndereco(prev => ({ ...prev, cidade: e.target.value }))}
                    placeholder="Cidade"
                  />
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={endereco.estado}
                    onChange={(e) => setEndereco(prev => ({ ...prev, estado: e.target.value }))}
                    placeholder="Estado"
                  />
                </div>

                <div className="border-t pt-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Forma de Pagamento
                  </Label>
                  <RadioGroup 
                    value={formaPagamento} 
                    onValueChange={setFormaPagamento}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="cursor-pointer">PIX</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dinheiro" id="dinheiro" />
                      <Label htmlFor="dinheiro" className="cursor-pointer">Dinheiro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="debito" id="debito" />
                      <Label htmlFor="debito" className="cursor-pointer">Cartão de Débito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credito" id="credito" />
                      <Label htmlFor="credito" className="cursor-pointer">Cartão de Crédito</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-gray-500 mt-2">
                    Pagamento será realizado na entrega
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.produto.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <img
                        src={item.produto.foto}
                        alt={item.produto.nome}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.produto.nome}</h4>
                        <p className="text-orange-600 font-semibold">
                          R$ {item.produto.preco.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center text-sm">{item.quantidade}</span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.produto.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-xl font-bold text-orange-600">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                    
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      Finalizar Pedido
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>

        {showCheckout && !showConfirmation && (
          <div className="flex-shrink-0 border-t p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-orange-600">
                R$ {total.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={handleFinalizarPedido}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
                size="lg"
              >
                Confirmar Pedido - R$ {total.toFixed(2)}
              </Button>
              <Button
                onClick={() => setShowCheckout(false)}
                variant="outline"
                className="w-full"
              >
                Voltar ao Carrinho
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CartModal;
