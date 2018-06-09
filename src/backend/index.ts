import { BundleCode } from 'mule-sdk-js';

import { FIRE_SHOT_MULE_ACTION, PLACE_SHIPS_MULE_ACTION } from '../shared';

import customBoardSettingsValidator from './hooks/customBoardSettingsValidator';
import boardGenerator from './hooks/boardGenerator';
import gameStart from './hooks/gameStart';
import validateTurn from './hooks/validateTurn';
// import progressTurn from './hooks/progressTurn';
import fireShipAction from './actions/FireShot';
import placeShipsAction from './actions/PlaceShips';

const bundleCode: BundleCode = {
  customBoardSettingsValidator,
  boardGenerator,

  gameStart,

  actions: {
    [PLACE_SHIPS_MULE_ACTION]: placeShipsAction,
    [FIRE_SHOT_MULE_ACTION]: fireShipAction,
  },

  validateTurn,
  // progressTurn
  // winCondition: require('./code/winCondition')
};

export default bundleCode;
