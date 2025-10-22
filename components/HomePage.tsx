import React from 'react';
import type { GameMode } from '../types';

interface HomePageProps {
  onSelectMode: (mode: GameMode) => void;
}

const GameTile: React.FC<{
  title: string;
  description: string;
  emoji: string;
  color: string;
  onClick: () => void;
}> = ({ title, description, emoji, color, onClick }) => (
  <button
    onClick={onClick}
    className={`${color} rounded-[28px] shadow-2xl border-[6px] border-white p-4 sm:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 hover:scale-110 hover:rotate-2 transition-all duration-300 w-full aspect-square relative overflow-hidden group`}
  >
    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="text-5xl sm:text-6xl animate-bounce relative z-10">{emoji}</div>
    <h2 className="text-lg sm:text-2xl font-black text-white drop-shadow-2xl relative z-10 tracking-wide">{title}</h2>
    <p className="text-sm sm:text-base text-white font-bold relative z-10">{description}</p>
    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
  </button>
);

const HomePage: React.FC<HomePageProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-[100svh] w-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 overflow-x-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300/30 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/30 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <header className="mb-6 sm:mb-8 relative z-10">
        <div className="text-5xl sm:text-6xl mb-3 animate-bounce">🎨</div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text drop-shadow-2xl mb-2 tracking-tight">
          Telugu Aksharamala
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-purple-700 mt-2 animate-pulse">Learn • Trace • Play!</p>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl w-full relative z-10">
        <GameTile
          title="Trace Letters"
          description="✨ Draw Telugu letters!"
          emoji="✍️"
          color="bg-gradient-to-br from-orange-400 via-orange-500 to-pink-600"
          onClick={() => onSelectMode('trace')}
        />
        <GameTile
          title="Picture Match"
          description="🎯 Find the right letter!"
          emoji="🖼️"
          color="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600"
          onClick={() => onSelectMode('pictureMatch')}
        />
        <GameTile
          title="Balloon Pop"
          description="🎪 Catch flying letters!"
          emoji="🎈"
          color="bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600"
          onClick={() => onSelectMode('balloonPop')}
        />
      </main>
    </div>
  );
};

export default HomePage;

