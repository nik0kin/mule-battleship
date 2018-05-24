import { GameState } from 'mule-sdk-js';

import { BattleshipPlayerVariables, PlayerVariablesMap } from './types';

export function getPlayerVariablesFromGameState(gameState: GameState): PlayerVariablesMap {
  return gameState.playerVariables as any as PlayerVariablesMap;
}
