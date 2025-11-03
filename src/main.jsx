import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import router from "./router";
import "./styles/global.css";
import "./styles/variables.css";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  </React.StrictMode>,
);
