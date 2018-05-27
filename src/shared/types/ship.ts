
import { Coord } from '../mule-common';

import { Alignment } from './alignment';

export interface Ship {
  _id: string;
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


export const DEFAULT_GAME_START_SHIP_SETUP_COUNTS = { // TODO better name
  [ShipType.Carrier]: 1,
  [ShipType.Battleship]: 1,
  [ShipType.Cruiser]: 1,
  [ShipType.Submarine]: 2,
  [ShipType.Destroyer]: 2,
};

export interface ShipStructure {
  squares: Coord[];
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

export function getShipStructure(shipType: ShipType): ShipStructure {
  return ShipStructures.get(shipType) as ShipStructure;
}
