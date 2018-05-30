import { SubmitTurnSuccess, SubmitTurnFailure } from '../actions';
import { StoreState } from '../types';

export function submitTurnSuccessReducer(state: StoreState, submitTurnSuccess: SubmitTurnSuccess): StoreState {
  return {
    ...state,
    isSubmitting: false,
    // gameState: {
    //   ...state.gameState,
    //   mule: {
    //     ...state.gameState.mule,
    //     isYourTurn: false,
    //     currentTurn: submitTurnSuccess.playTurnResponse.turnNumber,
    //   }
    // },
  };
}

export function submitTurnFailureReducer(state: StoreState, submitTurnFailure: SubmitTurnFailure): StoreState {
  const { error } = submitTurnFailure;
  console.log('Something went wrong during initiliziting Mule PlayTurn');
  console.log(error);
  console.log(error.stack);

  return {
    ...state,
    isSubmitting: false,
  };
}
