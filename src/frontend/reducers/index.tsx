
import { ClickSquare, RemovePendingAction } from '../actions';
import { StoreState } from '../types/index';
import { CLICK_SQUARE, REMOVE_PENDING_ACTION } from '../constants/index';


export function generalReducer(state: StoreState, action: {type: string}): StoreState {
  // return {
  //   ...state,
  //   pendingTurn: {
  //   //  actions: reduceReduxAgentAction(state.pendingTurn.actions, action)
  //   },
  // };

  switch (action.type) {
    case CLICK_SQUARE:
      const clickPlotAction = action as ClickSquare;
      return {
        ...state,
        ui: {
          selectedCoord: {
            x: clickPlotAction.x,
            y: clickPlotAction.y, 
          },
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