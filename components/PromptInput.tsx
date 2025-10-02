
import React, { useState, useCallback, useRef } from 'react';
import type { ImageFile } from '../types';
import { ImageIcon, SparklesIcon, XIcon, UploadIcon } from './Icons';

interface PromptInputProps {
  onGenerate: (prompt: string, image: ImageFile | null) => void;
  isLoading: boolean;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<ImageFile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit
        alert("Image size should not exceed 4MB.");
        return;
      }
      const base64 = await fileToBase64(file);
      const mimeType = file.type;
      setImage({ base64, mimeType });
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const removeImage = useCallback(() => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(prompt, image);
  }, [prompt, image, onGenerate]);
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label htmlFor="prompt-input" className="font-medium text-slate-300">Describe your music</label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Upbeat electronic music for a workout video..."
          className="w-full h-28 p-4 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none transition-colors"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-4">
        <label className="font-medium text-slate-300">Add an image (optional)</label>
         <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            ref={fileInputRef}
            disabled={isLoading}
          />
        {imagePreview ? (
            <div className="relative w-36 h-36 rounded-lg overflow-hidden group">
                <img src={imagePreview} alt="Prompt inspiration" className="w-full h-full object-cover" />
                <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1.5 right-1.5 bg-black/60 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Remove image"
                    disabled={isLoading}
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        ) : (
             <button
                type="button"
                onClick={triggerFileSelect}
                disabled={isLoading}
                className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-600 hover:border-purple-500 rounded-xl transition-colors cursor-pointer"
            >
                <UploadIcon className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-slate-400 font-semibold">Click to upload an image</span>
                <span className="text-slate-500 text-sm mt-1">PNG, JPG, GIF up to 4MB</span>
            </button>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !prompt}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-purple-500/30"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Generating...' : 'Generate Music'}
      </button>
    </form>
  );
};