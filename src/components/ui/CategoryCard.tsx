import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import OptimizedImage from './OptimizedImage';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/categories/${category.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <OptimizedImage
            src={category.image}
            alt={category.name}
            width={400}
            height={300}
            className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{category.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{category.productCount} products</span>
            <span className="text-primary font-medium text-sm group-hover:underline">
              Explore →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;