import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from "./context/AuthContext";
import router from "./router";
import "./styles/global.css";
import "./styles/variables.css";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <AuthProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </AuthProvider>
  </React.StrictMode>,
);
