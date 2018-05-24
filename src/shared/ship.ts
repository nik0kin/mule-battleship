import * as _ from 'lodash';

import { DEFAULT_GAME_START_SHIP_SETUP_COUNTS, ShipType } from './types/ship';

export function getTotalShipsPerPlayer(): number {
  return _.reduce(
    DEFAULT_GAME_START_SHIP_SETUP_COUNTS, // TODO dont hardcode
    (total: number, count: number, shipType: ShipType) => {
      return total + count;
    },
    0
  );
}
