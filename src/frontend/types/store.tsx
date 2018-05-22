
import { Action } from 'mule-sdk-js';
import { Coord } from '../../shared';
import { GameState } from './index';

export interface StoreState {
  ui: {
    selectedCoord?: Coord;
    selectedShipBeingPlaced?: number;
  };
  gameState: GameState;
  pendingTurn: {
    actions: Action[]
  };
}

