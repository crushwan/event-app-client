import { createBrowserRouter } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
  ...AdminRoutes,
  ...UserRoutes,
  { path: "/login", element: <Login /> }, // Public login route
  { path: "/signup", element: <Signup /> }, // Public signup route
  { path: "*", element: <NotFound /> }, // Catch-all for 404 pages
]);

export default router;
