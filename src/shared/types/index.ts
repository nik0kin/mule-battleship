
import { Coord } from '../mule-common';

export * from './actions';
export * from './ship';

export interface Square {
  ownerId: string; // playerRel
  coord: Coord;
}

export interface Shot {
  coord: Coord;
  hit: boolean;
}
