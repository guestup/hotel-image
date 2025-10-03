
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { editImage } from './services/geminiService';
import type { EditedImageResult } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<EditedImageResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [baseImagePreview, setBaseImagePreview] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setBaseImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBaseImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBaseImagePreview(null);
    }
    setResult(null); 
    setError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!baseImage || !prompt.trim()) {
      setError('Please upload an image and provide a description of the changes.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const editedResult = await editImage(baseImage, prompt);
      setResult(editedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [baseImage, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 space-y-8 border border-gray-700">
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-indigo-400">1. Upload a Room Photo</h2>
            <p className="text-gray-400 mt-1">Start with a base image of your hotel room.</p>
          </div>
          <ImageUploader onImageChange={handleImageChange} imagePreview={baseImagePreview} />

          {baseImagePreview && (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-indigo-400">2. Describe Your Vision</h2>
                <p className="text-gray-400 mt-1">What would you like to add or change? Be descriptive!</p>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Add a modern, velvet green armchair in the corner by the window' or 'Place a person working on a laptop on the bed'"
                className="w-full h-28 p-4 bg-gray-900 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                disabled={isLoading}
              />

              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !baseImage || !prompt}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Styling...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      Generate Image
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <p>{error}</p>
            </div>
          )}

          <ResultDisplay isLoading={isLoading} result={result} />
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
