
import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const PublicShop: React.FC = () => {
  const { products, isLoading, isAgeVerified } = useAppContext();

  const displayedProducts = isAgeVerified ? products : products.filter(p => !p.isAdult);

  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Welcome to KinkyBrizzle
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Unique designs, premium quality. Express yourself with our exclusive collection of apparel.
        </p>
      </div>
      
      {isLoading && <p className="text-center">Loading products...</p>}
      
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicShop;