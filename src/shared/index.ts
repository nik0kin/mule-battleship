
import * as _ from 'lodash';
import { BoardSpace, GameBoard, GameState, PieceState } from 'mule-sdk-js';

import { Coord, getCoordFromString, getCoordString, Grid } from './mule-common';
export * from './mule-common';

import { Alignment, Ship, ShipType, Shot, Square } from './types';
export * from './types';

// 0 = A
export function numberToLetter(i: number): string {
  return String.fromCharCode(64 + i);
}



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
    _id: '' + ship.id, // just for mock
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
