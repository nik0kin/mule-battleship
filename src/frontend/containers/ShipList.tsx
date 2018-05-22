import ShipList from '../components/ShipList';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({gameState, ui: {selectedShipBeingPlaced}}: StoreState) {
  return {
    isPlacementMode: gameState.isPlacementMode,
    yourShips: gameState.yourShips,
    theirShips: gameState.theirShips,
    selectedShipBeingPlaced,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.RemovePendingAction>) {
  return {
    selectShipListShip: (shipId: number) => dispatch(actions.selectShipListShip(shipId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipList);
