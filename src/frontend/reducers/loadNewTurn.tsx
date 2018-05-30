import { Action } from 'mule-sdk-js';

import { getAllShipsIncludingPendingActions, PLACE_SHIPS_MULE_ACTION } from '../../shared';

import { StoreState } from '../types';
import { LoadNewTurn } from '../actions';

export function loadNewTurnReducer(state: StoreState, loadNewTurn: LoadNewTurn): StoreState {
  const newMuleState = {
    ...state.gameState.mule,
    isYourTurn: !state.gameState.mule.isYourTurn,
    currentTurn: loadNewTurn.newTurn.turnNumber + 1,
  };

  const whosTurn: string = state.gameState.mule.isYourTurn ? state.gameState.yourLobbyPlayerId : state.gameState.theirLobbyPlayerId;
  const action: Action = loadNewTurn.newTurn.playerTurns[whosTurn].actions[0];

  if (whosTurn === state.gameState.yourLobbyPlayerId) {
    const emptyTurn: { actions: Action[] } = {
      actions: []
    };

    if (action.type === PLACE_SHIPS_MULE_ACTION) {
      return {
        ...state,
        gameState: {
          ...state.gameState,
          mule: newMuleState,
          isPlacementMode: false,
          yourShips: getAllShipsIncludingPendingActions(whosTurn, state.gameState.yourShips, [action]),
        },
        pendingTurn: emptyTurn,
      };
    } else { // FIRE SHOT
      return {
        ...state,
      };
    }
  }


  console.log('loadNewTurnReducer', loadNewTurn);
  console.log(action);

  if (action.type === PLACE_SHIPS_MULE_ACTION) {
      return {
        ...state,
        gameState: {
          ...state.gameState,
          mule: newMuleState,
          isOpponentPlacementMode: false,
          // theirShips.. dont update theirShips, that should be hidden knowledge
        }
      };
  } else { // FIRE SHOT
    return {
      ...state,
    };
  }

  // TODO add state

}
