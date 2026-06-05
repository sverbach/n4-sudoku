// sudoku.js — generator / solver / uniqueness check. Pure, offline, no deps.
// Exposes window.Sudoku.
(function () {
  'use strict';

  function isValid(g, idx, val) {
    const r = (idx / 9) | 0, c = idx % 9;
    for (let k = 0; k < 9; k++) {
      if (g[r * 9 + k] === val) return false;
      if (g[k * 9 + c] === val) return false;
    }
    const br = (r / 3 | 0) * 3, bc = (c / 3 | 0) * 3;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (g[(br + i) * 9 + (bc + j)] === val) return false;
    return true;
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Fill an empty grid with a complete valid solution (randomised backtracking).
  function fill(g) {
    const idx = g.indexOf(0);
    if (idx === -1) return true;
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let i = 0; i < 9; i++) {
      const n = nums[i];
      if (isValid(g, idx, n)) {
        g[idx] = n;
        if (fill(g)) return true;
        g[idx] = 0;
      }
    }
    return false;
  }

  // Count solutions up to `cap` (early-exits). Used for uniqueness (cap = 2).
  function countSolutions(g, cap) {
    const idx = g.indexOf(0);
    if (idx === -1) return 1;
    let total = 0;
    for (let n = 1; n <= 9; n++) {
      if (isValid(g, idx, n)) {
        g[idx] = n;
        total += countSolutions(g, cap);
        g[idx] = 0;
        if (total >= cap) return total;
      }
    }
    return total;
  }

  function solvedGrid() {
    const g = new Array(81).fill(0);
    fill(g);
    return g;
  }

  // Difficulty → target number of givens (clues left).
  const TARGET = { easy: 42, medium: 34, hard: 30, 'very-hard': 25 };

  // Generate a puzzle with a unique solution by digging holes.
  function generate(difficulty) {
    const target = TARGET[difficulty] || 34;
    const solution = solvedGrid();
    const puzzle = solution.slice();
    const order = shuffle([...Array(81).keys()]);
    let clues = 81;
    for (let i = 0; i < order.length && clues > target; i++) {
      const idx = order[i];
      const backup = puzzle[idx];
      if (backup === 0) continue;
      puzzle[idx] = 0;
      // unique-solution test on a copy
      if (countSolutions(puzzle.slice(), 2) !== 1) {
        puzzle[idx] = backup; // restore — removing it broke uniqueness
      } else {
        clues--;
      }
    }
    return { puzzle, solution, clues, difficulty };
  }

  // Conflict set: indices whose value duplicates a peer (row/col/box). value!=0.
  function conflicts(values) {
    const bad = new Set();
    const check = (cells) => {
      const seen = {};
      for (const i of cells) {
        const v = values[i];
        if (!v) continue;
        if (seen[v] != null) { bad.add(i); bad.add(seen[v]); }
        else seen[v] = i;
      }
    };
    for (let r = 0; r < 9; r++) {
      const row = [], col = [];
      for (let k = 0; k < 9; k++) { row.push(r * 9 + k); col.push(k * 9 + r); }
      check(row); check(col);
    }
    for (let br = 0; br < 3; br++)
      for (let bc = 0; bc < 3; bc++) {
        const box = [];
        for (let i = 0; i < 3; i++)
          for (let j = 0; j < 3; j++) box.push((br * 3 + i) * 9 + (bc * 3 + j));
        check(box);
      }
    return bad;
  }

  function isComplete(values) {
    for (let i = 0; i < 81; i++) if (!values[i]) return false;
    return conflicts(values).size === 0;
  }

  // Count how many of each digit 1-9 are already placed (for numpad dimming).
  function counts(values) {
    const c = [0,0,0,0,0,0,0,0,0,0];
    for (let i = 0; i < 81; i++) if (values[i]) c[values[i]]++;
    return c;
  }

  window.Sudoku = { generate, conflicts, isComplete, counts, TARGET, isValid };
})();
