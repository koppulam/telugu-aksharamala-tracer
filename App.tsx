import React, { useState } from 'react';
import type { GameMode } from './types';
import HomePage from './components/HomePage';
import TracingGame from './components/TracingGame';
import PictureMatchGame from './components/PictureMatchGame';
import BalloonPopGame from './components/BalloonPopGame';

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('home');

  const renderGame = () => {
    switch (gameMode) {
      case 'home':
        return <HomePage onSelectMode={setGameMode} />;
      case 'trace':
        return <TracingGame onExit={() => setGameMode('home')} />;
      case 'pictureMatch':
        return <PictureMatchGame onExit={() => setGameMode('home')} />;
      case 'balloonPop':
        return <BalloonPopGame onExit={() => setGameMode('home')} />;
      default:
        return <HomePage onSelectMode={setGameMode} />;
    }
  };

  return renderGame();
};

export default App;
