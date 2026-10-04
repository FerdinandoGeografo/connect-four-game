import { GameMode } from './game.model';

export type PlayerCode = 'first' | 'second';
export type PlayerIconCode = 'player-1' | 'player-2' | 'cpu' | 'you';
export type PlayerType = 'human' | 'cpu';
export type PlayerTheme = 'var(--red-500)' | 'var(--yellow-500)';
export type PlayerThemeText = 'var(--neutral-0)' | 'var(--neutral-900)';

export interface Player {
  type: PlayerType;
  label: string;
  icon: PlayerIconCode;
  turnLabel: string;
  winVerb: 'wins' | 'win';
  theme: PlayerTheme;
  themeText: PlayerThemeText;
}

export type GamePlayers = Record<PlayerCode, Player>;
export type ScorePlayers = Record<PlayerCode, number>;

const INITIAL_PLAYERS_PVP: GamePlayers = {
  first: {
    type: 'human',
    label: 'Player 1',
    icon: 'player-1',
    turnLabel: "Player 1's turn",
    winVerb: 'wins',
    theme: 'var(--red-500)',
    themeText: 'var(--neutral-0)',
  },
  second: {
    type: 'human',
    label: 'Player 2',
    icon: 'player-2',
    turnLabel: "Player 2's turn",
    winVerb: 'wins',
    theme: 'var(--yellow-500)',
    themeText: 'var(--neutral-900)',
  },
};

const INITIAL_PLAYERS_PVCPU: GamePlayers = {
  first: {
    type: 'human',
    label: 'You',
    icon: 'you',
    turnLabel: 'Your turn',
    winVerb: 'win',
    theme: 'var(--red-500)',
    themeText: 'var(--neutral-0)',
  },
  second: {
    type: 'cpu',
    label: 'CPU',
    icon: 'cpu',
    turnLabel: "CPU's turn",
    winVerb: 'wins',
    theme: 'var(--yellow-500)',
    themeText: 'var(--neutral-900)',
  },
};

export function getPlayersByMode(mode: GameMode): GamePlayers {
  return mode === 'pvp' ? INITIAL_PLAYERS_PVP : INITIAL_PLAYERS_PVCPU;
}
