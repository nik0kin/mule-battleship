import { Action } from 'mule-sdk-js';

import { Coord } from '../mule-common';

import { Alignment } from './ship';

export type PlaceShipsMuleAction = 'PlaceShips';

export interface PlaceShipsMuleActionParams {
  shipPlacements: ShipPlacement[];
}

export interface ShipPlacement {
  shipId: number;
  coord: Coord;
  alignment: Alignment;
}

