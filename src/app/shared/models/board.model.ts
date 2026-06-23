import { PlayerCode, PlayerTheme } from './player.model';

export type CellValue = PlayerCode | null;
export type Board = CellValue[][];

export const BOARD_ROWS = 6;
export const BOARD_COLUMNS = 7;
export const CONNECT_LENGTH = 4;
export const TURN_DURATION_SECONDS = 10;

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLUMNS }, () => null),
  );
}

export interface CellData {
  id: string;
  row: number;
  column: number;
  theme: PlayerTheme;
}
