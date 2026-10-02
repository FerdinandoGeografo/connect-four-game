import { GameMode } from './game.model';

export type PlayerCode = 'first' | 'second';
export type PlayerIconCode = 'player-1' | 'player-2' | 'cpu' | 'you';
export type PlayerType = 'human' | 'cpu';
export type PlayerTheme = 'var(--red-500)' | 'var(--yellow-500)';

export interface Player {
  type: PlayerType;
  label: string;
  icon: PlayerIconCode;
  turnLabel: string;
  theme: PlayerTheme;
}

export type GamePlayers = Record<PlayerCode, Player>;
export type ScorePlayers = Record<PlayerCode, number>;

const INITIAL_PLAYERS_PVP: GamePlayers = {
  first: {
    type: 'human',
    label: 'Player 1',
    icon: 'player-1',
    turnLabel: "Player 1's turn",
    theme: 'var(--red-500)',
  },
  second: {
    type: 'human',
    label: 'Player 2',
    icon: 'player-2',
    turnLabel: "Player 2's turn",
    theme: 'var(--yellow-500)',
  },
};

const INITIAL_PLAYERS_PVCPU: GamePlayers = {
  first: {
    type: 'human',
    label: 'You',
    icon: 'you',
    turnLabel: 'Your turn',
    theme: 'var(--red-500)',
  },
  second: {
    type: 'cpu',
    label: 'CPU',
    icon: 'cpu',
    turnLabel: "Cpu's turn",
    theme: 'var(--yellow-500)',
  },
};

export function getPlayersByMode(mode: GameMode): GamePlayers {
  return mode === 'pvp' ? INITIAL_PLAYERS_PVP : INITIAL_PLAYERS_PVCPU;
}
