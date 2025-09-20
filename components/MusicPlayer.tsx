
import React, { useState, useRef, useEffect } from 'react';
import type { GeneratedMusic } from '../types';
import { PlayIcon, PauseIcon, DownloadIcon } from './Icons';

interface MusicPlayerProps {
  music: GeneratedMusic;
}

const placeholderAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ music }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);

    if (audio) {
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
             <button
                onClick={togglePlayPause}
                className="bg-black/20 rounded-full p-4 text-white hover:bg-black/40 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
            </button>
          </div>
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-white">{music.genre}</h2>
          <p className="text-slate-300 mt-1">{music.mood}</p>
          <p className="text-slate-400 mt-4 text-sm">{music.description}</p>
          
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tempo</p>
                <p className="text-white font-bold">{music.tempo} BPM</p>
            </div>
             <div className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Key</p>
                <p className="text-white font-bold">{music.key}</p>
            </div>
             <div className="bg-slate-700/50 p-3 rounded-lg col-span-2 sm:col-span-1">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Instruments</p>
                <p className="text-white font-bold truncate">{music.instruments.join(', ')}</p>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-auto flex-shrink-0">
           <a
                href={placeholderAudioUrl}
                download="ai-generated-music.mp3"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                <DownloadIcon className="w-5 h-5" />
                Download
            </a>
        </div>
      </div>
      <audio ref={audioRef} src={placeholderAudioUrl} loop />
    </div>
  );
};
