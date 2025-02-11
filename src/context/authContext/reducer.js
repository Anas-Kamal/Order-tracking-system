import { SET_USER_INFO, initialAuthState } from "./types";

export const AuthReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return state;
  }
};
