import React from 'react';

interface ChatBotToggleButtonProps {
  onClick: () => void;
}

const ChatIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const ChatBotToggleButton: React.FC<ChatBotToggleButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 bg-indigo-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-40"
      aria-label="Open Chat"
    >
      <ChatIcon />
    </button>
  );
};

export default ChatBotToggleButton;