
import * as _ from 'lodash';
import { MuleStateSdk, GameStartHook } from 'mule-sdk-js';

import { Alignment, getPieceStateFromShip, DEFAULT_GAME_START_SHIP_SETUP_COUNTS, Ship, ShipType } from '../../shared';


const gameStartHook: GameStartHook = (M: MuleStateSdk) => {
  let idIterator: number = 1;

  _.each(M.getPlayerRels(), (lobbyPlayerId: string) => {
    _.each(DEFAULT_GAME_START_SHIP_SETUP_COUNTS, (count: number, shipType: ShipType) => {
      const newShip: Ship = {
        id: idIterator++,
        ownerId: lobbyPlayerId,
        shipType,
        coord: { x: -1, y: -1 },
        alignment: Alignment.Horizontal
      };
      M.setPiece(String(newShip.id), getPieceStateFromShip(newShip));
    });
  });

  return M.persistQ();
};

export default gameStartHook;
