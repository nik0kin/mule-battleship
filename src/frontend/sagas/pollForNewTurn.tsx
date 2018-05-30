import { Turn } from 'mule-sdk-js';
import { delay } from 'redux-saga';
import { all, call, fork, put, take } from 'redux-saga/effects';

import { loadNewTurn, LoadMuleStateSuccess, SubmitTurnSuccess } from '../actions';
import * as constants from '../constants';
import { checkForNewTurn, getNewTurn } from '../gamestate/mule';

let currentTurn: number = -1;

// Worker Saga, Fired every 30 seconds
function* pollForNewTurn() {
  const newTurnExists: boolean = yield checkForNewTurn(currentTurn);

  if (!newTurnExists) {
    console.log('no new turn');
    return;
  }

  const newTurn: Turn = yield getNewTurn(currentTurn);

  yield put(loadNewTurn(newTurn)); // (put means dispatch)
}

function* pollScheduler() {
  while (true) {
    // Wait 30 seconds
    yield call(delay, 5 * 1000);

    // Fork means we are creating a subprocess that will handle the polling
    yield fork(pollForNewTurn/*, additional args*/);
  }
}

function* loadMuleStateWatcher() {
  while (true) {
    // Take means the saga will block until LOAD_MULE_STATE_SUCCESS action is dispatched
    const loadMuleStateSuccess: LoadMuleStateSuccess = yield take(constants.LOAD_MULE_STATE_SUCCESS);
    currentTurn = loadMuleStateSuccess.gameState.mule.currentTurn;
  }
}

function* submitTurnWatcher() {
  while (true) {
    // Take means the saga will block until SUBMIT_TURN_SUCCESS action is dispatched
    const submitTurnSuccess: SubmitTurnSuccess = yield take(constants.SUBMIT_TURN_SUCCESS);
    currentTurn = submitTurnSuccess.playTurnResponse.turnNumber;
  }
}


export function* pollForNewTurnSaga() {
  yield all([
    pollScheduler(),
    loadMuleStateWatcher(),
    submitTurnWatcher(),
  ]);
}
