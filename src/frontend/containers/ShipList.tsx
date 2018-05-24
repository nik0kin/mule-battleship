import { connect, Dispatch } from 'react-redux';

import ShipList from '../components/ShipList';
import * as actions from '../actions/';
import { StoreState } from '../types/index';

export function mapStateToProps({gameState, ui: {selectedShipBeingPlaced}, pendingTurn}: StoreState) {
  return {
    isPlacementMode: gameState.isPlacementMode,
    yourLobbyPlayerId: gameState.yourLobbyPlayerId,
    gridSize: { x: gameState.width, y: gameState.height },
    yourShips: gameState.yourShips,
    theirShips: gameState.theirShips,
    pendingActions: pendingTurn.actions,
    selectedShipBeingPlaced,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.RemovePendingAction>) {
  return {
    selectShipListShip: (shipId: number) => dispatch(actions.selectShipListShip(shipId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipList);
