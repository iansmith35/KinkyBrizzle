
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, submitOrder, isLoading } = useAppContext();
  const navigate = useNavigate();
  
  const cartContainsAdultItem = cart.some(item => item.product.isAdult);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    const success = await submitOrder();
    if (success) {
      navigate('/');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <button onClick={() => navigate('/')} className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Shopping Cart</h1>
      <div className="space-y-4">
        {cart.map(item => (
          <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-md" />
              <div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{item.product.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.color} / {item.size}</p>
                <p className="text-md text-gray-800 dark:text-gray-200">${item.product.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateCartQuantity(item.product.id, item.size, item.color, parseInt(e.target.value))}
                className="w-16 p-1 border rounded-md text-center bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                min="1"
              />
              <button onClick={() => removeFromCart(item.product.id, item.size, item.color)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition">
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end items-center">
        <div className="text-right w-full max-w-sm">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">Total: ${cartTotal.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Shipping & taxes calculated at checkout.</p>
          
          {cartContainsAdultItem && (
            <div className="mt-4 space-y-4">
              <div className="bg-yellow-50 dark:bg-gray-700 p-3 rounded-md border border-yellow-200 dark:border-gray-600 text-left">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Age Restriction:</strong> By purchasing from Kinky Brizzle, you affirm that you are 18 years of age or older. This brand is intended for adult audiences and not marketed to minors. We reserve the right to cancel any order if we suspect it may violate this policy.
                </p>
              </div>
              <label className="flex items-center justify-end space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I confirm I am 18+ and agree to the{' '}
                  <button type="button" className="underline text-indigo-500 hover:text-indigo-700" onClick={() => setIsTermsModalOpen(true)}>
                    Terms of Service
                  </button>
                  .
                </span>
              </label>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={isLoading || (cartContainsAdultItem && !ageConfirmed)}
            className="mt-4 w-full bg-indigo-600 text-white py-3 px-8 rounded-md shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed">
            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
       <Modal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} title="Terms & Conditions">
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <h4 className="font-bold text-gray-800 dark:text-gray-100">Age Policy</h4>
          <p>Purchasers must be 18 years or older. Any order placed by a minor, or circumventing the age requirement, may be canceled and refunded. By placing an order, you agree to these terms.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;