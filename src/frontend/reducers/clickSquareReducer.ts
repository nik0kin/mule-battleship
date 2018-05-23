
import { Action } from 'mule-sdk-js';

import {
  Alignment, Coord,
  getShipsFromPendingActions, getPlaceShipsAction, isAnyShipOnSquare,
  PlaceShipsMuleAction, PlaceShipsMuleActionParams, ShipPlacement
} from '../../shared';

import {
  ClickSquare,
  SelectShipListShip,
  RemovePendingAction,
} from '../actions';
import { StoreState } from '../types';

export function clickSquareReducer(state: StoreState, clickSquareAction: ClickSquare) {
  const coord: Coord = {
    x: clickSquareAction.x,
    y: clickSquareAction.y,
  };

  if (state.gameState.isPlacementMode && state.ui.selectedShipBeingPlaced && clickSquareAction.lobbyPlayerId === 'p1') {

    const newShipPlacement: ShipPlacement = {
      shipId: state.ui.selectedShipBeingPlaced,
      coord,
      alignment: Alignment.Horizontal,
    };

    return {
      ...state,
      ui: {
        ...state.ui,
        selectedShipBeingPlaced: undefined,
      },
      pendingTurn: {
        actions: [
          getPlaceShipsAction(state.pendingTurn.actions[0], newShipPlacement) // actions[0] will be undefined or a PlaceShips action
        ]
      }
    };
  }

  // if not being placed, but is clicked (rotate)
  if (state.gameState.isPlacementMode && !state.ui.selectedShipBeingPlaced && clickSquareAction.lobbyPlayerId === 'p1') {

    // check if a ship occupies the coord
    if (isAnyShipOnSquare({ x: state.gameState.width, y: state.gameState.height }, coord, getShipsFromPendingActions('p1', state.gameState.yourShips, state.pendingTurn.actions))) {
      // rotate
      console.log('rotate');
    }
  }

  if (clickSquareAction.lobbyPlayerId === 'p2') {
    // TODO shots logic

    return {
      ...state,
      ui: {
        ...state.ui,
        selectedCoord: { // select square
          x: coord.x,
          y: coord.y,
        },
      },
    };
  }


  return state;
}
