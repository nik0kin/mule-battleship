import * as _ from 'lodash';

import { Coord, Player, PlayerMap } from '../../types';

export interface GameState {
  mule: {
//    currentPlayer: Player;
//    players: PlayerMap;
    currentTurn: number;
  };

  width: number;
  height: number;
  yourGrid: Grid<Square>;
  theirGrid: Grid<Square>;

  yourBoats: Boat[];
  theirBoats: Boat[];

  yourShots: Shot[];
  theirShots: Shot[];
}

export interface Square {

}

export class Grid<T> {
  private size: Coord;
  private _grid: T[][];

  constructor(size: Coord, createIterator: (coord: Coord) => T) {
    this.size = size;

    this._grid = [];
    _.times(size.x, (x) => {
      this._grid.push([]);
      _.times(size.y, (y) => {
        this._grid[x][y] = createIterator({ x, y });
      });
    });
  }

  public get(coord: Coord): T {
    return this._grid[coord.x][coord.y];
  }
}

export interface Boat {
  boatType: BoatType;
  coord: Coord;
  alignment: Alignment;
}

export enum BoatType {
  Carrier,
  Battleship,
  Cruiser,
  Submarine,
  Destroyer,
}

export interface BoatStructure {
  squares: Coord[];
}

export enum Alignment {
  Vertical,
  Horizontal,
}

// horizontal structures
export const BoatStructures: Map<BoatType, BoatStructure> = new Map([
  [
    BoatType.Carrier,
    {
      squares: [
        { x: 0, y: 0},
        { x: 1, y: 0},
        { x: 2, y: 0},
        { x: 3, y: 0},
        { x: 4, y: 0},
      ]
    },
  ],
  [
    BoatType.Battleship,
    {
      squares: [
        { x: 0, y: 0},
        { x: 1, y: 0},
        { x: 2, y: 0},
        { x: 3, y: 0},
      ]
    },
  ],
  [
    BoatType.Cruiser,
    {
      squares: [
        { x: 0, y: 0},
        { x: 1, y: 0},
        { x: 2, y: 0},
      ]
    },
  ],
  [
    BoatType.Destroyer,
    {
      squares: [
        { x: 0, y: 0},
        { x: 1, y: 0},
      ]
    },
  ],
  [
    BoatType.Submarine,
    {
      squares: [
        { x: 0, y: 0},
      ]
    },
  ],
]);

export interface Shot {
  coord: Coord;
  hit: boolean;
}
