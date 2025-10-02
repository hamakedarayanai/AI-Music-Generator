
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { GeneratedMusic } from '../types';
import { PlayIcon, PauseIcon, DownloadIcon, LoopIcon } from './Icons';

interface MusicPlayerProps {
  music: GeneratedMusic;
}

const placeholderAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ music }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
      setCurrentTime(Number(event.target.value));
    }
  };
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => {
        if (!audio.loop) {
            setIsPlaying(false);
        }
    });

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);
  
  useEffect(() => {
    if (progressRef.current) {
        const progress = (currentTime / duration) * 100;
        progressRef.current.style.background = `linear-gradient(to right, #a855f7 ${progress}%, #475569 ${progress}%)`;
    }
  }, [currentTime, duration]);

  return (
    <div className="card-bg border border-slate-700 rounded-2xl p-6 shadow-2xl">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`absolute w-40 h-40 bg-purple-500/10 rounded-full animate-ping`} style={{animationDelay: `${i * 0.4}s`, animationDuration: '2s'}}></div>
                ))}
            </div>
            <button
                onClick={togglePlayPause}
                className="relative bg-black/20 rounded-full w-24 h-24 flex items-center justify-center text-white hover:bg-black/40 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10 pl-1" />}
            </button>
        </div>

        <h2 className="text-3xl font-bold text-white">{music.genre}</h2>
        <p className="text-slate-300 mt-1 text-lg">{music.mood}</p>
        <p className="text-slate-400 mt-4 max-w-prose">{music.description}</p>
      </div>
        
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-400">{formatTime(currentTime)}</span>
            <input
                ref={progressRef}
                type="range"
                value={currentTime}
                step="any"
                max={duration || 0}
                onChange={handleProgressChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer range-lg bg-slate-700"
                aria-label="Music progress"
            />
            <span className="text-slate-400">{formatTime(duration)}</span>
        </div>
        <div className="flex justify-center items-center gap-6">
            <button
                onClick={toggleLoop}
                className={`p-2 rounded-full transition-colors ${isLooping ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400 hover:bg-slate-700'}`}
                aria-label={isLooping ? 'Disable loop' : 'Enable loop'}
            >
                <LoopIcon className="w-6 h-6" />
            </button>
            <a
                href={placeholderAudioUrl}
                download="ai-generated-music.mp3"
                className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                <DownloadIcon className="w-5 h-5" />
                Download
            </a>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700">
         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-center">
            <div className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tempo</p>
                <p className="text-white font-bold mt-1">{music.tempo} BPM</p>
            </div>
             <div className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Key</p>
                <p className="text-white font-bold mt-1">{music.key}</p>
            </div>
             <div className="bg-slate-700/50 p-3 rounded-lg col-span-2 sm:col-span-1">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Instruments</p>
                <p className="text-white font-bold mt-1 truncate">{music.instruments.join(', ')}</p>
            </div>
          </div>
      </div>
      <audio ref={audioRef} src={placeholderAudioUrl} loop={isLooping} preload="metadata" />
    </div>
  );
};