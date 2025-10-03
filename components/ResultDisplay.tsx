import React from 'react';
import type { EditedImageResult } from '../types';

interface ResultDisplayProps {
  isLoading: boolean;
  result: EditedImageResult | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="w-full max-w-lg mx-auto animate-pulse">
        <div className="bg-gray-700 rounded-lg aspect-square"></div>
        <div className="h-4 bg-gray-700 rounded-md mt-4 w-3/4 mx-auto"></div>
        <div className="h-8 bg-gray-700 rounded-md mt-6 w-48 mx-auto"></div>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, result }) => {
  if (isLoading) {
    return (
        <div className="pt-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-400">AI is working its magic...</h2>
                <p className="text-gray-400 mt-1">This might take a moment.</p>
            </div>
            <LoadingSkeleton />
        </div>
    );
  }

  if (!result) {
    return null;
  }

  // Case 1: We have an image, display it.
  if (result.imageUrl) {
    return (
        <div className="pt-8 border-t border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-400">Your Styled Room!</h2>
          </div>
          <div className="w-full max-w-lg mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
            <img src={result.imageUrl} alt="Generated room" className="w-full h-auto object-cover" />
            {result.text && (
                <p className="p-4 text-center text-gray-400 italic">"{result.text}"</p>
            )}
          </div>
          <div className="text-center mt-6">
            <a
              href={result.imageUrl}
              download="styled-room.png"
              className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
            >
              Download Image
            </a>
          </div>
        </div>
      );
  }

  // Case 2: No image, but we have a text message (e.g., a conversational reply from the AI).
  if (result.text) {
    return (
        <div className="pt-8 border-t border-gray-700">
            <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-400">Message from AI</h2>
            </div>
            <div className="w-full max-w-lg mx-auto bg-gray-800 border border-gray-600 text-gray-300 p-4 rounded-lg">
                <p className="whitespace-pre-wrap text-center">{result.text}</p>
            </div>
      </div>
    );
  }

  return null;
};
