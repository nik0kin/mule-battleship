import { History, SDK, Turn } from 'mule-sdk-js';

import { getGameId, getSdk } from './data';

export async function checkForNewTurn(currentTurn: number): Promise<boolean> {
  const sdk: SDK = getSdk();

  if (!sdk) return false; // TODO make saga not start checking til game is loaded

  const history: History = await sdk.Historys.readGamesHistoryQ(getGameId());

  return history.currentTurn !== currentTurn;
}

export async function getNewTurn(turnNumber: number): Promise<Turn> {
  return await getSdk().Turns.readGamesTurnQ(getGameId(), turnNumber);
}

