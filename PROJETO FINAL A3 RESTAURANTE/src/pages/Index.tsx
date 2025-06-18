
import React, { useState, useMemo } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import RestaurantHeader from '../components/RestaurantHeader';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import LoginModal from '../components/LoginModal';
import CartModal from '../components/CartModal';
import SearchAndFilters from '../components/SearchAndFilters';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { restaurantes, produtos } from '../data/mockData';

const CartSidebar = () => {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const { toast } = useToast();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsCartModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Carrinho</h3>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
            <p className="text-sm text-gray-400">
              Adicione produtos para ver o resumo do pedido aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.produto.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <img
                  src={item.produto.foto}
                  alt={item.produto.nome}
                  className="w-12 h-12 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.produto.nome}</h4>
                  <p className="text-orange-600 font-semibold text-sm">
                    R$ {item.produto.preco.toFixed(2)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="w-6 text-center text-xs">{item.quantidade}</span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(item.produto.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-orange-600">
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
      </div>
      
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </>
  );
};

const Index = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Estados para busca e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [selectedRestaurant, setSelectedRestaurant] = useState('todos');
  const [sortBy, setSortBy] = useState('nome');

  const categories = ['Todos', ...Array.from(new Set(produtos.map(p => p.categoria)))];
  const allCategories = Array.from(new Set(produtos.map(p => p.categoria)));
  const allRestaurants = Array.from(new Set(produtos.map(p => p.restaurante.nome)));
  
  const filteredProducts = useMemo(() => {
    let filtered = produtos;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(produto =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.restaurante.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoria (CategoryFilter)
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(produto => produto.categoria === selectedCategory);
    }

    // Filtro por categorias (SearchAndFilters)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(produto => selectedCategories.includes(produto.categoria));
    }

    // Filtro por restaurante
    if (selectedRestaurant !== 'todos') {
      filtered = filtered.filter(produto => produto.restaurante.nome === selectedRestaurant);
    }

    // Filtro por faixa de preço
    filtered = filtered.filter(produto => 
      produto.preco >= priceRange.min && produto.preco <= priceRange.max
    );

    // Ordenação
    switch (sortBy) {
      case 'nome':
        filtered.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'preco-asc':
        filtered.sort((a, b) => a.preco - b.preco);
        break;
      case 'preco-desc':
        filtered.sort((a, b) => b.preco - a.preco);
        break;
      case 'avaliacao':
        // Para simplificar, vamos ordenar por nome
        filtered.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedCategories, selectedRestaurant, priceRange, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 100 });
    setSelectedRestaurant('todos');
    setSortBy('nome');
    setSelectedCategory('Todos');
  };

  const mainRestaurant = restaurantes[0]; // Komi Keto

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => setIsLoginModalOpen(true)}
        onCartClick={() => setIsCartModalOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <RestaurantHeader restaurante={mainRestaurant} />
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedRestaurant={selectedRestaurant}
              onRestaurantChange={setSelectedRestaurant}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
              categories={allCategories}
              restaurants={allRestaurants}
            />

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Nosso Cardápio</h2>
                <p className="text-gray-600">
                  {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Nenhum produto encontrado com os filtros aplicados.</p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Limpar filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((produto) => (
                    <ProductCard key={produto.id} produto={produto} />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:w-80">
            <CartSidebar />
          </div>
        </div>
      </main>
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </div>
  );
};

export default Index;
