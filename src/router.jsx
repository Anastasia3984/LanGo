import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import TeachPage from "./pages/TeachPage/TeachPage.jsx";
import StudPage from "./pages/StudPage/StudPage.jsx";
import RegPage from "./pages/RegPage/RegPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <TeachPage />,
      },
      {
        path: "student",
        element: <StudPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "register",
        element: <RegPage />,
      },
    ],
  },
]);

export default router;
