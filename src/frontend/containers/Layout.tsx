import { connect, Dispatch } from 'react-redux';

import Layout from '../components/Layout';
import * as actions from '../actions/';
import { StoreState } from '../types/index';

export function mapStateToProps({gameState, ui: {selectedCoord}, pendingTurn}: StoreState) {

  return {
    players: gameState.mule.players,
    selectedCoord,
    gameState,
    pendingActions: {} // pendingTurn.actions,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.RemovePendingAction>) {
  return {
    removePendingAction: (index: number) => dispatch(actions.removePendingAction(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
