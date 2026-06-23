import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImageToCloudinary } from '../services/cloudinaryService';

const ImageUploader = ({ imageUrl, onImageUploaded, onImageRemoved }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onImageUploaded(url);
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
      {imageUrl ? (
        <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
          <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onImageRemoved}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-3" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">{isUploading ? 'Uploading...' : 'SVG, PNG, JPG or GIF'}</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
