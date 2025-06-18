
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { produtos } from '../data/mockData';
import { Produto } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import Header from '../components/Header';
import { Navigate } from 'react-router-dom';

interface ProductForm {
  nome: string;
  descricao: string;
  preco: string;
  categoria: string;
  foto: string;
}

const ProductManager = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    foto: ''
  });

  // Verificar se o usuário é gerente
  if (!isAuthenticated || user?.tipo !== 'gerente') {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      categoria: '',
      foto: ''
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduct(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      categoria: produto.categoria,
      foto: produto.foto
    });
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.descricao || !formData.preco || !formData.categoria) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (editingProduct) {
      // Editar produto existente
      const index = produtos.findIndex(p => p.id === editingProduct.id);
      if (index !== -1) {
        produtos[index] = {
          ...produtos[index],
          nome: formData.nome,
          descricao: formData.descricao,
          preco: parseFloat(formData.preco),
          categoria: formData.categoria,
          foto: formData.foto || produtos[index].foto
        };
        toast({
          title: "Produto atualizado!",
          description: "O produto foi atualizado com sucesso.",
        });
      }
    } else {
      // Adicionar novo produto
      const newProduct: Produto = {
        id: Math.max(...produtos.map(p => p.id)) + 1,
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        categoria: formData.categoria,
        foto: formData.foto || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
        ativo: true,
        restaurante: produtos[0].restaurante // Usar o mesmo restaurante dos outros produtos
      };
      produtos.push(newProduct);
      toast({
        title: "Produto adicionado!",
        description: "O novo produto foi adicionado com sucesso.",
      });
    }

    resetForm();
  };

  const handleDelete = (produto: Produto) => {
    const index = produtos.findIndex(p => p.id === produto.id);
    if (index !== -1) {
      produtos.splice(index, 1);
      toast({
        title: "Produto removido!",
        description: "O produto foi removido com sucesso.",
      });
    }
  };

  const categories = Array.from(new Set(produtos.map(p => p.categoria)));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => setIsLoginModalOpen(true)}
        onCartClick={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Produtos</h1>
          <p className="text-gray-600">Adicione, edite ou remova produtos do cardápio</p>
        </div>

        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Nome do produto"
                  />
                </div>
                
                <div>
                  <Label htmlFor="preco">Preço *</Label>
                  <Input
                    id="preco"
                    name="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Input
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    placeholder="Ex: Pizza, Hambúrguer, Bebida"
                  />
                </div>
                
                <div>
                  <Label htmlFor="foto">URL da Foto</Label>
                  <Input
                    id="foto"
                    name="foto"
                    value={formData.foto}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Input
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descrição do produto"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={resetForm} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <Card key={produto.id} className="group">
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={produto.foto}
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{produto.nome}</h3>
                  <p className="text-sm text-gray-600 mb-2">{produto.descricao}</p>
                  <p className="text-sm text-gray-500 mb-3">Categoria: {produto.categoria}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-600">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(produto)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(produto)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductManager;
