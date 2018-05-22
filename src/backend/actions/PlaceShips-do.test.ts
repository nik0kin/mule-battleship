
import { MuleStateSdk, PieceState, VariableMap } from 'mule-sdk-js';

import { Alignment, getPieceStateFromShip, Ship, ShipType /* PlaceShipsMuleActionParams */ } from '../../shared';

import placeShipsAction from './PlaceShips';

const mbackendSdkMock: Partial<MuleStateSdk> = {
  getPiece: (pieceId: string) => getPieceStateFromShip({
    id: Number(pieceId),
    ownerId: 'p1',
    shipType: ShipType.Battleship,
    coord: { x: -1, y: -1 },
    alignment: Alignment.Horizontal
  }),
  setPiece: () => null,
};

describe('Action.do: PlaceShipsAction', () => {
  it('should run without error', (done) => {
    const actionParams: VariableMap /* TODO use PlaceShipsMuleActionParams */ = {
      shipPlacements: [
        {
          shipId: 1,
          coord: { x: 0, y: 0 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 2,
          coord: { x: 0, y: 1 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 3,
          coord: { x: 0, y: 2 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 4,
          coord: { x: 0, y: 3 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 5,
          coord: { x: 0, y: 4 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 6,
          coord: { x: 0, y: 5 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 7,
          coord: { x: 0, y: 6 },
          alignment: Alignment.Horizontal,
        },
      ]
    };

    placeShipsAction.doQ(mbackendSdkMock as MuleStateSdk, 'p1', actionParams)
      .then(() => {
        done();
      });
  });
});
