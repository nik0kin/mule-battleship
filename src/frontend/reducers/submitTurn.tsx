import { StoreState } from '../types';

export function submitTurnSuccessReducer(state: StoreState): StoreState {
  return state;
}

export function submitTurnFailureReducer(state: StoreState): StoreState {
  console.log('submitTurnFailureReducer');
  return state;
}
