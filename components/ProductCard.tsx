
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300">
            <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden">
                {product.isAdult && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10 select-none">
                        18+
                    </div>
                )}
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                <p className="mt-2 text-md font-medium text-gray-700 dark:text-gray-300">${product.price.toFixed(2)}</p>
            </div>
        </div>
    </Link>
  );
};

export default ProductCard;