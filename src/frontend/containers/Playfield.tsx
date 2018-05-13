import { connect, Dispatch } from 'react-redux';

import Playfield from '../components/Playfield';
import * as actions from '../actions/';
import { Coord, StoreState } from '../types';

export function mapStateToProps({gameState, ui: {selectedCoord}}: StoreState) {
  return {
    gameState,
    selectedCoord,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ClickSquare>) {
  return {
    clickSquare: (coord: Coord) => dispatch(actions.clickSquare(coord)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Playfield);
