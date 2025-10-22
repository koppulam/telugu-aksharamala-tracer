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
      <div className="min-h-[100svh] w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-teal-50 relative">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-teal-300 p-8 max-w-md w-full text-center">
          <h1 className="text-4xl font-extrabold text-teal-600 mb-4">Time's Up!</h1>
          <div className="text-6xl mb-4">🎉</div>
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
              className="px-6 py-3 bg-gradient-to-br from-teal-500 to-green-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
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
    <div className="min-h-[100svh] w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-teal-50 relative">
      <button
        onClick={onExit}
        className="absolute top-4 left-4 px-4 py-2 bg-white rounded-xl shadow text-slate-700 font-bold hover:bg-slate-100"
      >
        🏠 Home
      </button>

      <div className="absolute top-4 right-4 flex flex-col gap-2">
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

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-teal-600 drop-shadow">Picture Match</h1>
        <p className="text-lg text-slate-600 mt-2">Which letter does this start with?</p>
      </header>

      <main className="flex flex-col items-center gap-8">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-teal-200 p-8 flex flex-col items-center gap-4">
          <div className="text-8xl">{currentLetter.emoji}</div>
          <div className="text-xl text-slate-600">{currentLetter.wordMeaning}</div>
          <button
            onClick={handleSpeak}
            className="mt-2 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
            aria-label="Listen to word pronunciation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(opt)}
              className="bg-gradient-to-br from-teal-400 to-green-500 text-white rounded-2xl shadow-xl p-6 text-4xl font-extrabold hover:scale-105 transition-transform"
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

