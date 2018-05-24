import * as _ from 'lodash';
import { Action } from 'mule-sdk-js';

import {
  Alignment, Coord,
  getShipsFromPendingActions, getShipOnSquare, getPlaceShipsActionParamsFromMuleAction,
  getPlaceShipsActionWithNewShipPlacement, getPlaceShipsMuleActionFromParams, getRotatedAlignment,
  isAnyShipOnSquare,
  PlaceShipsMuleAction, PlaceShipsMuleActionParams, Ship, ShipPlacement,
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
          getPlaceShipsActionWithNewShipPlacement(state.pendingTurn.actions[0], newShipPlacement) // actions[0] will be undefined or a PlaceShips action
        ]
      }
    };
  }

  // if not being placed, but is clicked (rotate)
  if (state.gameState.isPlacementMode && !state.ui.selectedShipBeingPlaced && clickSquareAction.lobbyPlayerId === 'p1') {

    const ship: Ship | undefined = getShipOnSquare({ x: state.gameState.width, y: state.gameState.height }, coord, getShipsFromPendingActions('p1', state.gameState.yourShips, state.pendingTurn.actions));

    if (ship) {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedShipBeingPlaced: undefined,
        },
        pendingTurn: {
          actions: [
            getPlaceShipsActionWithRotation(state.pendingTurn.actions[0], ship.id) // actions[0] will be undefined or a PlaceShips action
          ]
        }
      };
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

function getPlaceShipsActionWithRotation(pendingPlacementAction: Action, shipId: number): Action {
  const placeShipsActionParams: PlaceShipsMuleActionParams = getPlaceShipsActionParamsFromMuleAction(pendingPlacementAction);

  const newParams: PlaceShipsMuleActionParams = {
    shipPlacements: _.map(placeShipsActionParams.shipPlacements, (shipPlacement: ShipPlacement) => {
      if (shipPlacement.shipId === shipId) {
        return {
          shipId,
          coord: shipPlacement.coord,
          alignment: getRotatedAlignment(shipPlacement.alignment)
        };
      } else {
        return shipPlacement;
      }
    })
  };

  return getPlaceShipsMuleActionFromParams(newParams);
}
