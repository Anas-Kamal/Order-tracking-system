import {
  initialCommonState,
} from "./types";

export const commonReducer = (state = initialCommonState, action) => {
  switch (action.type) {
    case SET_ENV_LIST:
      return {
        ...state,
        envList: action.payload,
      };
    default:
      return state;
  }


};
