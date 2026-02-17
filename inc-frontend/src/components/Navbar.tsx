import { AppBar, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setOpenLogoutDialog(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
             Velaris Incident Tracker
          </Typography>

          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              onClick={() => setOpenLogoutDialog(true)}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <ConfirmDialog
        open={openLogoutDialog}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setOpenLogoutDialog(false)}
      />
    </>
  );
};

export default Navbar;
