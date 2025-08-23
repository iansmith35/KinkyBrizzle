
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Spinner from './Spinner';

const ProductForm: React.FC = () => {
  const [name, setName] = useState('Smiley T-Shirt');
  const [description, setDescription] = useState('A high-quality, comfortable t-shirt with a classic smiley face design.');
  const [price, setPrice] = useState('24.99');
  const { createProduct, isLoading } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(price);
    if (!name || !description || isNaN(priceValue) || priceValue <= 0) {
      alert('Please fill in all fields with valid values.');
      return;
    }
    await createProduct(name, description, priceValue);
    // Reset form if needed
    setName('');
    setDescription('');
    setPrice('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Product</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Smiley T-Shirt"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="A short description of the product."
          ></textarea>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
          <input
            type="number"
            id="price"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 29.99"
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isLoading && <Spinner />}
            Create Product & Sync
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
