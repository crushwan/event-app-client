import { RouteObject } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import EventGallery from "../pages/user/EventGallery";
import EventDetail from "../pages/user/EventDetail";

const UserRoutes: RouteObject[] = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { path: "", element: <EventGallery /> }, // Home page shows event list
      { path: "event/:id", element: <EventDetail /> }, // View single event
    ],
  },
];

export default UserRoutes;
