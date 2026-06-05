export function peersOf(cellIndex: number | null): Set<number> {
  if (cellIndex == null) return new Set();
  const selectedRow = (cellIndex / 9) | 0, selectedCol = cellIndex % 9;
  const boxRow = (selectedRow / 3 | 0) * 3, boxCol = (selectedCol / 3 | 0) * 3;
  const result = new Set<number>();
  for (let index = 0; index < 9; index++) { result.add(selectedRow * 9 + index); result.add(index * 9 + selectedCol); }
  for (let row = boxRow; row < boxRow + 3; row++) for (let col = boxCol; col < boxCol + 3; col++) result.add(row * 9 + col);
  result.delete(cellIndex);
  return result;
}

export function formatTime(seconds: number): string {
  const minutes = (seconds / 60) | 0, remainingSeconds = seconds % 60;
  return String(minutes).padStart(2, '0') + ':' + String(remainingSeconds).padStart(2, '0');
}

export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const NUMBER_FONTS: Record<'martian' | 'mono', string> = {
  martian: "'Martian Mono', monospace",
  mono: "'JetBrains Mono', monospace",
};
