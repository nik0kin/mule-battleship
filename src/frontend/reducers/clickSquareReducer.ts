
import {
  ClickSquare,
  SelectShipListShip,
  RemovePendingAction,
} from '../actions';
import { StoreState } from '../types';

export function clickSquareReducer(state: StoreState, clickSquareAction: ClickSquare) {

  if (state.gameState.isPlacementMode && state.ui.selectedShipBeingPlaced) {
    // new logic
  }

  if (clickSquareAction.lobbyPlayerId === 'p2') {
    // TODO shots logic

    return {
      ...state,
      ui: {
        ...state.ui,
        selectedCoord: { // select square
          x: clickSquareAction.x,
          y: clickSquareAction.y,
        },
      },
    };
  }


  return state;
}
