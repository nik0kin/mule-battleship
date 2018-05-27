import { call, put, takeEvery } from 'redux-saga/effects';

import { ClickSubmit, submitTurnSuccess, submitTurnFailure } from '../actions';
import * as constants from '../constants';
import { submitMuleTurn } from '../gamestate/mule';
import { GameState } from '../types';

// worker Saga: will be fired on CLICK_SUBMIT actions
function* submitTurn(action: ClickSubmit) {
   try {
      const gameState: GameState = yield call(submitMuleTurn, action.pendingTurn.actions);
      yield put(submitTurnSuccess(gameState));
   } catch (e) {
      yield put(submitTurnFailure(e));
   }
}

/*
  Starts submitTurn on each dispatched `CLICK_SUBMIT` action.
*/
export function* submitTurnSaga() {
  yield takeEvery(constants.CLICK_SUBMIT, submitTurn);
}
