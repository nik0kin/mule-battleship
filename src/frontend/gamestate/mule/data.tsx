import { reduce } from 'lodash';

import {
  initializeMuleSdk,
  SDK,
  Game, GameBoard, TurnProgressStyle,
  GameState as MuleGameState,
  PlayersMap as MulePlayerMap,
} from 'mule-sdk-js';

import {
  Coord,
  getGridFromGameBoard, getShipsFromGameState, getShotsFromGameState,
  Grid, isPlacementMode, Shot
} from '../../../shared';
import {
  GameState,
  Player,
  PlayerMap,
} from '../../types';

let muleSDK: SDK;

function initMuleSdk(contextPath: string): void {
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

  // TODO redux async (thunk, saga, etc)

  // for now assume its all loaded been loaded syncronously

  initMuleSdk('http://localhost:313/webservices/');
  const gameId: string | undefined = muleSDK.fn.getUrlParameter('gameId');

  if (!gameId) {
    throw new Error('missing gameId in url');
  }

  // TODO make sure user has session

  // get Game
  const loadedGame: Game = await muleSDK.Games.readQ(gameId);

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

    isPlacementMode: isPlacementMode(loadedGameState),

    yourShips: getShipsFromGameState(loadedGameState, currentPlayerRel),
    theirShips: getShipsFromGameState(loadedGameState, opponentPlayerRel),

    yourShots: getShotsFromGameState(loadedGameState, currentPlayerRel),
    theirShots: getShotsFromGameState(loadedGameState, opponentPlayerRel),
  };
}
