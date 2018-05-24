import * as _ from 'lodash';
import { Action, VariableMap } from 'mule-sdk-js';

import { Coord } from '../mule-common';

import { Alignment } from './alignment';

export type PlaceShipsMuleAction = 'PlaceShips';

export interface PlaceShipsMuleActionParams {
  shipPlacements: ShipPlacement[];
}

export interface ShipPlacement {
  shipId: number;
  coord: Coord;
  alignment: Alignment;
}

export function getPlaceShipsMuleActionFromParams(placeShipsMuleActionParams: PlaceShipsMuleActionParams): Action {
  return {
    type: 'PlaceShips',
    params: placeShipsMuleActionParams as any as VariableMap,
  } as Action;
}

export function getPlaceShipsActionParamsFromMuleAction(action?: Action): PlaceShipsMuleActionParams {
  return {
    shipPlacements: (action && action.params.shipPlacements as ShipPlacement[]) || []
  };
}

export function getPlaceShipsActionWithNewShipPlacement(existingAction: Action | undefined, newShipPlacement: ShipPlacement) {
  const existingShipPlacements: ShipPlacement[] = getPlaceShipsActionParamsFromMuleAction(existingAction).shipPlacements;

  const newParams: PlaceShipsMuleActionParams = {
    shipPlacements: _.uniqBy(
      [
        newShipPlacement,
        ...existingShipPlacements,
      ],
      'shipId',
    )
  };

  return getPlaceShipsMuleActionFromParams(newParams);
}

export function isPlaceShipsAction(action: Action): boolean {
  return action.type === 'PlaceShips';
}

export function getPlaceShipsParamsFromAction(action: Action): PlaceShipsMuleActionParams {
  return action.params as any as PlaceShipsMuleActionParams;
}
