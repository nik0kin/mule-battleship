
import { MuleStateSdk, ProgressRoundHook } from 'mule-sdk-js';

const progressRoundHook: ProgressRoundHook = (M: MuleStateSdk) => {

  return M.persistQ()
    .then(() => {
      return {}; // Round meta data
    });
};

export default progressRoundHook;
