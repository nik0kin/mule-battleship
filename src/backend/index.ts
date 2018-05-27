import { BundleCode } from 'mule-sdk-js';

import { PLACE_SHIPS_MULE_ACTION } from '../shared';

import customBoardSettingsValidator from './hooks/customBoardSettingsValidator';
import boardGenerator from './hooks/boardGenerator';
import gameStart from './hooks/gameStart';
// import progressTurn from './hooks/progressTurn';
import placeShipsAction from './actions/PlaceShips';

const bundleCode: BundleCode = {
  customBoardSettingsValidator,
  boardGenerator,

  gameStart,

  actions: {
    [PLACE_SHIPS_MULE_ACTION]: placeShipsAction,
  //  'FireShot': require('./actions/FireShot')
  },

  // progressTurn
  // winCondition: require('./code/winCondition')
};

export default bundleCode;
