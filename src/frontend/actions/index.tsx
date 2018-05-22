
import * as constants from '../constants';
import { Coord } from '../../shared';

// UI

export interface ClickSquare {
  type: constants.CLICK_SQUARE;
  x: number;
  y: number;
}

export function clickSquare(coord: Coord): ClickSquare {
  return {
    type: constants.CLICK_SQUARE,
    x: coord.x,
    y: coord.y,
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


