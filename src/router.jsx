import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RegPage from "./pages/RegPage/RegPage";
import TeachPage from "./pages/TeachPage/TeachPage";
import StudPage from "./pages/StudPage/StudPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RegPage />,
  },
  {
    path: "/teacher",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <TeachPage />,
      },
      {
        path: "student/:studentId",
        element: <StudPage userRole="teacher" />,
      },
    ],
  },
  {
    path: "/student",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <StudPage userRole="student" />,
      },
    ],
  },
]);

export default router;
