import type { Game } from '../types';
import type { DifficultyId } from './diffs';

export interface ShareGameState {
  v: 1;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  givens: string;
  values: string;
  notes: number[][];
  timer: number;
}

function mapDifficultyIdToShare(difficultyId: DifficultyId): 'easy' | 'medium' | 'hard' | 'expert' {
  const map: Record<DifficultyId, 'easy' | 'medium' | 'hard' | 'expert'> = {
    easy: 'easy',
    medium: 'medium',
    hard: 'hard',
    'very-hard': 'expert',
  };
  return map[difficultyId];
}

function mapShareToDifficultyId(difficulty: 'easy' | 'medium' | 'hard' | 'expert'): DifficultyId {
  const map: Record<'easy' | 'medium' | 'hard' | 'expert', DifficultyId> = {
    easy: 'easy',
    medium: 'medium',
    hard: 'hard',
    expert: 'very-hard',
  };
  return map[difficulty];
}

export function serializeGame(game: Game): ShareGameState {
  const givens = game.givenMask
    .map((isGiven, index) => (isGiven ? String(game.solution[index]) : '.'))
    .join('');

  const values = game.values
    .map((value) => (value === 0 ? '.' : String(value)))
    .join('');

  return {
    v: 1,
    difficulty: mapDifficultyIdToShare(game.difficulty),
    givens,
    values,
    notes: game.notes,
    timer: game.seconds,
  };
}

export function deserializeGame(
  raw: ShareGameState,
): Pick<Game, 'difficulty' | 'givenMask' | 'values' | 'notes' | 'seconds'> {
  const givenMask = raw.givens.split('').map((char) => char !== '.');
  const values = raw.values.split('').map((char) => (char === '.' ? 0 : parseInt(char, 10)));

  return {
    difficulty: mapShareToDifficultyId(raw.difficulty),
    givenMask,
    values,
    notes: raw.notes,
    seconds: raw.timer,
  };
}

export function previewText(raw: ShareGameState): string {
  const label = raw.difficulty.toUpperCase();
  const minutes = Math.floor(raw.timer / 60);
  const remainingSeconds = raw.timer % 60;
  const timeStr = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  const cellsFilled = raw.values.split('').filter((char) => char !== '.').length;
  return `${label} · ${timeStr} elapsed · ${cellsFilled} cells filled`;
}
