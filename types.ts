
export interface Point {
  x: number;
  y: number;
}

export interface TeluguLetter {
  letter: string;
  name: string;
  phonetic: string;
  path: Point[][];
}
