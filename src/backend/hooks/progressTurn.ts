
import { MuleStateSdk, ProgressTurnHook } from 'mule-sdk-js';

const progressTurnHook: ProgressTurnHook = (M: MuleStateSdk) => {

  return M.persistQ()
    .then(() => {
      return {}; // Round meta data
    });
};

export default progressTurnHook;
