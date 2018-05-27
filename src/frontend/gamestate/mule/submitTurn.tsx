import { Action, MulePlayTurnRequest, SDK } from 'mule-sdk-js';

import { getGameId, getLobbyPlayerId, getSdk } from './data';

export async function submitMuleTurn(actions: Action[]): Promise<any> {
  const muleSdk: SDK = getSdk();
  const params: MulePlayTurnRequest = {
    playerId: getLobbyPlayerId(),
    actions
  };

  return muleSdk.PlayTurn.sendGameTurnQ(getGameId(), params);
}
