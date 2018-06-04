import { every, reduce } from 'lodash';
/*
import { Action, GameState, VariableMap } from 'mule-sdk-js';
*/
import {
  Coord, getCoordString, getShipStructureCoords,
  Ship, Shot,
} from '../';

export const FIRE_SHOT_MULE_ACTION: string = 'FireShot';

export interface FireShotMuleActionParams {
  shotCoord: Coord;
}

export function isShipSunk(ship: Ship, shots: Shot[]): boolean {
  const shotHitsByCoord: {[stringCoord: string]: boolean} = reduce(
    shots,
    (prev: {[stringCoord: string]: boolean}, shot: Shot) => {
      prev[getCoordString(shot.coord)] = true;
      return prev;
    },
    {},
  );
  return every(
    getShipStructureCoords(ship),
    (coord: Coord) => shotHitsByCoord[getCoordString(coord)],
  );
}
