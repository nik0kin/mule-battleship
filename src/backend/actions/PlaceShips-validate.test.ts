
import { MuleStateSdk, PieceState, VariableMap } from 'mule-sdk-js';

// import { PlaceShipsMuleActionParams } from '../../shared';

import placeShipsAction from './PlaceShips';

const mbackendSdkMock: Partial<MuleStateSdk> = {
  getPiece: (pieceId) => ({} as PieceState),
};

describe('Action.validate: PlaceShipsAction', () => {
  it('should run without error', (done) => {
    const actionParams: VariableMap /* TODO use PlaceShipsMuleActionParams */ = {
      shipPlacements: []
    };

    placeShipsAction.validateQ(mbackendSdkMock as MuleStateSdk, 'p1', actionParams)
      .then(() => {
        done();
      });
  });
});
