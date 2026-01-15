import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../lib/api.js";
import { useTheme as useCustomTheme } from "../lib/ThemeContext.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import PollIcon from "@mui/icons-material/Poll";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function UserMenu({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useCustomTheme();
  const { refreshAuth } = useAuth();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      handleClose();
      await refreshAuth();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleNavigation = (path) => {
    handleClose();
    navigate(path);
  };

  const isAuthenticated = Boolean(user);
  const userName = user?.displayName || user?.firstName || user?.email || "User";
  const userAvatar = user?.avatar;

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ 
          display: "flex", 
          gap: 0.5, 
          color: "#e2e8f0",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
        }}
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {isAuthenticated && userAvatar ? (
          <Avatar src={userAvatar} alt={userName} sx={{ width: 32, height: 32 }} />
        ) : (
          <AccountCircleIcon sx={{ fontSize: 32 }} />
        )}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {isAuthenticated ? userName : "Menu"}
          </Typography>
          <ExpandMoreIcon fontSize="small" />
        </Box>
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "user-menu-button",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {isAuthenticated ? (
          <>
            <MenuItem onClick={() => handleNavigation("/polls/my-polls")}>
              <ListItemIcon>
                <PollIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Polls</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/profile")}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Log out</ListItemText>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleNavigation("/auth")}>
              <ListItemIcon>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign in</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/register")}>
              <ListItemIcon>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign up</ListItemText>
            </MenuItem>
          </>
        )}
        <Divider />
        <MenuItem onClick={handleThemeToggle}>
          <ListItemIcon>
            {theme === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{theme === "dark" ? "Light mode" : "Dark mode"}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
