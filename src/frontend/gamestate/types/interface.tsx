
import { Ship, Coord, Grid, Square, Shot } from '../../../shared';

import { Player, PlayerMap } from '../../types';

export interface GameState {
  mule: {
    currentPlayer: Player;
    players: PlayerMap;
    currentTurn: number;
  };

  width: number;
  height: number;
  yourGrid: Grid<Square>;
  theirGrid: Grid<Square>;

  isPlacementMode: boolean;

  yourShips: Ship[];
  theirShips: Ship[];

  yourShots: Shot[];
  theirShots: Shot[];
}
