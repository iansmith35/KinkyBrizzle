import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AdminDashboard from './pages/AdminDashboard';
import PublicShop from './pages/PublicShop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import KinkyKustomer from './pages/KinkyKustomer';
import ChatBot from './components/ChatBot';
import ChatBotToggleButton from './components/ChatBotToggleButton';

const App: React.FC = () => {
  const [isStacyChatOpen, setIsStacyChatOpen] = useState(false);
  const location = useLocation();
  const showStacyChat = !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <Header />
      <main className="p-4 md:p-8">
        <Routes>
          <Route path="/" element={<PublicShop />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/kinky-kustomer" element={<KinkyKustomer />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {showStacyChat && (
        <>
          <ChatBotToggleButton onClick={() => setIsStacyChatOpen(true)} />
          {isStacyChatOpen && (
            <ChatBot
              personaName="Stacy"
              welcomeMessage="Hi there! I'm Stacy, your shopping assistant. How can I help you find the perfect item today?"
              systemInstruction="You are Stacy, a friendly and helpful shopping assistant for KinkyBrizzle, an online apparel store. Your goal is to answer customer questions about products, sizing, materials, and shipping. Keep your answers concise, positive, and focused on helping the shopper. Do not discuss business strategy, marketing, or anything outside the scope of a customer shopping experience."
              onClose={() => setIsStacyChatOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;