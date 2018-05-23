
import * as _ from 'lodash';
import { Action, BoardSpace, GameBoard, GameState, PieceState } from 'mule-sdk-js';

import { Coord, getCoordFromString, getCoordString, Grid } from './mule-common';
export * from './mule-common';

import {
  Alignment, BattleshipPlayerVariables, getPlaceShipsParamsFromAction,
  isPlaceShipsAction, PlaceShipsMuleActionParams, PlayerVariablesMap,
  Ship, ShipPlacement, ShipType, Shot, Square,
} from './types';
export * from './types';

export * from './utils';

export function getBoardSpaceFromSquare(square: Square): BoardSpace {
  return {
    id: getCoordString(square.coord),
    class: 'Square',
    attributes: {
      ownerId: square.ownerId,
    },
    edges: [],
  };
}

export function getGridFromGameBoard(gameBoard: GameBoard, playerRel: string): Grid<Square> {
  return new Grid<Square>(
    { x: 10, y: 10 }, // TODO dont hardcode
    (coord: Coord) => {
      const foundBoardSpace = _.find(gameBoard.board, (boardSpace: BoardSpace) => { // TODO not efficient - O(n^2)
        const _coord: Coord = getCoordFromString(boardSpace.id);
        return boardSpace.attributes && boardSpace.attributes.ownerId === playerRel &&
          coord.x === _coord.x && coord.y === _coord.y;
      });
      return {
        ownerId: playerRel,
        coord: coord,
        // might have other attributes later
      };
    }
  );
}

export function getPieceStateFromShip(ship: Ship): PieceState {
  return {
    _id: '',
    id: ship.id,
    class: String(ship.shipType),
    locationId: getCoordString(ship.coord),
    ownerId: String(ship.ownerId),
    attributes: {
      alignment: ship.alignment,
    }
  };
}

export function isShipType(pieceState: PieceState): boolean {
  return _.includes(_.values(ShipType), pieceState.class);
}

export function getShipTypeFromClass(_class: string): ShipType { // TODO there must be a simpler way...
  switch (_class) {
    case String(ShipType.Carrier): return ShipType.Carrier;
    case String(ShipType.Battleship): return ShipType.Battleship;
    case String(ShipType.Cruiser): return ShipType.Cruiser;
    case String(ShipType.Destroyer): return ShipType.Destroyer;
    case String(ShipType.Submarine): return ShipType.Submarine;
    default: throw new Error('unknown class: ' + _class);
  }
}

export function getShipFromPieceSpace(pieceState: PieceState): Ship {
  return {
    id: pieceState.id,
    ownerId: pieceState.ownerId,
    shipType: getShipTypeFromClass(pieceState.class),
    coord: getCoordFromString(pieceState.locationId),
    alignment: pieceState.attributes.alignment as Alignment
  };
}

export function getShipsFromGameState(gameState: GameState, playerRel: string): Ship[] {
  return gameState.pieces
    .filter(isShipType)
    .filter((pieceState: PieceState) => pieceState.ownerId === String(playerRel))
    .map(getShipFromPieceSpace);
}

export function getShotsFromGameState(gameState: GameState, playerRel: string): Shot[] {
  return gameState.playerVariables[playerRel].shots as Shot[];
}

export function getPlayerVariablesFromGameState(gameState: GameState): PlayerVariablesMap {
  return gameState.playerVariables as any as PlayerVariablesMap;
}

export function isPlacementMode(gameState: GameState): boolean {
  const playerVariables: PlayerVariablesMap = getPlayerVariablesFromGameState(gameState);

  return _.some(playerVariables, (playerVars: BattleshipPlayerVariables) => {
    return !playerVars.hasPlacedShips;
  });
}

export function getAllShips(lobbyPlayerId: string, playersShips: Ship[], pendingActions: Action[]): Ship[] {

  return _.uniqBy(
    _.concat(
      getShipsFromPendingActions(lobbyPlayerId, playersShips, pendingActions), // add ships from pending PlaceShips Action
      playersShips,
    ),
    'id',
  );
}


function getShipsFromPendingActions(lobbyPlayerId: string, playersShips: Ship[], pendingActions: Action[]): Ship[] {
  return _.reduce(
    _.filter(pendingActions, isPlaceShipsAction),
    (ships: Ship[], action: Action): Ship[] => {
      _.each(getPlaceShipsParamsFromAction(action).shipPlacements, (shipPlacement: ShipPlacement) => {

        // TODO is this a flatmap?

        const ship: Ship = _.find(playersShips, (_ship: Ship) => _ship.id === shipPlacement.shipId) as Ship;

        const phantomShip: Ship = {
          id: shipPlacement.shipId,
          ownerId: lobbyPlayerId,
          shipType: ship.shipType,
          coord: shipPlacement.coord,
          alignment: shipPlacement.alignment
        };

        ships.push(phantomShip);
      });

      return ships;
    },
    [],
  );
}

export function isShipPlaced(shipId: number, pendingActions: Action[]): boolean {
  return _.some(
    _.filter(pendingActions, isPlaceShipsAction),
    (action: Action) => {
      return _.some(getPlaceShipsParamsFromAction(action).shipPlacements, (shipPlacement: ShipPlacement) => {
        return shipPlacement.shipId === shipId;
      });
    }
  );
}
