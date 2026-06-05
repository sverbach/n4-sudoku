'use strict';

import sudoku from './sudoku-core.js';

function boardToArray(board: string): number[] {
  return Array.from(board).map(c => c === sudoku.BLANK_CHAR ? 0 : parseInt(c, 10));
}

export function generate(difficulty: string): { puzzle: number[]; solution: number[]; clues: number; difficulty: string } {
  const puzzleStr = sudoku.generate(difficulty);
  const solutionStr = sudoku.solve(puzzleStr);
  if (!solutionStr) throw new Error('Generated puzzle has no solution');
  const puzzle = boardToArray(puzzleStr);
  const solution = boardToArray(solutionStr);
  const clues = puzzle.filter(v => v !== 0).length;
  return { puzzle, solution, clues, difficulty };
}

export function conflicts(values: number[]): Set<number> {
  const bad = new Set<number>();
  const check = (cells: number[]) => {
    const seen: Record<number, number> = {};
    for (const i of cells) {
      const v = values[i];
      if (!v) continue;
      if (seen[v] != null) { bad.add(i); bad.add(seen[v]); }
      else seen[v] = i;
    }
  };
  for (let r = 0; r < 9; r++) {
    const row: number[] = [], col: number[] = [];
    for (let k = 0; k < 9; k++) { row.push(r * 9 + k); col.push(k * 9 + r); }
    check(row); check(col);
  }
  for (let br = 0; br < 3; br++)
    for (let bc = 0; bc < 3; bc++) {
      const box: number[] = [];
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) box.push((br * 3 + i) * 9 + (bc * 3 + j));
      check(box);
    }
  return bad;
}

export function isComplete(values: number[]): boolean {
  for (let i = 0; i < 81; i++) if (!values[i]) return false;
  return conflicts(values).size === 0;
}

export function counts(values: number[]): number[] {
  const c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 81; i++) if (values[i]) c[values[i]]++;
  return c;
}
