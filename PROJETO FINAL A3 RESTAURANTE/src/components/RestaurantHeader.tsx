
import React from 'react';
import { Star, Clock, Truck } from 'lucide-react';
import { Restaurante } from '../types';

interface RestaurantHeaderProps {
  restaurante: Restaurante;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurante }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurante.nome}</h1>
          <p className="text-gray-600 mb-4">Os melhores lanches da cidade! Pizza, hambúrgueres e bebidas geladas.</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="font-medium">{restaurante.avaliacoes}</span>
              <span className="ml-1">(125 avaliações)</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              <span>{restaurante.tempoEntrega}</span>
            </div>
            
            <div className="flex items-center">
              <Truck className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">Entrega grátis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
