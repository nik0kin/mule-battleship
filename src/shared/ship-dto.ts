import { GameState, PieceState } from 'mule-sdk-js';
import { includes, values } from 'lodash';

import { Alignment } from './types/alignment';
import { Ship, ShipType } from './types/ship';
import { getCoordString, getCoordFromString } from './mule-common';

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
  return includes(values(ShipType), pieceState.class);
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
