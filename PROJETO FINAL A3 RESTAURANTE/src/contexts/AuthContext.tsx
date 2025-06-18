
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../types';
import { usuarios } from '../data/mockData';

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, senha: string) => boolean;
  register: (nome: string, email: string, senha: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Adicionar conta de gerente aos usuários
const gerenteAccount: Usuario = {
  id: 999,
  nome: 'Gerente do Restaurante',
  email: 'gerente@restaurante.com',
  senha: '123456',
  dataCadastro: new Date(),
  tipo: 'gerente'
};

// Adicionar conta de admin
const adminAccount: Usuario = {
  id: 998,
  nome: 'Administrador',
  email: 'admin@restaurante.com',
  senha: '123456',
  dataCadastro: new Date(),
  tipo: 'admin'
};

// Adicionar gerente e admin aos usuários se não existirem
if (!usuarios.find(u => u.email === 'gerente@restaurante.com')) {
  usuarios.push(gerenteAccount);
}

if (!usuarios.find(u => u.email === 'admin@restaurante.com')) {
  usuarios.push(adminAccount);
}

// Atualizar usuários existentes para ter tipo 'cliente' se não tiverem
usuarios.forEach(user => {
  if (!user.tipo) {
    (user as any).tipo = 'cliente';
  }
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, senha: string): boolean => {
    const foundUser = usuarios.find(u => u.email === email && u.senha === senha);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (nome: string, email: string, senha: string): boolean => {
    const existingUser = usuarios.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: Usuario = {
      id: usuarios.length + 1,
      nome,
      email,
      senha,
      dataCadastro: new Date(),
      tipo: 'cliente'
    };

    usuarios.push(newUser);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
