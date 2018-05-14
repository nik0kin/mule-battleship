import * as _ from 'lodash';

import {
  GameBoard, BoardSpace,
  GameState as MuleGameState,
  PieceState, VariableMap,
} from 'mule-sdk-js';

import {
  Alignment,
  Coord,
  getBoardSpaceFromSquare, getCoordString, getPieceStateFromShip,
  Grid,
  Ship, ShipType,
  Shot,
  Square,
} from '../shared';

const width: number = 10;
const height: number = 10;

function createSquare(ownerId: number) {
  return (coord: Coord) => { 
    return { coord, ownerId };
  };
}

const p1Squares: Grid<Square> = new Grid(
  { x: width, y: height },
  createSquare(1),
);
const p2Squares: Grid<Square> = new Grid(
  { x: width, y: height },
  createSquare(2),
);

const players = {
  1: {playerId: '313', name: 'Nik', playerNumber: 1},
  2: {playerId: '14', name: 'Nadia', playerNumber: 2},
};


const ships: Ship[] = [
  {
    id: 1,
    ownerId: 1,
    shipType: ShipType.Carrier,
    coord: { x: 1, y: 1 },
    alignment: Alignment.Horizontal,
  },
  {
    id: 2,
    ownerId: 1,
    shipType: ShipType.Battleship,
    coord: { x: 1, y: 3 },
    alignment: Alignment.Vertical,
  },
  {
    id: 3,
    ownerId: 1,
    shipType: ShipType.Cruiser,
    coord: { x: 9, y: 1 },
    alignment: Alignment.Vertical,
  },
  {
    id: 4,
    ownerId: 1,
    shipType: ShipType.Destroyer,
    coord: { x: 5, y: 5 },
    alignment: Alignment.Horizontal,
  },
  {
    id: 5,
    ownerId: 1,
    shipType: ShipType.Destroyer,
    coord: { x: 5, y: 7 },
    alignment: Alignment.Horizontal,
  },
  {
    id: 6,
    ownerId: 1,
    shipType: ShipType.Submarine,
    coord: { x: 9, y: 9 },
    alignment: Alignment.Horizontal,
  },
  {
    id: 7,
    ownerId: 1,
    shipType: ShipType.Submarine,
    coord: { x: 4, y: 8 },
    alignment: Alignment.Horizontal,
  },
];

const p1Shots: Shot[] = [
  { coord: { x: 0, y: 1 }, hit: true },
  { coord: { x: 0, y: 2 }, hit: false },
  { coord: { x: 1, y: 1 }, hit: true },
  { coord: { x: 5, y: 5 }, hit: false },
  { coord: { x: 6, y: 6 }, hit: true },
  { coord: { x: 7, y: 7 }, hit: false },
  { coord: { x: 8, y: 8 }, hit: true },
  { coord: { x: 4, y: 7 }, hit: false },
  { coord: { x: 5, y: 7 }, hit: true },
];



export function getGameBoard(): GameBoard {
  return {
    _id: 'gameBoardId_101',
    board: getBoardSpacesForGameBoard(),
    gameState: 'gameStateId_211',
    history: 'historyId_210',
    ruleBundle: {
      id: 'ruleBundleId_104',
      name: 'Battleship',
    },
    boardType: 'dynamic'
  };
}

export function getGameState(): MuleGameState {
  return {
    _id: 'gameStateId_211',
    globalVariables: {},
    pieces: getPieceStatesFromShips(),
    playerVariables: {
        1: {
          shots: []
        },
        2: {
          shots: []
        },
    },
    spaces: [],
  };
}

function getBoardSpacesForGameBoard(): BoardSpace[] {
  return _.map(p1Squares.toArray(), getBoardSpaceFromSquare);
}

function getPieceStatesFromShips(): PieceState[] {
  return ships
    .map((ship) => getPieceStateFromShip(ship));
}
