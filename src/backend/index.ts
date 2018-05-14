import { BundleCode } from 'mule-sdk-js';

import customBoardSettingsValidator from './hooks/customBoardSettingsValidator';
import boardGenerator from './hooks/boardGenerator';
import gameStart from './hooks/gameStart';
import progressRound from './hooks/progressRound';

const bundleCode: BundleCode = {
  customBoardSettingsValidator,
  boardGenerator,

  gameStart,

  actions: {
  //  'OrderUnit': require('./actions/OrderUnit'),
  //  'OrderBuilding': require('./actions/OrderBuilding')
  },

  // progressTurn: undefined, // doesnt exist because this is playByMail
  progressRound,
  // winCondition: require('./code/winCondition')
};

export default bundleCode;
