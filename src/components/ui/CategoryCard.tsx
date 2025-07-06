import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { Category } from '../../types';
import OptimizedImage from './OptimizedImage';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/categories/${category.slug}`} className="group">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={category.image}
            alt={category.name}
            width={400}
            height={250}
            className="w-full h-48 group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Category Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">{category.name}</h3>
            <div className="flex items-center space-x-2 text-sm">
              <Package className="h-4 w-4" />
              <span>{category.productCount} products</span>
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{category.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-bold text-sm group-hover:text-blue-700 transition-colors">
              Explore Collection
            </span>
            <div className="bg-blue-100 p-2 rounded-xl group-hover:bg-blue-200 transition-colors">
              <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;