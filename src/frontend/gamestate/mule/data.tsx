import { reduce } from 'lodash';

import {
  initializeMuleSdk,
  SDK,
  Game, GameBoard, TurnProgressStyle,
  GameState as MuleGameState,
  PlayersMap as MulePlayerMap,
} from 'mule-sdk-js';

import { getGridFromGameBoard, getShipsFromGameState, Grid, Coord, Shot } from '../../../shared';
import {
  GameState,
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
      const playerNumber: number = Number(playerRel);
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

  // get Game
  const loadedGame: Game = await muleSDK.Games.readQ(mockGameId);

  // get GameBoard
  const loadedGameBoard: GameBoard = await muleSDK.GameBoards.readQ(loadedGame.gameBoard);

  // get GameState
  const loadedGameState: MuleGameState = await muleSDK.GameStates.readQ(loadedGameBoard.gameState);

  // TODO get History/Turns
  
  const players: PlayerMap = convertToPlayerMap(await muleSDK.Games.getPlayersMapQ(loadedGame));

  const currentPlayerRel: number = players[1].playerNumber;
  const opponentPlayerRel: number = players[2].playerNumber;

  return {
    mule: {
//      currentPlayer: players[1], // TODO figure out whos turn it is
//      players,
      currentTurn: 1,
    },
  
    width: 10,
    height: 10,
    
    yourGrid: getGridFromGameBoard(loadedGameBoard, currentPlayerRel),
    theirGrid: getGridFromGameBoard(loadedGameBoard, opponentPlayerRel),
    
    yourShips: getShipsFromGameState(loadedGameState, currentPlayerRel),
    theirShips: getShipsFromGameState(loadedGameState, opponentPlayerRel),

    yourShots: loadedGameState.playerVariables[currentPlayerRel].shots as Shot[],
    theirShots: loadedGameState.playerVariables[opponentPlayerRel].shots as Shot[],
  };
}
