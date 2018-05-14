
import { Coord } from '../mule-common';

export interface Square {
  ownerId: string; // playerRel
  coord: Coord;
}

export interface Ship {
  id: number;
  ownerId: string;
  shipType: ShipType;
  coord: Coord;
  alignment: Alignment;
}

export enum ShipType {
  Carrier = 'Carrier',
  Battleship = 'Battleship',
  Cruiser = 'Cruiser',
  Submarine = 'Submarine',
  Destroyer = 'Destroyer',
}

export interface ShipStructure {
  squares: Coord[];
}

export enum Alignment {
  Vertical,
  Horizontal,
}

// horizontal structures
export const ShipStructures: Map<ShipType, ShipStructure> = new Map([
  [
    ShipType.Carrier,
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
    ShipType.Battleship,
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
    ShipType.Cruiser,
    {
      squares: [
        { x: 0, y: 0},
        { x: 1, y: 0},
        { x: 2, y: 0},
      ]
    },
  ],
  [
    ShipType.Destroyer,
    {
      squares: [
        { x: 0, y: 0},
        { x: 1, y: 0},
      ]
    },
  ],
  [
    ShipType.Submarine,
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
