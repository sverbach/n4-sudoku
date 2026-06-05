'use strict';

import sudoku from './sudoku-core.js';

function boardToArray(board: string): number[] {
  return Array.from(board).map(char => char === sudoku.BLANK_CHAR ? 0 : parseInt(char, 10));
}

export function generate(difficulty: string): { puzzle: number[]; solution: number[]; clues: number; difficulty: string } {
  const puzzleStr = sudoku.generate(difficulty);
  const solutionStr = sudoku.solve(puzzleStr);
  if (!solutionStr) throw new Error('Generated puzzle has no solution');
  const puzzle = boardToArray(puzzleStr);
  const solution = boardToArray(solutionStr);
  const clues = puzzle.filter(value => value !== 0).length;
  return { puzzle, solution, clues, difficulty };
}

export function conflicts(values: number[]): Set<number> {
  const conflictCells = new Set<number>();
  const check = (cells: number[]) => {
    const seen: Record<number, number> = {};
    for (const cellIndex of cells) {
      const value = values[cellIndex];
      if (!value) continue;
      if (seen[value] != null) { conflictCells.add(cellIndex); conflictCells.add(seen[value]); }
      else seen[value] = cellIndex;
    }
  };
  for (let row = 0; row < 9; row++) {
    const rowCells: number[] = [], colCells: number[] = [];
    for (let index = 0; index < 9; index++) { rowCells.push(row * 9 + index); colCells.push(index * 9 + row); }
    check(rowCells); check(colCells);
  }
  for (let boxRow = 0; boxRow < 3; boxRow++)
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const box: number[] = [];
      for (let rowOffset = 0; rowOffset < 3; rowOffset++)
        for (let colOffset = 0; colOffset < 3; colOffset++) box.push((boxRow * 3 + rowOffset) * 9 + (boxCol * 3 + colOffset));
      check(box);
    }
  return conflictCells;
}

export function isComplete(values: number[]): boolean {
  for (let index = 0; index < 81; index++) if (!values[index]) return false;
  return conflicts(values).size === 0;
}

export function counts(values: number[]): number[] {
  const digitCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let index = 0; index < 81; index++) if (values[index]) digitCounts[values[index]]++;
  return digitCounts;
}
