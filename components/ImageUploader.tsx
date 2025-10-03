
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  imagePreview: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imagePreview }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    onImageChange(file);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  if (imagePreview) {
    return (
      <div className="relative group w-full max-w-lg mx-auto">
        <img src={imagePreview} alt="Room preview" className="rounded-lg w-full h-auto object-contain shadow-lg" />
        <button
          onClick={handleRemoveImage}
          className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Remove image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative block w-full h-64 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
        isDragging ? 'border-indigo-500 bg-gray-700/50' : 'border-gray-600 hover:border-indigo-500'
      }`}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <UploadIcon className="w-12 h-12 text-gray-500 mb-2" />
        <p className="text-gray-400">
          <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
      </div>
      <input type="file" onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
    </label>
  );
};
