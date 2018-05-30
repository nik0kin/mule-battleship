import { Turn } from 'mule-sdk-js';
import { delay } from 'redux-saga';
import { all, call, fork, put, take } from 'redux-saga/effects';

import { loadNewTurn, LoadMuleStateSuccess /*, SubmitTurnSuccess*/ } from '../actions';
import * as constants from '../constants';
import { checkForNewTurn, getNewTurn } from '../gamestate/mule';

let isPolling: boolean = false;

let currentTurn: number = -1;

// Worker Saga, Fired every 30 seconds
function* pollForNewTurn() {
  if (isPolling || currentTurn <= 0) {
    return;
  }

  isPolling = true;

  const newTurnExists: boolean = yield checkForNewTurn(currentTurn);
  if (!newTurnExists) {
    console.log('no new turn');
    isPolling = false;
    return;
  }

  const newTurn: Turn = yield getNewTurn(currentTurn);
  yield put(loadNewTurn(newTurn)); // (put means dispatch)

  currentTurn++;
  isPolling = false;
}

function* pollScheduler() {
  yield call(delay, 10 * 1000); // cheap wait for load

  while (true) {
    // Wait 30 seconds
    yield call(delay, 30 * 1000);

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
    /* const submitTurnSuccess: SubmitTurnSuccess = */
    yield take(constants.SUBMIT_TURN_SUCCESS);

    yield pollForNewTurn();
  }
}


export function* pollForNewTurnSaga() {
  yield all([
    pollScheduler(),
    loadMuleStateWatcher(),
    submitTurnWatcher(),
  ]);
}
