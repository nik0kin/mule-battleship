import * as _ from 'lodash';

import { DEFAULT_GAME_START_SHIP_SETUP_COUNTS, Ship, ShipType } from './types/ship';

export function getTotalShipsPerPlayer(): number {
  return _.reduce(
    DEFAULT_GAME_START_SHIP_SETUP_COUNTS, // TODO dont hardcode
    (total: number, count: number, shipType: ShipType) => {
      return total + count;
    },
    0
  );
}

// playerShips must contain ship
export function findOneShip(playerShips: Ship[], shipId: number): Ship {
  const ship = _.find(playerShips, (_ship: Ship) => _ship.id === shipId) as Ship;
  if (!ship) {
    throw 'playerShips should contain shipId ' + playerShips.toString();
  } else {
    return ship;
  }
}
