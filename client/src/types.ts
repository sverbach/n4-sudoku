import type { DiffId } from './lib/diffs';

export interface Game {
  difficulty: DiffId;
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
  selStyle: 'invert' | 'ring';
  numFont: 'martian' | 'mono';
}
