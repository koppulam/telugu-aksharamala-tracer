import React, { useState, useEffect, useCallback } from 'react';
import type { TeluguLetter } from '../types';
import { achulu, hallulu } from '../constants';
import { useToast } from './Toast';
import { useGameSounds } from '../hooks/useGameSounds';
import { useBestScore } from '../hooks/useBestScore';

interface PictureMatchGameProps {
  onExit: () => void;
}

const allLetters = [...achulu, ...hallulu].filter(l => l.word && l.emoji);
const GAME_DURATION = 120; // 2 minutes in seconds

const PictureMatchGame: React.FC<PictureMatchGameProps> = ({ onExit }) => {
  const [score, setScore] = useState(0);
  const [currentLetter, setCurrentLetter] = useState<TeluguLetter | null>(null);
  const [options, setOptions] = useState<TeluguLetter[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const { showToast } = useToast();
  const { playSuccess, playFailure } = useGameSounds();
  const { bestScore, updateBestScore } = useBestScore('picture-match');

  const generateRound = useCallback(() => {
    if (allLetters.length === 0) return;

    const correct = allLetters[Math.floor(Math.random() * allLetters.length)];
    const wrongOptions = allLetters
      .filter(l => l.letter !== correct.letter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const shuffled = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentLetter(correct);
    setOptions(shuffled);
  }, []);

  useEffect(() => {
    generateRound();
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

  const handleChoice = (choice: TeluguLetter) => {
    if (!currentLetter || isGameOver) return;

    if (choice.letter === currentLetter.letter) {
      playSuccess();
      setScore(s => s + 1);
      showToast(`✅ Correct! ${currentLetter.word}`, 'success');
      setTimeout(generateRound, 1200);
    } else {
      playFailure();
      showToast(`❌ Try again!`, 'error');
    }
  };

  const handleSpeak = () => {
    if (!currentLetter) return;
    // Placeholder until audio files are uploaded
    showToast('Coming soon: audio pronunciation', 'info');
    // Future: play audio file for currentLetter.word
  };

  const handleRestart = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsGameOver(false);
    generateRound();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentLetter) return null;

  // Game Over Screen
  if (isGameOver) {
    const isNewBest = score > bestScore;
    return (
      <div className="min-h-[100svh] w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-200 via-teal-200 to-cyan-200 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 text-6xl opacity-20">🎉</div>
          <div className="absolute bottom-40 right-10 text-7xl opacity-20">⭐</div>
          <div className="absolute top-1/3 right-1/4 text-5xl opacity-20">🌟</div>
        </div>
        <div className="bg-white rounded-[40px] shadow-2xl border-8 border-teal-400 p-10 max-w-md w-full text-center relative animate-bounce-once">
          <h1 className="text-5xl font-black text-teal-600 mb-4 animate-pulse">Time's Up!</h1>
          <div className="text-8xl mb-6 animate-bounce">{isNewBest ? '🏆' : '🎉'}</div>
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
              className="px-8 py-4 bg-gradient-to-br from-teal-500 to-green-600 text-white rounded-2xl font-black text-xl shadow-xl hover:scale-110 transition-all border-4 border-white"
            >
              🔄 Play Again
            </button>
            <button
              onClick={onExit}
              className="px-8 py-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl font-black text-xl shadow-xl hover:scale-110 transition-all border-4 border-white"
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-200 via-teal-100 to-cyan-200 relative overflow-hidden pt-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 text-4xl opacity-10 animate-pulse">🎨</div>
        <div className="absolute bottom-20 left-10 text-5xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}>🌈</div>
      </div>

      <button
        onClick={onExit}
        className="absolute top-4 left-4 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl shadow-xl font-black hover:scale-110 transition-all border-4 border-white z-10 text-sm sm:text-base"
      >
        🏠 Home
      </button>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <div className="px-3 py-2 sm:px-5 sm:py-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl text-white font-black text-sm sm:text-lg border-4 border-white">
          ⏱️ {formatTime(timeLeft)}
        </div>
        <div className="px-3 py-2 sm:px-5 sm:py-3 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl shadow-xl text-white font-black text-sm sm:text-lg border-4 border-white">
          🌟 {score}
        </div>
        <div className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg text-white text-xs sm:text-sm font-bold border-3 border-white">
          Best: {bestScore}
        </div>
      </div>

      <header className="mb-6 relative z-10">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-teal-700 drop-shadow-lg mb-2">🖼️ Picture Match</h1>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-700">Which letter does this start with?</p>
      </header>

      <main className="flex flex-col items-center gap-8 relative z-10">
        <div className="bg-white rounded-[32px] shadow-2xl border-8 border-teal-400 p-8 flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300/30 rounded-full blur-2xl"></div>
          <div className="text-9xl animate-bounce">{currentLetter.emoji}</div>
          <div className="text-2xl font-black text-teal-700 bg-gradient-to-r from-teal-100 to-cyan-100 px-6 py-3 rounded-2xl border-4 border-teal-300">{currentLetter.wordMeaning}</div>
          <button
            onClick={handleSpeak}
            className="mt-2 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white rounded-full p-5 shadow-2xl hover:scale-125 transition-all border-4 border-white animate-pulse"
            aria-label="Listen to word pronunciation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5 w-full max-w-md">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(opt)}
              className="bg-gradient-to-br from-teal-400 via-green-400 to-emerald-500 text-white rounded-3xl shadow-2xl p-8 text-5xl font-black hover:scale-110 hover:rotate-3 transition-all border-6 border-white"
            >
              {opt.letter}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PictureMatchGame;

