
import { Coord } from '../../shared';
import { GameState } from './index';

export interface StoreState {
  ui: {
    selectedCoord?: Coord;
  };
  gameState: GameState;
  pendingTurn: {
  //  actions: Action[]
  };
}

