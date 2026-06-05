interface SudokuLib {
  DIGITS: string;
  BLANK_CHAR: string;
  BLANK_BOARD: string;
  generate(difficulty?: string | number, unique?: boolean): string;
  solve(board: string, reverse?: boolean): string | false;
  get_candidates(board: string): string[][] | false;
  validate_board(board: string): true | string;
  board_string_to_grid(board_string: string): string[][];
  board_grid_to_string(board_grid: string[][]): string;
  print_board(board: string): void;
}

declare const sudoku: SudokuLib;
export default sudoku;
