
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import * as api from '../services/api';
import { useAppContext } from '../context/AppContext';
import AgeGateModal from '../components/AgeGateModal';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, isLoading: isAppContextLoading, isAgeVerified, verifyAge } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [mainImage, setMainImage] = useState<string>('');
  const [showAgeGate, setShowAgeGate] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      const fetchedProduct = await api.fetchProductById(productId);
      if (fetchedProduct) {
        if(fetchedProduct.isAdult && !isAgeVerified) {
            setShowAgeGate(true);
        } else {
            setProduct(fetchedProduct);
            setSelectedSize(fetchedProduct.variants.sizes[0]?.value || '');
            setSelectedColor(fetchedProduct.variants.colors[0]?.value || '');
            setMainImage(fetchedProduct.imageUrl);
        }
      } else {
        // Handle product not found, maybe redirect
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId, isAgeVerified]);

  if (loading) {
    return <div className="text-center p-10">Loading product details...</div>;
  }
  
  if (showAgeGate) {
      return (
          <AgeGateModal 
            onVerify={() => {
                verifyAge();
                setShowAgeGate(false);
            }}
            onCancel={() => navigate('/')}
          />
      )
  }

  if (!product) {
    return <div className="text-center p-10">Product not found.</div>;
  }
  
  const handleAddToCart = () => {
      if (product) {
          addToCart(product, quantity, selectedSize, selectedColor);
      }
  };

  return (
    <div className="container mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img src={mainImage} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
           <div className="grid grid-cols-4 gap-2 mt-4">
              {[product.imageUrl, ...product.mockupUrls].map((url, index) => (
                <img key={index} src={url} alt={`mockup ${index}`} className={`cursor-pointer rounded-md border-2 ${mainImage === url ? 'border-indigo-500' : 'border-transparent'}`} onClick={() => setMainImage(url)} />
              ))}
           </div>
        </div>

        <div>
          <button onClick={() => navigate('/')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4">&larr; Back to Shop</button>
          <div className="flex items-center gap-x-3 mb-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{product.name}</h1>
            {product.isAdult && (
              <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full select-none">18+</span>
            )}
          </div>
          <p className="text-3xl text-gray-900 dark:text-gray-100 mb-6">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>
          
          <div className="space-y-6">
            {/* Size Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Size</h3>
              <div className="flex items-center space-x-2 mt-2">
                {product.variants.sizes.map(size => (
                  <button key={size.id} onClick={() => setSelectedSize(size.value)} className={`px-4 py-2 border rounded-md text-sm ${selectedSize === size.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
                    {size.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Color</h3>
              <div className="flex items-center space-x-2 mt-2">
                {product.variants.colors.map(color => (
                  <button key={color.id} onClick={() => setSelectedColor(color.value)} className={`px-4 py-2 border rounded-md text-sm ${selectedColor === color.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
                    {color.value}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-md text-center bg-gray-50 dark:bg-gray-700" />
                <button
                    onClick={handleAddToCart}
                    disabled={isAppContextLoading}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400">
                    Add to Cart
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;