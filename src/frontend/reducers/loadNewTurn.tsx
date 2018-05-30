import { StoreState } from '../types';
import { LoadNewTurn } from '../actions';

export function loadNewTurnReducer(state: StoreState, loadNewTurn: LoadNewTurn): StoreState {
  console.log(loadNewTurnReducer, loadNewTurn);
  // TODO add state
  return {
    ...state,
  };
}
