export const DIFFS = [
  { id: 'easy',      label: 'EASY',      sub: '42 GIVENS' },
  { id: 'medium',    label: 'MEDIUM',    sub: '34 GIVENS' },
  { id: 'hard',      label: 'HARD',      sub: '30 GIVENS' },
  { id: 'very-hard', label: 'VERY HARD', sub: '25 GIVENS' },
] as const;

export type DifficultyId = typeof DIFFS[number]['id'];

export function difficultyLabel(id: DifficultyId): string {
  return DIFFS.find((diff) => diff.id === id)?.label ?? '';
}
