import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link, AlertCircle } from 'lucide-react';
import { imageOptimizer, imgbbUploader } from '../../utils/imageOptimization';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    setError(null);
    
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles = files.filter(file => {
      if (!acceptedFormats.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Accepted formats: ${acceptedFormats.join(', ')}`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError(`File too large: ${file.name}. Maximum size: 5MB`);
        return false;
      }
      return true;
    });

    // Upload to cloud storage
    validFiles.forEach(file => {
      uploadImage(file);
    });
  };

  const uploadImage = async (file: File) => {
    try {
      // Try Cloudinary first, fallback to ImgBB
      let imageUrl;
      try {
        imageUrl = await imageOptimizer.uploadImage(file);
      } catch {
        imageUrl = await imgbbUploader.uploadImage(file);
      }
      onImagesChange([...images, imageUrl]);
    } catch (error) {
      // Fallback to base64 for demo
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImagesChange([...images, result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;
    
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      if (!images.includes(urlInput)) {
        onImagesChange([...images, urlInput]);
        setUrlInput('');
        setError(null);
      } else {
        setError('Image URL already added');
      }
    } catch {
      setError('Please enter a valid URL');
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            uploadMode === 'file'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Upload className="h-4 w-4 inline mr-2" />
          Upload Files
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            uploadMode === 'url'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Link className="h-4 w-4 inline mr-2" />
          Add URL
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {uploadMode === 'file' && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFormats.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop images here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:underline"
            >
              browse files
            </button>
          </p>
          <p className="text-sm text-gray-500">
            Supports: {acceptedFormats.join(', ')} • Max size: 5MB • Max files: {maxImages}
          </p>
        </div>
      )}

      {uploadMode === 'url' && (
        <div className="flex space-x-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter image URL (https://...)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
          />
          <button
            type="button"
            onClick={handleUrlAdd}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Add
          </button>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 px-2 py-1 bg-primary text-white text-xs rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        {images.length} of {maxImages} images added
        {images.length > 0 && ' • First image will be used as the main product image'}
      </p>
    </div>
  );
};

export default ImageUpload;