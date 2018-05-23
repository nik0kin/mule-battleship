import * as _ from 'lodash';
import { Action, VariableMap } from 'mule-sdk-js';

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

export function getPlaceShipsAction(existingAction: Action | undefined, newShipPlacement: ShipPlacement) {
  const existingShipPlacements: ShipPlacement[] = (existingAction && existingAction.params.shipPlacements as ShipPlacement[]) || [];

  const newParams: PlaceShipsMuleActionParams = {
    shipPlacements: _.uniqBy(
      [
        newShipPlacement,
        ...existingShipPlacements,
      ],
      'shipId',
    )
  };

  return {
    type: 'PlaceShips',
    params: newParams as any as VariableMap,
  } as Action;
}

export function isPlaceShipsAction(action: Action): boolean {
  return action.type === 'PlaceShips';
}

export function getPlaceShipsParamsFromAction(action: Action): PlaceShipsMuleActionParams {
  return action.params as any as PlaceShipsMuleActionParams;
}
