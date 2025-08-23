import React from 'react';

interface AgeGateModalProps {
  onVerify: () => void;
  onCancel: () => void;
}

const AgeGateModal: React.FC<AgeGateModalProps> = ({ onVerify, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md text-center p-8"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Age Verification</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Please confirm that you are 18 years of age or older to view this content or submit a design.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Leave
          </button>
          <button
            onClick={onVerify}
            className="px-8 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            I am 18 or Older
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeGateModal;
