import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { createChatSession } from '../services/gemini';
import { ChatMessage } from '../types';
import Spinner from './Spinner';

interface ChatBotProps {
  personaName: string;
  systemInstruction: string;
  welcomeMessage: string;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ personaName, systemInstruction, welcomeMessage, onClose }) => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'model', text: welcomeMessage }]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const session = createChatSession(systemInstruction);
      setChatSession(session);
    } catch (error) {
      console.error("Failed to create chat session:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now."}]);
    }
  }, [systemInstruction]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim() || isLoading || !chatSession) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userInput });
      setMessages([...newMessages, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages([...newMessages, { role: 'model', text: "I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-5 w-full max-w-sm h-2/3 max-h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center rounded-t-lg">
        <h3 className="font-bold text-lg">{personaName}</h3>
        <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </header>
      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !userInput.trim()} className="bg-indigo-600 text-white p-2 rounded-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatBot;