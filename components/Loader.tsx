
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12 text-center">
      <div className="relative w-16 h-16">
        <div className="absolute border-4 border-purple-400 border-t-transparent rounded-full w-full h-full animate-spin"></div>
        <div className="absolute border-4 border-pink-400 border-t-transparent rounded-full w-full h-full animate-spin" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <p className="mt-4 text-slate-400">Generating your unique track...</p>
    </div>
  );
};
