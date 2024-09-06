import { createContext, useMemo, useReducer } from "react";
import { AuthReducer } from "./reducer";
import { initialAuthState } from "./types";
import { useAuthHttp } from "../../hooks/useAuth";
// import { StorageService } from "../../config/storage";
// import { CustomToast } from "../../components/Toastr/Toastr";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
function AuthContextProvider({ children }) {
  const [state] = useReducer(AuthReducer, initialAuthState);
  const {
    loginUser,
  } = useAuthHttp();

  const AuthValue = useMemo(() => {
    const postLogin = async ({username, password}) => {
      try {
        const res = await loginUser(username, password);
        if (res?.ok) {
          console.log({res});
          return res
        } else {
          let errorMsg = res?.body?.error_description?.split("_").join(" ");
          console.log({errorMsg});

          // CustomToast("error", errorMsg, 450);
        }
      } catch (error) {
        // CustomToast(
        //   "error",
        //   "Something went wrong! It might be network issue.",
        //   450
        // );
      }
    };
   

    return {
      state,
      postLogin,
     
    };
  }, [
    state,
    loginUser,
  ]);
  return (
    <AuthContext.Provider value={AuthValue}>{children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
