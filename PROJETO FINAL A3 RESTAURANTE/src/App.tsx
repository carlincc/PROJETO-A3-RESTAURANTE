
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { PedidosProvider } from "./contexts/PedidosContext";
import { RestaurantesProvider } from "./contexts/RestaurantesContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Index from "./pages/Index";
import ProductManager from "./pages/ProductManager";
import PedidosManager from "./pages/PedidosManager";
import RestaurantesManager from "./pages/RestaurantesManager";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <FavoritesProvider>
            <RestaurantesProvider>
              <PedidosProvider>
                <CartProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/gerencia" element={<ProductManager />} />
                      <Route path="/pedidos" element={<PedidosManager />} />
                      <Route path="/restaurantes" element={<RestaurantesManager />} />
                      <Route path="/perfil" element={<Profile />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </CartProvider>
              </PedidosProvider>
            </RestaurantesProvider>
          </FavoritesProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
