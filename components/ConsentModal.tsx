
import React from 'react';

interface ConsentModalProps {
  onConsent: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ onConsent }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center transform transition-all scale-100">
        <div className="text-yellow-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Emotion Tracker requires Camera Access</h2>
        <p className="text-gray-300 mb-6">
          To provide real-time emotional feedback, this application needs to access your webcam. Your image data is processed in real-time to detect emotions and is not stored or shared.
        </p>
        <button
          onClick={onConsent}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Accept & Enable Camera
        </button>
      </div>
    </div>
  );
};
