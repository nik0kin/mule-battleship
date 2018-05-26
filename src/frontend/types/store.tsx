
import { Action } from 'mule-sdk-js';
import { Coord } from '../../shared';
import { GameState } from './index';

export interface StoreState {
  ui: {
    selectedCoord?: Coord;
    selectedShipBeingPlaced?: number;
  };

  isGameStateLoaded: boolean;
  gameState: GameState;

  loadError?: Error;

  pendingTurn: {
    actions: Action[]
  };
}

