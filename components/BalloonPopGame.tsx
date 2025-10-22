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
        x: Math.random() * 70 + 10, // Random horizontal position (10-80% to avoid edges)
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
        x: Math.random() * 70 + 10, // Keep balloons away from edges
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
      <div className="min-h-[100svh] w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 text-6xl opacity-20">🎈</div>
          <div className="absolute bottom-40 left-10 text-7xl opacity-20">⭐</div>
          <div className="absolute top-1/3 left-1/4 text-5xl opacity-20">🌟</div>
        </div>
        <div className="bg-white rounded-[40px] shadow-2xl border-8 border-indigo-400 p-10 max-w-md w-full text-center relative animate-bounce-once">
          <h1 className="text-5xl font-black text-indigo-600 mb-4 animate-pulse">Time's Up!</h1>
          <div className="text-8xl mb-6 animate-bounce">{isNewBest ? '🏆' : '🎈'}</div>
          <div className="mb-8 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-6 border-4 border-orange-300">
            <p className="text-2xl font-bold text-orange-600 mb-2">Your Score</p>
            <p className="text-7xl font-black text-orange-600">{score}</p>
          </div>
          <div className="mb-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-4 border-4 border-purple-300">
            <p className="text-xl font-bold text-purple-600 mb-1">Best Score</p>
            <p className="text-5xl font-black text-purple-700">{isNewBest ? score : bestScore} {isNewBest && '👑'}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-xl shadow-xl hover:scale-110 transition-all border-4 border-white"
            >
              🔄 Play Again
            </button>
            <button
              onClick={onExit}
              className="px-8 py-4 bg-gradient-to-br from-orange-500 to-pink-600 text-white rounded-2xl font-black text-xl shadow-xl hover:scale-110 transition-all border-4 border-white"
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] w-full flex flex-col items-center p-4 bg-gradient-to-br from-purple-200 via-pink-100 to-indigo-200 relative overflow-hidden pt-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-5xl opacity-10 animate-pulse">🎈</div>
        <div className="absolute bottom-40 right-20 text-6xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}>🎪</div>
      </div>

      <button
        onClick={onExit}
        className="absolute top-4 left-4 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-br from-orange-500 to-pink-600 text-white rounded-2xl shadow-xl font-black hover:scale-110 transition-all border-4 border-white z-10 text-sm sm:text-base"
      >
        🏠 Home
      </button>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <div className="px-3 py-2 sm:px-5 sm:py-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl text-white font-black text-sm sm:text-lg border-4 border-white">
          ⏱️ {formatTime(timeLeft)}
        </div>
        <div className="px-3 py-2 sm:px-5 sm:py-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl shadow-xl text-white font-black text-sm sm:text-lg border-4 border-white">
          🌟 {score}
        </div>
        <div className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl shadow-lg text-white text-xs sm:text-sm font-bold border-3 border-white">
          Best: {bestScore}
        </div>
      </div>

      <div className="absolute left-4 top-24 sm:top-32 z-10">
        <div className="bg-white rounded-[20px] sm:rounded-[24px] shadow-2xl border-4 sm:border-6 border-indigo-400 px-4 py-3 sm:px-6 sm:py-4 relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-pink-300/30 rounded-full blur-xl"></div>
          <p className="text-lg sm:text-xl font-black text-indigo-600 mb-2">👆 Touch</p>
          <div className="text-5xl sm:text-6xl font-black text-indigo-700 animate-pulse">{targetLetter.letter}</div>
        </div>
      </div>

      <header className="mt-2 mb-6 z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-indigo-700 drop-shadow-lg">🎈 Balloon Pop</h1>
      </header>

      <main className="relative w-full h-[65svh] max-w-4xl overflow-hidden">
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            onClick={() => handleBalloonClick(balloon)}
            className="absolute bottom-0 rounded-full bg-gradient-to-br from-pink-400 via-rose-500 to-red-600 shadow-2xl border-4 border-white text-white font-black text-4xl w-24 h-28 flex items-center justify-center hover:scale-125 hover:rotate-12 transition-all"
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

