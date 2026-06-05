import type { DifficultyId } from './lib/diffs';

export interface Game {
  difficulty: DifficultyId;
  givenMask: boolean[];
  values: number[];
  notes: number[][];
  solution: number[];
  seconds: number;
  won: boolean;
}

export interface Settings {
  accent: string;
  theme: 'light' | 'dark';
  peers: boolean;
  selectionStyle: 'invert' | 'ring';
  numberFont: 'martian' | 'mono';
}
