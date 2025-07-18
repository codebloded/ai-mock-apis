import { useEffect } from "react";
import "./App.css";

import MainRouter from "./routes";
import { Toaster } from "./components/ui/toaster";
import { Boundary } from "./components/ui/boundary";
import { useToast } from "./hooks/use-toast";

function App() {
  return (
    <Boundary>
      <MainRouter />
      <Toaster />
    </Boundary>
  );
}

export default App;
