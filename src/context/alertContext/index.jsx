import { createContext, useMemo, useReducer } from "react";
import { SET_ALERT_MESSAGE, SET_SHOW_ALERT, initialAlertState } from "./types";
import { AlertReducer } from "./reducer";
import { setPayloadAction } from "./actions";

const AlertContext = createContext();

// eslint-disable-next-line react/prop-types
function AlertContextProvider({ children }) {
  const [state, dispatch] = useReducer(AlertReducer, initialAlertState);
 

  const AlertValue = useMemo(() => {
    const setAlertMessage = (message) => {
      setPayloadAction(message, dispatch, SET_ALERT_MESSAGE)
    };

    const setShowAlert = (show) => {
      setPayloadAction(show, dispatch, SET_SHOW_ALERT)
    };
   

    return {
      alertState: state,
      setAlertMessage,
      setShowAlert
     
    };
  }, [
    state,
  ]);
  return (
    <AlertContext.Provider value={AlertValue}>{children}</AlertContext.Provider>
  );
}

export { AlertContext, AlertContextProvider };
