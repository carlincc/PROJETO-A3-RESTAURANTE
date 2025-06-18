
import React, { useState } from 'react';
import { ShoppingCart, User, LogOut, Menu, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLoginClick: () => void;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onCartClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleManageProducts = () => {
    navigate('/gerencia');
  };

  const handleManageRestaurants = () => {
    navigate('/restaurantes');
  };

  const handleViewOrders = () => {
    navigate('/pedidos');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <header className="bg-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleHome}>
            <div className="text-2xl font-bold">🍕 Komi Keto</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">Olá, {user?.nome}</span>
                {(user?.tipo === 'gerente' || user?.tipo === 'admin') && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleManageProducts}
                      className="text-white hover:text-orange-200"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Produtos
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleManageRestaurants}
                      className="text-white hover:text-orange-200"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Restaurantes
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewOrders}
                  className="text-white hover:text-orange-200"
                >
                  <User className="h-4 w-4 mr-2" />
                  {user?.tipo === 'cliente' ? 'Meus Pedidos' : 'Pedidos'}
                </Button>
                {user?.tipo === 'cliente' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCartClick}
                    className="relative text-white hover:text-orange-200"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white hover:text-orange-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onLoginClick}
                className="bg-white text-orange-500 border-white hover:bg-orange-50"
              >
                Entrar / Cadastrar
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 border-t border-orange-400 pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="text-sm">Olá, {user?.nome}</div>
                {(user?.tipo === 'gerente' || user?.tipo === 'admin') && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleManageProducts}
                      className="text-white hover:text-orange-200 w-full justify-start"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Produtos
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleManageRestaurants}
                      className="text-white hover:text-orange-200 w-full justify-start"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Restaurantes
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewOrders}
                  className="text-white hover:text-orange-200 w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  {user?.tipo === 'cliente' ? 'Meus Pedidos' : 'Pedidos'}
                </Button>
                {user?.tipo === 'cliente' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCartClick}
                    className="relative text-white hover:text-orange-200 w-full justify-start"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Carrinho
                    {itemCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white hover:text-orange-200 w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onLoginClick}
                className="bg-white text-orange-500 border-white hover:bg-orange-50 w-full"
              >
                Entrar / Cadastrar
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
