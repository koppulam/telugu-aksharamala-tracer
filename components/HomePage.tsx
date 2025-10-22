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
    className={`${color} rounded-3xl shadow-2xl border-4 border-white p-6 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform duration-200 w-full sm:w-64 aspect-square`}
  >
    <div className="text-6xl sm:text-7xl">{emoji}</div>
    <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg">{title}</h2>
    <p className="text-sm sm:text-base text-white/90 font-medium">{description}</p>
  </button>
);

const HomePage: React.FC<HomePageProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-[100svh] w-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-sky-50 to-blue-50 overflow-x-hidden">
      <header className="mb-8">
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-transparent bg-clip-text drop-shadow">
          Telugu Aksharamala
        </h1>
        <p className="text-xl sm:text-2xl text-slate-600 mt-3">Learn • Trace • Play!</p>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        <GameTile
          title="Trace Letters"
          description="Practice writing Telugu letters"
          emoji="✍️"
          color="bg-gradient-to-br from-orange-400 to-pink-500"
          onClick={() => onSelectMode('trace')}
        />
        <GameTile
          title="Picture Match"
          description="Match letters with pictures"
          emoji="🖼️"
          color="bg-gradient-to-br from-green-400 to-teal-500"
          onClick={() => onSelectMode('pictureMatch')}
        />
        <GameTile
          title="Balloon Pop"
          description="Find letters in floating balloons"
          emoji="🎈"
          color="bg-gradient-to-br from-purple-400 to-indigo-500"
          onClick={() => onSelectMode('balloonPop')}
        />
      </main>
    </div>
  );
};

export default HomePage;

