
import React, { useState, useEffect } from 'react';

const messages = [
  "Composing your masterpiece...",
  "Tuning the synths...",
  "Mixing the bassline...",
  "Harmonizing the melody...",
  "Adding a touch of magic...",
];

export const Loader: React.FC = () => {
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
        setMessage(prev => {
            const currentIndex = messages.indexOf(prev);
            return messages[(currentIndex + 1) % messages.length];
        });
        }, 2500);
        return () => clearInterval(interval);
    }, []);


  return (
    <div className="flex flex-col items-center justify-center my-12 text-center">
      <div className="flex items-end justify-center h-12 w-16 gap-1">
        {[...Array(5)].map((_, i) => (
             <span 
                key={i}
                className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
                style={{
                    animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    animationDelay: `${i * 0.15}s`,
                    height: `${1 + Math.random() * 2}rem`
                }}
             ></span>
        ))}
      </div>
      <p className="mt-6 text-slate-400 transition-opacity duration-500">{message}</p>
    </div>
  );
};