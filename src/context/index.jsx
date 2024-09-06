import { AlertContextProvider } from "./alertContext";
import { AuthContextProvider } from "./authContext";
import { CommonContextProvider } from "./common";

export function AppContextProvider({ children }) {
  return (
    <AlertContextProvider>
      <CommonContextProvider>
        <AuthContextProvider>{children}</AuthContextProvider>
      </CommonContextProvider>
    </AlertContextProvider>
  );
}
