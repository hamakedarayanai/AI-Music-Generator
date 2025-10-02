
import React, { useState, useCallback } from 'react';
import { PromptInput } from './components/PromptInput';
import { MusicPlayer } from './components/MusicPlayer';
import { Loader } from './components/Loader';
import { generateMusicDescription } from './services/geminiService';
import type { GeneratedMusic, ImageFile } from './types';
import { MusicIcon } from './components/Icons';

const App: React.FC = () => {
  const [generatedMusic, setGeneratedMusic] = useState<GeneratedMusic | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMusic = useCallback(async (prompt: string, image: ImageFile | null) => {
    if (!prompt) {
      setError('Please enter a prompt to generate music.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedMusic(null);

    try {
      const musicData = await generateMusicDescription(prompt, image);
      setGeneratedMusic(musicData);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the music. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-2xl mb-10 text-center animate-fadeInUp" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-center gap-4 mb-2">
            <div className="bg-purple-500/80 p-2 rounded-full shadow-lg">
                <MusicIcon className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            AI Music Generator
            </h1>
        </div>
        <p className="text-slate-400 mt-2 text-lg">
          Craft unique audio tracks from text and images.
        </p>
      </header>
      
      <main className="w-full max-w-2xl flex-grow">
        <div 
          className="card-bg p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700 animate-fadeInUp"
          style={{ animationDelay: '200ms' }}
        >
          <PromptInput onGenerate={handleGenerateMusic} isLoading={isLoading} />
        </div>
        
        {error && (
          <div 
            className="mt-6 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center animate-fadeInUp"
            style={{ animationDelay: '300ms' }}
          >
            {error}
          </div>
        )}
        
        {isLoading && <Loader />}
        
        {generatedMusic && !isLoading && (
          <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <MusicPlayer music={generatedMusic} />
          </div>
        )}
      </main>

       <footer className="w-full max-w-2xl mt-16 text-center text-slate-500 text-sm animate-fadeInUp" style={{ animationDelay: '400ms' }}>
        <p>&copy; {new Date().getFullYear()} AI Music Generator. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;