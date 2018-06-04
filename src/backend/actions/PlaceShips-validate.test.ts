
import { MuleStateSdk, VariableMap } from 'mule-sdk-js';

import { Alignment, getPieceStateFromShip, ShipType /* PlaceShipsMuleActionParams */ } from '../../shared';

import placeShipsAction from './PlaceShips';

const mbackendSdkMock: Partial<MuleStateSdk> = {
  getPiece: (pieceId: string) => getPieceStateFromShip({
    _id: pieceId,
    id: Number(pieceId),
    ownerId: 'p1',
    shipType: ShipType.Battleship,
    coord: { x: -1, y: -1 },
    alignment: Alignment.Horizontal,
    sunk: false,
  }),
};

const placeShipsWithRotationsActionParams: VariableMap = {
  shipPlacements: [
    {
      shipId: 9819112,
      coord: {x: 6, y: 4},
      alignment: 1
    },
    {
      shipId: 14723,
      coord: {x: 6, y: 3},
      alignment: 1
    },
    {
      shipId: 5528858,
      coord: {x: 5, y: 3},
      alignment: 0
    },
    {
      shipId: 1010484,
      coord: {x: 5, y: 2},
      alignment: 1
    },
    {
      shipId: 7231084,
      coord: {x: 5, y: 1},
      alignment: 1
    },
    {
      shipId: 7471961,
      coord: {x: 4, y: 1},
      alignment: 0
    },
    {
      shipId: 2489142,
      coord: {x: 4, y: 0},
      alignment: 1
    }]};

describe('Action.validate: PlaceShipsAction', () => {
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

    placeShipsAction.validateQ(mbackendSdkMock as MuleStateSdk, 'p1', actionParams)
      .then(() => {
        done();
      });
  });

  it('should run without error2', (done) => {
    placeShipsAction.validateQ(mbackendSdkMock as MuleStateSdk, 'p1', placeShipsWithRotationsActionParams)
      .then(() => {
        done();
      });
  });
});
