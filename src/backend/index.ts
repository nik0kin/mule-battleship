import { BundleCode } from 'mule-sdk-js';

import customBoardSettingsValidator from './hooks/customBoardSettingsValidator';
import boardGenerator from './hooks/boardGenerator';
import gameStart from './hooks/gameStart';
import progressTurn from './hooks/progressTurn';

const bundleCode: BundleCode = {
  customBoardSettingsValidator,
  boardGenerator,

  gameStart,

  actions: {
  //  'PlaceShips': require('./actions/PlaceShips'),
  //  'FireShot': require('./actions/FireShot')
  },

  progressTurn
  // winCondition: require('./code/winCondition')
};

export default bundleCode;
