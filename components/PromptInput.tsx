
import React, { useState, useCallback, useRef } from 'react';
import type { ImageFile } from '../types';
import { ImageIcon, SparklesIcon, XIcon } from './Icons';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Upbeat electronic music for a workout video..."
          className="w-full h-32 p-4 pr-12 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none transition-colors"
          disabled={isLoading}
        />
        <label
          htmlFor="image-upload"
          className="absolute right-4 top-4 text-slate-400 hover:text-purple-400 cursor-pointer transition-colors"
        >
          <ImageIcon className="w-6 h-6" />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            ref={fileInputRef}
            disabled={isLoading}
          />
        </label>
      </div>

      {imagePreview && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden group">
            <img src={imagePreview} alt="Prompt inspiration" className="w-full h-full object-cover" />
            <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
                disabled={isLoading}
            >
                <XIcon className="w-4 h-4" />
            </button>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !prompt}
        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Generating...' : 'Generate Music'}
      </button>
    </form>
  );
};
