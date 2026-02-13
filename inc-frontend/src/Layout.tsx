import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Toolbar />
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
