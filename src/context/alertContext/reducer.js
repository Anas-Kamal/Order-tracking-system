import { SET_ALERT_MESSAGE, SET_SHOW_ALERT, initialAlertState } from "./types";

export const AlertReducer = (state = initialAlertState, action) => {
  switch (action.type) {
    case SET_ALERT_MESSAGE:
      return {
        ...state,
        alertMessage: action.payload,
      };
      case SET_SHOW_ALERT:
        return {
          ...state,
          isShowAlert: action.payload,
        };
    default:
      return state;
  }
};
