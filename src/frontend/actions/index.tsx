
import * as constants from '../constants';
import { Coord } from '../../shared';

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


