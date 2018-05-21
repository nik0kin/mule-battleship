import { reduce } from 'lodash';

import {
  initializeMuleSdk,
  SDK,
  Game, GameBoard, TurnProgressStyle,
  GameState as MuleGameState,
  PlayersMap as MulePlayerMap,
} from 'mule-sdk-js';

import {
  getGridFromGameBoard, getShipsFromGameState, getShotsFromGameState,
  Grid, Coord, Shot
} from '../../../shared';
import {
  GameState,
  Player,
  PlayerMap,
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
      i[playerRel] = {
        playerId: p.playerId,
        playerRel,
        name: p.name || 'No Mule Username?',
      };
      return i;
    },
    {}
  );
}

export async function getBattleshipGameState(): Promise<GameState> {
  const mockGameId: string = '5b02150d7856d112557c25b7'; // TODO load gameId from ? (do once hooking up to mule-frontend lobby)

  // TODO redux async (thunk, saga, etc)

  // for now assume its all loaded been loaded syncronously

  initMuleSdk('http://localhost:313/webservices/');

  // TODO make sure user has session

  // get Game
  const loadedGame: Game = await muleSDK.Games.readQ(mockGameId);

  if (loadedGame.gameStatus === 'open') {
    throw new Error('game has not started');
  }

  // get GameBoard
  const loadedGameBoard: GameBoard = await muleSDK.GameBoards.readQ(loadedGame.gameBoard);

  // get GameState
  const loadedGameState: MuleGameState = await muleSDK.GameStates.readQ(loadedGameBoard.gameState);

  // TODO get History/Turns

  const players: PlayerMap = convertToPlayerMap(await muleSDK.Games.getPlayersMapQ(loadedGame));

  const currentPlayerRel: string = 'p1';
  const opponentPlayerRel: string = 'p2';

  return {
    mule: {
      currentPlayer: players[currentPlayerRel], // TODO figure out whos turn it is
      players,
      currentTurn: 1,
    },

    width: 10,
    height: 10,

    yourGrid: getGridFromGameBoard(loadedGameBoard, currentPlayerRel),
    theirGrid: getGridFromGameBoard(loadedGameBoard, opponentPlayerRel),

    yourShips: getShipsFromGameState(loadedGameState, currentPlayerRel),
    theirShips: getShipsFromGameState(loadedGameState, opponentPlayerRel),

    yourShots: getShotsFromGameState(loadedGameState, currentPlayerRel),
    theirShots: getShotsFromGameState(loadedGameState, opponentPlayerRel),
  };
}
