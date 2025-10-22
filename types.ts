
export interface Point {
  x: number;
  y: number;
}

export interface TeluguLetter {
  letter: string;
  name: string;
  phonetic: string;
  path: Point[][];
  word?: string; // Telugu word starting with this letter
  wordMeaning?: string; // English meaning
  emoji?: string; // Emoji representation for the word
}

export type GameMode = 'home' | 'trace' | 'pictureMatch' | 'balloonPop';
