
import { MuleStateSdk, GameStartHook } from 'mule-sdk-js';

const gameStartHook: GameStartHook = (M: MuleStateSdk) => {
  var playerRels = M.getPlayerRels();

  return M.persistQ();
};

export default gameStartHook;
