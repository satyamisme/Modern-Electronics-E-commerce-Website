import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../types';
import OptimizedImage from './OptimizedImage';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/categories/${category.slug}`} className="group">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={category.image}
            alt={category.name}
            width={400}
            height={250}
            className="w-full h-48 group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
            <p className="text-gray-200 text-sm">{category.productCount} products</p>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-medium text-sm">Explore Collection</span>
            <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;