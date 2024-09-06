import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes";
import { AlertToast } from "./components";

function App() {
  return (
    <>
      <AlertToast />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
