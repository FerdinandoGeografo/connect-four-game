import {
  Board,
  BOARD_COLUMNS,
  BOARD_ROWS,
  CellPosition,
  CONNECT_LENGTH,
  findLandingRow,
  WIN_DIRECTIONS,
  WinCells,
} from '../models/board.model';
import { PlayerCode } from '../models/player.model';

export interface DiscPlacement {
  board: Board;
  position: CellPosition;
}

export function getOpponent(player: PlayerCode): PlayerCode {
  return player === 'first' ? 'second' : 'first';
}

export function getPlayableColumns(board: Board): number[] {
  return Array.from({ length: BOARD_COLUMNS }, (_, column) => column).filter(
    (column) => board[0][column] === null,
  );
}

export function isBoardFull(board: Board): boolean {
  return board[0].every((cell) => cell !== null);
}

/** Returns a new board with the player's disc in the lowest free row, or null if the column is full. */
export function placeDisc(board: Board, column: number, player: PlayerCode): DiscPlacement | null {
  const row = findLandingRow(board, column);
  if (row === -1) return null;

  const nextBoard = board.map((boardRow, rowIndex) =>
    rowIndex !== row
      ? boardRow
      : boardRow.map((cell, colIndex) => (colIndex === column ? player : cell)),
  );
  return { board: nextBoard, position: { row, column } };
}

/** Looks for a line of CONNECT_LENGTH discs through the given cell. */
export function findWin(board: Board, { row, column }: CellPosition, player: PlayerCode): WinCells | null {
  for (const { row: dRow, column: dCol } of WIN_DIRECTIONS) {
    const forward = collectLine(board, row, column, dRow, dCol, player);
    const backward = collectLine(board, row, column, -dRow, -dCol, player);

    if (1 + forward.length + backward.length >= CONNECT_LENGTH) {
      const line = [...backward.reverse(), { row, column }, ...forward];
      return line.slice(0, CONNECT_LENGTH) as WinCells;
    }
  }
  return null;
}

/** CPU heuristic: win, else block the opponent's win, else play closest to the centre. */
export function chooseCpuColumn(
  board: Board,
  cpu: PlayerCode,
  random: () => number = Math.random,
): number | null {
  const playable = getPlayableColumns(board);
  if (!playable.length) return null;

  const winsWith = (player: PlayerCode) => (column: number) => {
    const placement = placeDisc(board, column, player);
    return !!placement && !!findWin(placement.board, placement.position, player);
  };

  const winning = playable.find(winsWith(cpu));
  if (winning !== undefined) return winning;

  const blocking = playable.find(winsWith(getOpponent(cpu)));
  if (blocking !== undefined) return blocking;

  const center = Math.floor(BOARD_COLUMNS / 2);
  const distance = (column: number) => Math.abs(column - center);
  const minDistance = Math.min(...playable.map(distance));
  const best = playable.filter((column) => distance(column) === minDistance);
  return best[Math.floor(random() * best.length)];
}

function collectLine(
  board: Board,
  startRow: number,
  startCol: number,
  dRow: number,
  dCol: number,
  player: PlayerCode,
): CellPosition[] {
  const cells: CellPosition[] = [];
  let r = startRow + dRow;
  let c = startCol + dCol;

  while (r >= 0 && r < BOARD_ROWS && c >= 0 && c < BOARD_COLUMNS && board[r][c] === player) {
    cells.push({ row: r, column: c });
    r += dRow;
    c += dCol;
  }
  return cells;
}
