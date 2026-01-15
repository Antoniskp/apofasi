import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../lib/AuthContext.jsx";
import UserMenu from "./UserMenu.jsx";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BalanceIcon from "@mui/icons-material/Balance";

const topMenu = [
  { label: "Ειδήσεις", to: "/news", icon: "fa-newspaper" },
  { label: "Άρθρα", to: "/articles", icon: "fa-file-lines" },
  { label: "Ψηφοφορίες", to: "/polls", icon: "fa-square-poll-vertical" },
  {
    label: "Εκπαίδευση",
    to: "/education",
    icon: "fa-graduation-cap",
    subItems: [
      { label: "Οικονομία", to: "/education/economics" },
      { label: "Κρατικές εφαρμογές", to: "/education/government-apps" },
      { label: "Στατιστικά Δημοσίου", to: "/education/government-statistics" },
      { label: "Ελληνικό νομικό σύστημα", to: "/education/greek-law-system" }
    ]
  },
  { label: "Χρήστες", to: "/users", icon: "fa-users", requireAuth: true }
];

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({
    threshold: 80,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function MenuBars() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElDesktop, setAnchorElDesktop] = useState({});
  const [openSubmenuMobile, setOpenSubmenuMobile] = useState(null);
  const { user: authUser } = useAuth();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopMenuClick = (event, label) => {
    setAnchorElDesktop({ ...anchorElDesktop, [label]: event.currentTarget });
  };

  const handleDesktopMenuClose = (label) => {
    setAnchorElDesktop({ ...anchorElDesktop, [label]: null });
  };

  const toggleSubmenuMobile = (label) => {
    setOpenSubmenuMobile(openSubmenuMobile === label ? null : label);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpenSubmenuMobile(null);
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BalanceIcon sx={{ color: "#facc15" }} />
          <Link to="/" style={{ textDecoration: "none", color: "inherit", fontWeight: 800 }} onClick={closeMobileMenu}>
            Apofasi
          </Link>
        </Box>
        <IconButton onClick={handleDrawerToggle} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {topMenu
          .filter((item) => !item.requireAuth || authUser)
          .map((item) =>
            item.subItems ? (
              <Box key={item.label}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.to}
                    onClick={() => toggleSubmenuMobile(item.label)}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                  <IconButton onClick={() => toggleSubmenuMobile(item.label)} edge="end">
                    {openSubmenuMobile === item.label ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </ListItem>
                <Collapse in={openSubmenuMobile === item.label} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.label}
                        component={Link}
                        to={subItem.to}
                        selected={location.pathname === subItem.to}
                        sx={{ pl: 4 }}
                        onClick={closeMobileMenu}
                      >
                        <ListItemText primary={subItem.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  selected={location.pathname === item.to}
                  onClick={closeMobileMenu}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            )
          )}
      </List>
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <UserMenu user={authUser} />
      </Box>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="sticky"
          sx={{
            bgcolor: "#0b172a",
            borderBottom: "1px solid #0f1f38",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", maxWidth: 1200, width: "100%", mx: "auto" }}>
            {/* Left side - Logo and mobile menu button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1, display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BalanceIcon sx={{ color: "#facc15" }} />
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "#facc15",
                    fontWeight: 800,
                    fontSize: "1rem",
                  }}
                >
                  Apofasi
                </Link>
              </Box>
            </Box>

            {/* Center - Desktop navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, flexGrow: 1, justifyContent: "center" }}>
              {topMenu
                .filter((item) => !item.requireAuth || authUser)
                .map((item) =>
                  item.subItems ? (
                    <Box key={item.label}>
                      <Button
                        component={Link}
                        to={item.to}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDesktopMenuClick(e, item.label);
                        }}
                        endIcon={anchorElDesktop[item.label] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{
                          color: location.pathname === item.to ? "#0f172a" : "#e2e8f0",
                          bgcolor: location.pathname === item.to ? "#facc15" : "transparent",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          "&:hover": {
                            bgcolor: location.pathname === item.to ? "#fbbf24" : "rgba(255, 255, 255, 0.12)",
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                      <Menu
                        anchorEl={anchorElDesktop[item.label]}
                        open={Boolean(anchorElDesktop[item.label])}
                        onClose={() => handleDesktopMenuClose(item.label)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        PaperProps={{
                          sx: {
                            bgcolor: "#0b172a",
                            color: "#e2e8f0",
                            mt: 1,
                          },
                        }}
                      >
                        {item.subItems.map((subItem) => (
                          <MenuItem
                            key={subItem.label}
                            component={Link}
                            to={subItem.to}
                            selected={location.pathname === subItem.to}
                            onClick={() => handleDesktopMenuClose(item.label)}
                            sx={{
                              "&.Mui-selected": {
                                bgcolor: "rgba(250, 204, 21, 0.12)",
                              },
                            }}
                          >
                            {subItem.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  ) : (
                    <Button
                      key={item.label}
                      component={Link}
                      to={item.to}
                      sx={{
                        color: location.pathname === item.to ? "#0f172a" : "#e2e8f0",
                        bgcolor: location.pathname === item.to ? "#facc15" : "transparent",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        "&:hover": {
                          bgcolor: location.pathname === item.to ? "#fbbf24" : "rgba(255, 255, 255, 0.12)",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                )}
            </Box>

            {/* Right side - Desktop user menu */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <UserMenu user={authUser} />
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
