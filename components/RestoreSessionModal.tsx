
import React from 'react';

interface RestoreSessionModalProps {
  onRestore: () => void;
  onStartNew: () => void;
}

export const RestoreSessionModal: React.FC<RestoreSessionModalProps> = ({ onRestore, onStartNew }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center transform transition-all scale-100">
        <div className="text-blue-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Previous Session Found</h2>
        <p className="text-gray-300 mb-6">
          It looks like you have saved data from a previous session. Would you like to restore it or start a new session?
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onRestore}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Restore Session
            </button>
            <button
              onClick={onStartNew}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Start New
            </button>
        </div>
      </div>
    </div>
  );
};
