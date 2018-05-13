import { reduce } from 'lodash';

import {
  initializeMuleSdk,
  SDK,
  Game, GameBoard, TurnProgressStyle,
  GameState as MuleGameState,
  PlayersMap as MulePlayerMap,
} from 'mule-sdk-js';

import {
  Alignment,
  Boat,
  BoatType,
  Coord,
  GameState,
  Grid,
  PlayerMap,
  Square,
  Shot,
} from '../../types';

export let muleSDK: SDK;

export function initMuleSdk(contextPath: string): void {
  muleSDK = initializeMuleSdk(contextPath);
}


interface MulePlayerMapPlayer {
  playerId: string;
  playerStatus: string;
  name?: string;
}

function convertToPlayerMap(playerMap: MulePlayerMap): PlayerMap {
  return reduce(
    playerMap,
    (i: PlayerMap, p: MulePlayerMapPlayer, playerRel: string) => {
      const playerNumber: number = Number(playerRel.substring(1));
      i[playerNumber] = {
        playerId: p.playerId,
        playerNumber,
        name: p.name || 'No Mule Username?',
      };
      return i;
    },
    {}
  );
}

export async function getBattleshipGameState(): Promise<GameState> {
  const mockGameId = 'gameId_1'; // TODO load gameId from ? (do once hooking up to mule-frontend lobby)

  // TODO redux async (thunk, saga, etc)

  // for now assume its all loaded been loaded syncronously

  initMuleSdk('http://local.dev');
  
  // TODO make sure user has session

  // // get Game
  // const loadedGame: Game = await muleSDK.Games.readQ(mockGameId);

  // // get GameBoard
  // const loadedGameBoard: GameBoard = await muleSDK.GameBoards.readQ(loadedGame.gameBoard);

  // // get GameState
  // const loadedGameState: MuleGameState = await muleSDK.GameStates.readQ(loadedGameBoard.gameState);

  // // TODO get History/Turns
  
  // const players: PlayerMap = convertToPlayerMap(await muleSDK.Games.getPlayersMapQ(loadedGame));

  const grid1: Grid<Square> = new Grid<Square>(
    { x: 10, y: 10 },
    (coord: Coord) => {
      return {};
    },
  );
  const grid2: Grid<Square> = new Grid<Square>(
    { x: 10, y: 10 },
    (coord: Coord) => {
      return {};
    },
  );

  const boats: Boat[] = [
    {
      boatType: BoatType.Carrier,
      coord: { x: 1, y: 1 },
      alignment: Alignment.Horizontal,
    },
    {
      boatType: BoatType.Battleship,
      coord: { x: 1, y: 3 },
      alignment: Alignment.Vertical,
    },
    {
      boatType: BoatType.Cruiser,
      coord: { x: 9, y: 1 },
      alignment: Alignment.Vertical,
    },
    {
      boatType: BoatType.Destroyer,
      coord: { x: 5, y: 5 },
      alignment: Alignment.Horizontal,
    },
    {
      boatType: BoatType.Destroyer,
      coord: { x: 5, y: 7 },
      alignment: Alignment.Horizontal,
    },
    {
      boatType: BoatType.Submarine,
      coord: { x: 9, y: 9 },
      alignment: Alignment.Horizontal,
    },
    {
      boatType: BoatType.Submarine,
      coord: { x: 4, y: 8 },
      alignment: Alignment.Horizontal,
    },
  ];

  const yourShots: Shot[] = [
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

  return {
    mule: {
//      currentPlayer: players[1], // TODO figure out whos turn it is
//      players,
      currentTurn: 1,
    },
  
    width: 10,
    height: 10,
    
    yourGrid: grid1,
    theirGrid: grid2,
    
    yourBoats: boats,
    theirBoats: [],

    yourShots: yourShots,
    theirShots: [],
  };
}
