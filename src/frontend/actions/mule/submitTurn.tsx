
import * as constants from '../../constants';
import { GameState } from '../../types';

export interface SubmitTurnSuccess {
  type: constants.SUBMIT_TURN_SUCCESS;
  gameState: GameState;
}

export function submitTurnSuccess(gameState: GameState): SubmitTurnSuccess {
  return {
    type: constants.SUBMIT_TURN_SUCCESS,
    gameState,
  };
}

export interface SubmitTurnFailure {
  type: constants.SUBMIT_TURN_FAILURE;
  error: Error;
}

export function submitTurnFailure(error: Error): SubmitTurnFailure {
  return {
    type: constants.SUBMIT_TURN_FAILURE,
    error,
  };
}
