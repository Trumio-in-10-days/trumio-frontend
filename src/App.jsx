import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./screens/Landing";
import AuthPage from "./screens/Auth";
import AdminDashboard from "./screens/Admin";
import StudentDashboard from "./screens/Student";
import StudentProfile from "./screens/StudentProfile";
import ProjectDetailsPage from "./screens/ProjectDetails";
import Apply from "./screens/ApplyForm";
import ApplicationDetailsPage from "./screens/ApplicationDetails";
function App() {
  const [count, setCount] = useState(0);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/auth",
      element: <AuthPage />,
    },
    {
      path: "/client",
      element: <AdminDashboard />,
    },
    {
      path: "/student",
      element: <StudentDashboard />,
    },
    {
      path: "/apply/:projectId",
      element: <Apply />,
    },
    {
      path: "/projects/:student_id/applicants/:application._id",
      element: <ApplicationDetailsPage />,
    },
    {
      path: "/student/:id",
      element: <StudentProfile />,
    },
    {
      path: "/project/:project_id",
      element: <ProjectDetailsPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
