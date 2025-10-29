import React from "react";
import { ModalProvider } from "./context/ModalContext";
import MainLayout from "./layouts/MainLayout";
import RegPage from "./pages/RegPage/RegPage";
import TeachPage from "./pages/TeachPage/TeachPage";
import StudPage from "./pages/StudPage/StudPage";

function App() {
  return (
    <ModalProvider>
      <MainLayout>
        {/*<RegPage />*/}
        <TeachPage />
        {/*<StudPage />*/}
      </MainLayout>
    </ModalProvider>
  );
}

export default App;
