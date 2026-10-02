import { PlayerCode, PlayerTheme } from './player.model';

export type CellPosition = {
  row: number;
  column: number;
};
export type CellValue = PlayerCode | null;
export type Board = CellValue[][];

export const BOARD_ROWS = 6;
export const BOARD_COLUMNS = 7;
export const CONNECT_LENGTH = 4;
export const TURN_DURATION_SECONDS = 30;
export const WIN_DIRECTIONS: CellPosition[] = [
  {
    row: 0,
    column: 1,
  },
  {
    row: 1,
    column: 0,
  },
  {
    row: 1,
    column: 1,
  },
  {
    row: 1,
    column: -1,
  },
];
export type WinCells = [CellPosition, CellPosition, CellPosition, CellPosition];

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLUMNS }, () => null),
  );
}

export function findLandingRow(board: Board, column: number) {
  for (let row = BOARD_ROWS - 1; row >= 0; row--) {
    if (board[row][column] === null) return row;
  }
  return -1;
}

export interface CellData {
  id: string;
  position: CellPosition;
  theme: PlayerTheme;
}
