
import {
  ClickSquare,
  LoadMuleStateSuccess,
  LoadMuleStateFailure,
  SelectShipListShip,
  SubmitTurnSuccess,
  SubmitTurnFailure,
//  RemovePendingAction,
} from '../actions';
import * as constants from '../constants';
import { StoreState } from '../types';

import { clickSubmitReducer } from './clickSubmit';
import { clickSquareReducer } from './clickSquare';
import { loadMuleStateSuccessReducer, loadMuleStateFailureReducer } from './loadMuleState';
import { submitTurnSuccessReducer, submitTurnFailureReducer } from './submitTurn';

export function generalReducer(state: StoreState, action: {type: string}): StoreState {

  switch (action.type) {
    case constants.LOAD_MULE_STATE_SUCCESS:
      const loadMuleStateSuccess: LoadMuleStateSuccess = action as LoadMuleStateSuccess;
      return loadMuleStateSuccessReducer(state, loadMuleStateSuccess);
    case constants.LOAD_MULE_STATE_FAILURE:
      const loadMuleStateFailure: LoadMuleStateFailure = action as LoadMuleStateFailure;
      return loadMuleStateFailureReducer(state, loadMuleStateFailure);

    case constants.CLICK_SQUARE:
      const clickSquareAction: ClickSquare = action as ClickSquare;
      return clickSquareReducer(state, clickSquareAction);

    case constants.CLICK_SUBMIT:
      return clickSubmitReducer(state);

    case constants.SUBMIT_TURN_SUCCESS:
      const submitTurnSuccess: SubmitTurnSuccess = action as SubmitTurnSuccess;
      return submitTurnSuccessReducer(state, submitTurnSuccess);
    case constants.SUBMIT_TURN_FAILURE:
      const submitTurnFailure: SubmitTurnFailure = action as SubmitTurnFailure;
      return submitTurnFailureReducer(state, submitTurnFailure);

    case constants.SELECT_SHIPLIST_SHIP:
      const selectShipListShipAction: SelectShipListShip = action as SelectShipListShip;
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedShipBeingPlaced: selectShipListShipAction.shipId,
        },
      };

/*
    case REMOVE_PENDING_ACTION:
      const removePendingAction = action as RemovePendingAction;
      return {
        ...state,
        pendingTurn: {
          actions: [
            ...state.pendingTurn.actions.slice(0, removePendingAction.index),
            ...state.pendingTurn.actions.slice(removePendingAction.index + 1),
          ]
        },
      };
*/
    default:
      return state;
  }
}