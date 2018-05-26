import { each, reduce } from 'lodash';

import {
  initializeMuleSdk,
  SDK,
  Game, GameBoard, TurnProgressStyle,
  GameState as MuleGameState,
  History,
  PlayersMap as MulePlayerMap,
  User,
} from 'mule-sdk-js';

import {
  Coord,
  getGridFromGameBoard, getShipsFromGameState, getShotsFromGameState,
  Grid, isPlacementMode, RULEBUNDLE_NAME, Shot
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

  const hostname: string = window && window.location && window.location.hostname;

  let muleApiPath: string;
  if (hostname === 'localhost') {
    muleApiPath = 'http://localhost:313/webservices/';
  } else {
    muleApiPath = '/webservices/';
  }

  initMuleSdk(muleApiPath);
  const gameId: string | undefined = muleSDK.fn.getUrlParameter('gameId');

  if (!gameId) {
    throw new Error('missing gameId in url');
  }

  // load session
  let user: User;
  let lobbyPlayerId: string = '';
  try {
    user = await muleSDK.Users.sessionQ();
  } catch (e) {
    throw new Error('user has no session');
  }

  // get Game
  const loadedGame: Game = await muleSDK.Games.readQ(gameId);

  if (loadedGame.gameStatus === 'open') {
    throw new Error('game has not started');
  }

  if (loadedGame.ruleBundle.name !== RULEBUNDLE_NAME) {
    throw new Error(`gameId RuleBundle does not match ${RULEBUNDLE_NAME}: ` + loadedGame.ruleBundle.name);
  }

  // get GameBoard
  const loadedGameBoard: GameBoard = await muleSDK.GameBoards.readQ(loadedGame.gameBoard);

  // get GameState
  const loadedGameState: MuleGameState = await muleSDK.GameStates.readQ(loadedGameBoard.gameState);

  // get History
  const history: History = await muleSDK.Historys.readGamesHistoryQ(loadedGame._id);

  // TODO get Turns

  const players: PlayerMap = convertToPlayerMap(await muleSDK.Games.getPlayersMapQ(loadedGame));

  // check if player is playing
  each(players, (player: Player, _lobbyPlayerId: string) => {
    if (player.playerId === user._id) {
      lobbyPlayerId = _lobbyPlayerId;
    }
  });
  if (!lobbyPlayerId) {
    throw new Error('user is not in game');
  }

  const currentPlayerRel: string = lobbyPlayerId;
  const opponentPlayerRel: string = 'p1' === lobbyPlayerId ? 'p2' : 'p1';

  const gridSize = { x: 10, y: 10 };

  const nextTurnsLobbyPlayerId: string = muleSDK.fn.getWhosTurnIsIt(history);

  return {
    mule: {
      currentPlayer: players[currentPlayerRel],
      players,
      currentTurn: 1,
      isYourTurn: currentPlayerRel === nextTurnsLobbyPlayerId,
    },

    yourLobbyPlayerId: currentPlayerRel,
    theirLobbyPlayerId: opponentPlayerRel,

    width: gridSize.x,
    height: gridSize.y,

    yourGrid: getGridFromGameBoard(gridSize, loadedGameBoard, currentPlayerRel),
    theirGrid: getGridFromGameBoard(gridSize, loadedGameBoard, opponentPlayerRel),

    isPlacementMode: isPlacementMode(loadedGameState),

    yourShips: getShipsFromGameState(loadedGameState, currentPlayerRel),
    theirShips: getShipsFromGameState(loadedGameState, opponentPlayerRel),

    yourShots: getShotsFromGameState(loadedGameState, currentPlayerRel),
    theirShots: getShotsFromGameState(loadedGameState, opponentPlayerRel),
  };
}
