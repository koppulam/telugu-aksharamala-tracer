import React, { useState, useEffect, useCallback } from 'react';
import type { TeluguLetter } from '../types';
import { achulu, hallulu } from '../constants';
import { useToast } from './Toast';
import { useGameSounds } from '../hooks/useGameSounds';
import { useBestScore } from '../hooks/useBestScore';

interface BalloonPopGameProps {
  onExit: () => void;
}

interface Balloon {
  id: number;
  letter: string;
  x: number;
  duration: number;
  delay: number;
}

const allLetters = [...achulu, ...hallulu];
const GAME_DURATION = 120; // 2 minutes in seconds

const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onExit }) => {
  const [score, setScore] = useState(0);
  const [targetLetter, setTargetLetter] = useState<TeluguLetter | null>(null);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const { showToast } = useToast();
  const { playSuccess, playFailure } = useGameSounds();
  const { bestScore, updateBestScore } = useBestScore('balloon-pop');

  const generateBalloons = useCallback((target: TeluguLetter) => {
    const newBalloons: Balloon[] = [];
    const correctCount = 3 + Math.floor(Math.random() * 3); // 3-5 correct balloons
    const totalCount = 12;

    // Add correct balloons
    for (let i = 0; i < correctCount; i++) {
      newBalloons.push({
        id: Date.now() + i + Math.random(),
        letter: target.letter,
        x: Math.random() * 85 + 5, // Random horizontal position
        duration: 8 + Math.random() * 4, // 8-12 seconds to fly up
        delay: Math.random() * 3
      });
    }

    // Add wrong balloons
    for (let i = correctCount; i < totalCount; i++) {
      const wrongLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
      newBalloons.push({
        id: Date.now() + i + Math.random(),
        letter: wrongLetter.letter,
        x: Math.random() * 85 + 5,
        duration: 8 + Math.random() * 4,
        delay: Math.random() * 3
      });
    }

    setBalloons(newBalloons.sort(() => Math.random() - 0.5));
  }, []);

  const nextRound = useCallback(() => {
    const target = allLetters[Math.floor(Math.random() * allLetters.length)];
    setTargetLetter(target);
    generateBalloons(target);
  }, [generateBalloons]);

  useEffect(() => {
    nextRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isGameOver || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameOver(true);
          updateBestScore(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, timeLeft, score, updateBestScore]);

  const handleBalloonClick = (balloon: Balloon) => {
    if (!targetLetter || isGameOver) return;

    if (balloon.letter === targetLetter.letter) {
      playSuccess();
      setScore(s => s + 1);
      showToast('🎉 Correct!', 'success');
      setBalloons(prev => prev.filter(b => b.id !== balloon.id));
    } else {
      playFailure();
      showToast('❌ Wrong letter!', 'error');
    }
  };

  useEffect(() => {
    if (balloons.length > 0 && balloons.every(b => b.letter !== targetLetter?.letter)) {
      showToast(`🎊 Round complete! Next letter...`, 'success');
      setTimeout(nextRound, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balloons, targetLetter]);

  const handleRestart = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsGameOver(false);
    nextRound();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!targetLetter) return null;

  // Game Over Screen
  if (isGameOver) {
    const isNewBest = score > bestScore;
    return (
      <div className="min-h-[100svh] w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-indigo-50 relative">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-indigo-300 p-8 max-w-md w-full text-center">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">Time's Up!</h1>
          <div className="text-6xl mb-4">🎈</div>
          <div className="mb-6">
            <p className="text-2xl text-slate-600 mb-2">Your Score</p>
            <p className="text-5xl font-extrabold text-orange-500">{score}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg text-slate-600 mb-1">Best Score</p>
            <p className="text-3xl font-bold text-indigo-600">{isNewBest ? score : bestScore} {isNewBest && '🏆'}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
              🔄 Play Again
            </button>
            <button
              onClick={onExit}
              className="px-6 py-3 bg-gradient-to-br from-slate-400 to-slate-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] w-full flex flex-col items-center p-4 bg-gradient-to-b from-purple-50 to-indigo-50 relative overflow-hidden">
      <button
        onClick={onExit}
        className="absolute top-4 left-4 px-4 py-2 bg-white rounded-xl shadow text-slate-700 font-bold hover:bg-slate-100 z-10"
      >
        🏠 Home
      </button>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <div className="px-4 py-2 bg-white rounded-xl shadow text-slate-700 font-bold">
          ⏱️ {formatTime(timeLeft)}
        </div>
        <div className="px-4 py-2 bg-white rounded-xl shadow text-slate-700 font-bold">
          Score: {score}
        </div>
        <div className="px-3 py-1 bg-indigo-100 rounded-xl shadow text-indigo-700 text-sm font-semibold">
          Best: {bestScore}
        </div>
      </div>

      <header className="mt-16 mb-8 z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 drop-shadow">Balloon Pop</h1>
        <div className="mt-4 bg-white rounded-2xl shadow-xl border-4 border-indigo-300 px-6 py-4">
          <p className="text-lg text-slate-600">Find this letter:</p>
          <div className="text-5xl font-extrabold text-indigo-600 mt-2">{targetLetter.letter}</div>
          <p className="text-sm text-slate-500 mt-1">{targetLetter.name}</p>
        </div>
      </header>

      <main className="relative w-full h-[65svh] max-w-4xl overflow-hidden">
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            onClick={() => handleBalloonClick(balloon)}
            className="absolute bottom-0 rounded-full bg-gradient-to-br from-pink-400 to-red-500 shadow-2xl border-2 border-white text-white font-extrabold text-3xl w-20 h-24 flex items-center justify-center hover:scale-110 transition-transform"
            style={{
              left: `${balloon.x}%`,
              animation: `fly-up ${balloon.duration}s linear ${balloon.delay}s infinite`,
            }}
          >
            {balloon.letter}
          </button>
        ))}
      </main>
    </div>
  );
};

export default BalloonPopGame;

