
import * as constants from '../constants';
import { Coord } from '../../shared';

// UI

export interface ClickSquare {
  type: constants.CLICK_SQUARE;
  lobbyPlayerId: string; // which grid? (p1 or p2)
  x: number;
  y: number;
}

export function clickSquare(lobbyPlayerId: string, coord: Coord): ClickSquare {
  return {
    type: constants.CLICK_SQUARE,
    lobbyPlayerId,
    x: coord.x,
    y: coord.y,
  };
}

export interface ClickSubmit {
  type: constants.CLICK_SUBMIT;
}

export function clickSubmit(): ClickSubmit {
  return {
    type: constants.CLICK_SUBMIT,
  };
}

export interface SelectShipListShip {
  type: constants.SELECT_SHIPLIST_SHIP;
  shipId: number;
}

export function selectShipListShip(shipId: number): SelectShipListShip {
  return {
    type: constants.SELECT_SHIPLIST_SHIP,
    shipId,
  };
}

// Mule Actions

export interface RemovePendingAction {
  type: constants.REMOVE_PENDING_ACTION;
  index: number;
}

export function removePendingAction(index: number): RemovePendingAction {
  return {
    type: constants.REMOVE_PENDING_ACTION,
    index,
  };
}


