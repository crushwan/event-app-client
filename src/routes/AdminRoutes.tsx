import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute"; // Import Auth Guard

// Lazy load pages
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const EventList = lazy(() => import("../pages/admin/EventList"));
const CreateEvent = lazy(() => import("../pages/admin/CreateEvent"));
const EditEvent = lazy(() => import("../pages/admin/EditEvent"));

const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedRoute />, // Ensures only logged-in users access admin pages
    children: [
      {
        element: <AdminLayout />, // Admin layout wrapper
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "events", element: <EventList /> },
          { path: "events/create", element: <CreateEvent /> },
          { path: "events/edit/:id", element: <EditEvent /> },
        ],
      },
    ],
  },
];

export default AdminRoutes;
