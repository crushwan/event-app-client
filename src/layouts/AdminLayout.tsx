import { Outlet } from "react-router-dom";
import Sidebar from "./../components/Sidebar";
import Header from "./../components/Header";
import { Box, CssBaseline } from "@mui/material";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar /> {/* Left Sidebar */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header /> {/* Top Navbar */}
        <Outlet /> {/* Admin pages will be loaded here */}
      </Box>
    </Box>
  );
};

export default AdminLayout;