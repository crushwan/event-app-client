import { Outlet } from "react-router-dom";
import Header from "./../components/Header";

const UserLayout = () => {
  return (
    <div className="user-container">
      <Header /> {/* User navigation */}
      <main className="user-content">
        <Outlet /> {/* Render user pages like EventGallery & EventDetails */}
      </main>
    </div>
  );
};

export default UserLayout;
