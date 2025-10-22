import { useState, useEffect, useCallback } from 'react';

export const useBestScore = (gameKey: string) => {
  const storageKey = `telugu-aksharamala-best-${gameKey}`;
  const [bestScore, setBestScore] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setBestScore(parseInt(stored, 10));
    }
  }, [storageKey]);

  const updateBestScore = useCallback((newScore: number) => {
    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem(storageKey, newScore.toString());
      return true; // New best score
    }
    return false;
  }, [bestScore, storageKey]);

  return { bestScore, updateBestScore };
};

