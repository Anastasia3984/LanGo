import React from "react";
import { ModalProvider } from "./context/ModalContext";
import RegPage from "./pages/RegPage/RegPage";
import StudPage from "./pages/StudPage/StudPage";
import TeachPage from "./pages/TeachPage/TeachPage";

function App() {
  return (
    <ModalProvider>
      {/* <RegPage /> */}
      {/* <StudPage /> */}
      <TeachPage />
    </ModalProvider>
  );
}

export default App;
