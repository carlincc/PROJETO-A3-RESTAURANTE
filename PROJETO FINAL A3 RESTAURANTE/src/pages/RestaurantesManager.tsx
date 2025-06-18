
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRestaurantes } from '../contexts/RestaurantesContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Restaurante } from '../types';

const RestaurantesManager: React.FC = () => {
  const { user } = useAuth();
  const { restaurantes, criarRestaurante, atualizarRestaurante, removerRestaurante, cozinhas } = useRestaurantes();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRestaurante, setEditingRestaurante] = useState<Restaurante | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    taxaFrete: 0,
    ativo: true,
    aberto: true,
    cozinhaId: '',
    descricao: '',
    telefone: '',
    tempoEntrega: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  if (!user || user.tipo === 'cliente') {
    navigate('/');
    return null;
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      taxaFrete: 0,
      ativo: true,
      aberto: true,
      cozinhaId: '',
      descricao: '',
      telefone: '',
      tempoEntrega: '',
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
    setEditingRestaurante(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.cozinhaId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const cozinha = cozinhas.find(c => c.id === parseInt(formData.cozinhaId));
    if (!cozinha) return;

    const restauranteData = {
      nome: formData.nome,
      taxaFrete: formData.taxaFrete,
      ativo: formData.ativo,
      aberto: formData.aberto,
      cozinha,
      descricao: formData.descricao,
      telefone: formData.telefone,
      tempoEntrega: formData.tempoEntrega || '30-45 min',
      avaliacoes: 4.5,
      endereco: {
        id: Date.now(),
        cep: formData.cep,
        logradouro: formData.logradouro,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: { id: 1, nome: formData.cidade },
        estado: { id: 1, nome: formData.estado }
      }
    };

    if (editingRestaurante) {
      atualizarRestaurante(editingRestaurante.id, restauranteData);
      toast({
        title: "Sucesso",
        description: "Restaurante atualizado com sucesso!"
      });
    } else {
      criarRestaurante(restauranteData);
      toast({
        title: "Sucesso",
        description: "Restaurante criado com sucesso!"
      });
    }

    resetForm();
  };

  const handleEdit = (restaurante: Restaurante) => {
    setFormData({
      nome: restaurante.nome,
      taxaFrete: restaurante.taxaFrete,
      ativo: restaurante.ativo,
      aberto: restaurante.aberto,
      cozinhaId: restaurante.cozinha.id.toString(),
      descricao: restaurante.descricao || '',
      telefone: restaurante.telefone || '',
      tempoEntrega: restaurante.tempoEntrega,
      cep: restaurante.endereco.cep,
      logradouro: restaurante.endereco.logradouro,
      numero: restaurante.endereco.numero,
      bairro: restaurante.endereco.bairro,
      cidade: restaurante.endereco.cidade.nome,
      estado: restaurante.endereco.estado.nome
    });
    setEditingRestaurante(restaurante);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover este restaurante?')) {
      removerRestaurante(id);
      toast({
        title: "Sucesso",
        description: "Restaurante removido com sucesso!"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onCartClick={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Restaurantes</h1>
            <p className="text-gray-600 mt-2">Administre os restaurantes do sistema</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Restaurante
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingRestaurante ? 'Editar Restaurante' : 'Novo Restaurante'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cozinha">Tipo de Cozinha *</Label>
                    <Select
                      value={formData.cozinhaId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, cozinhaId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma cozinha" />
                      </SelectTrigger>
                      <SelectContent>
                        {cozinhas.map((cozinha) => (
                          <SelectItem key={cozinha.id} value={cozinha.id.toString()}>
                            {cozinha.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="taxaFrete">Taxa de Frete (R$)</Label>
                    <Input
                      id="taxaFrete"
                      type="number"
                      step="0.01"
                      value={formData.taxaFrete}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxaFrete: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tempoEntrega">Tempo de Entrega</Label>
                    <Input
                      id="tempoEntrega"
                      value={formData.tempoEntrega}
                      onChange={(e) => setFormData(prev => ({ ...prev, tempoEntrega: e.target.value }))}
                      placeholder="Ex: 30-45 min"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="logradouro">Logradouro</Label>
                    <Input
                      id="logradouro"
                      value={formData.logradouro}
                      onChange={(e) => setFormData(prev => ({ ...prev, logradouro: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                    />
                    <Label htmlFor="ativo">Ativo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="aberto"
                      checked={formData.aberto}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, aberto: checked }))}
                    />
                    <Label htmlFor="aberto">Aberto</Label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    {editingRestaurante ? 'Atualizar' : 'Criar'} Restaurante
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantes.map((restaurante) => (
            <Card key={restaurante.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{restaurante.nome}</CardTitle>
                    <p className="text-sm text-gray-500">{restaurante.cozinha.nome}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{restaurante.avaliacoes}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(restaurante)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(restaurante.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Taxa de Frete:</strong> R$ {restaurante.taxaFrete.toFixed(2)}</p>
                  <p><strong>Tempo:</strong> {restaurante.tempoEntrega}</p>
                  <p><strong>Status:</strong> {restaurante.ativo ? 'Ativo' : 'Inativo'}</p>
                  <p><strong>Funcionamento:</strong> {restaurante.aberto ? 'Aberto' : 'Fechado'}</p>
                  {restaurante.telefone && (
                    <p><strong>Telefone:</strong> {restaurante.telefone}</p>
                  )}
                  <p><strong>Endereço:</strong> {restaurante.endereco.logradouro}, {restaurante.endereco.numero}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantesManager;
