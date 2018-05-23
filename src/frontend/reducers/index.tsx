
import {
  ClickSquare,
  SelectShipListShip,
  RemovePendingAction,
} from '../actions';
import {
  CLICK_SQUARE,
  SELECT_SHIPLIST_SHIP,
  REMOVE_PENDING_ACTION,
} from '../constants';
import { StoreState } from '../types';

import { clickSquareReducer } from './clickSquareReducer';

export function generalReducer(state: StoreState, action: {type: string}): StoreState {
  // return {
  //   ...state,
  //   pendingTurn: {
  //   //  actions: reduceReduxAgentAction(state.pendingTurn.actions, action)
  //   },
  // };

  switch (action.type) {
    case CLICK_SQUARE:
      const clickSquareAction: ClickSquare = action as ClickSquare;
      return clickSquareReducer(state, clickSquareAction);

    case SELECT_SHIPLIST_SHIP:
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