import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
  ListItemIcon,
  ListItemText,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArticleIcon from '@mui/icons-material/Article';
import PollIcon from '@mui/icons-material/Poll';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import BalanceIcon from '@mui/icons-material/Balance';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const pollRegions = [
  { label: "Ανατολική Μακεδονία και Θράκη" },
  { label: "Κεντρική Μακεδονία" },
  { label: "Δυτική Μακεδονία" },
  { label: "Ήπειρος" },
  { label: "Θεσσαλία" },
  { label: "Ιόνια Νησιά" },
  { label: "Δυτική Ελλάδα" },
  { label: "Στερεά Ελλάδα" },
  { label: "Αττική" },
  { label: "Πελοπόννησος" },
  { label: "Βόρειο Αιγαίο" },
  { label: "Νότιο Αιγαίο" },
  { label: "Κρήτη" }
];

const iconMap = {
  'fa-newspaper': <NewspaperIcon />,
  'fa-file-lines': <ArticleIcon />,
  'fa-square-poll-vertical': <PollIcon />,
  'fa-graduation-cap': <SchoolIcon />,
  'fa-users': <PeopleIcon />,
};

const topMenu = [
  { label: "Ειδήσεις", to: "/news", icon: "fa-newspaper" },
  { label: "Άρθρα", to: "/articles", icon: "fa-file-lines" },
  {
    label: "Ψηφοφορίες",
    to: "/polls",
    icon: "fa-square-poll-vertical",
    subItems: pollRegions
  },
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

export default function MenuBars() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEls, setAnchorEls] = useState({});
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { user: authUser } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMenuHidden, setIsMenuHidden] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event, label) => {
    setAnchorEls({ ...anchorEls, [label]: event.currentTarget });
  };

  const handleMenuClose = (label) => {
    setAnchorEls({ ...anchorEls, [label]: null });
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (mobileOpen) {
        setIsMenuHidden(false);
        lastScrollY = window.scrollY;
        return;
      }

      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollY;
      const pastThreshold = currentY > 80;
      const shouldHide = isScrollingDown && pastThreshold;

      setIsMenuHidden((prev) => (prev === shouldHide ? prev : shouldHide));

      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {topMenu
          .filter((item) => !item.requireAuth || authUser)
          .map((item) => (
            <Box key={item.label}>
              <ListItemButton
                component={item.subItems ? 'div' : Link}
                to={!item.subItems ? item.to : undefined}
                onClick={() => item.subItems && toggleSubmenu(item.label)}
                selected={location.pathname === item.to}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {iconMap[item.icon]}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {item.subItems && (openSubmenu === item.label ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              {item.subItems && (
                <Collapse in={openSubmenu === item.label} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.label}
                        component={subItem.to ? Link : 'div'}
                        to={subItem.to}
                        sx={{ pl: 4 }}
                        selected={location.pathname === subItem.to}
                        onClick={() => subItem.to && setMobileOpen(false)}
                      >
                        <ListItemText 
                          primary={subItem.label} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
      </List>
      <Box sx={{ p: 2 }}>
        <UserMenu user={authUser} />
      </Box>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        transform: isMenuHidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 360ms ease',
        bgcolor: '#0b172a',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '10px',
                bgcolor: '#1f2937',
                color: '#ffd447',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              <BalanceIcon fontSize="small" />
            </Box>
            <Box 
              component="span" 
              sx={{ 
                fontSize: '1rem', 
                color: '#facc15', 
                fontWeight: 800,
                letterSpacing: '0.01em',
              }}
            >
              Apofasi
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
              {topMenu
                .filter((item) => !item.requireAuth || authUser)
                .map((item) => (
                  <Box key={item.label}>
                    <Button
                      component={item.subItems ? undefined : Link}
                      to={!item.subItems ? item.to : undefined}
                      onClick={(e) => item.subItems && handleMenuClick(e, item.label)}
                      startIcon={iconMap[item.icon]}
                      sx={{
                        color: location.pathname === item.to ? '#facc15' : '#e2e8f0',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        borderRadius: '9px',
                        px: 1.5,
                        py: 0.75,
                        bgcolor: location.pathname === item.to ? '#facc15' : 'transparent',
                        color: location.pathname === item.to ? '#0f172a' : '#e2e8f0',
                        '&:hover': {
                          bgcolor: location.pathname === item.to ? '#fbbf24' : 'rgba(255, 255, 255, 0.08)',
                          color: location.pathname === item.to ? '#0f172a' : '#fff',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                    {item.subItems && (
                      <Menu
                        anchorEl={anchorEls[item.label]}
                        open={Boolean(anchorEls[item.label])}
                        onClose={() => handleMenuClose(item.label)}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            bgcolor: '#0b172a',
                            border: '1px solid rgba(226, 232, 240, 0.12)',
                          }
                        }}
                      >
                        {item.subItems.map((subItem) => (
                          <MenuItem
                            key={subItem.label}
                            component={subItem.to ? Link : undefined}
                            to={subItem.to}
                            onClick={() => handleMenuClose(item.label)}
                            selected={location.pathname === subItem.to}
                            sx={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: location.pathname === subItem.to ? '#0f172a' : '#e2e8f0',
                              bgcolor: location.pathname === subItem.to ? '#facc15' : 'rgba(226, 232, 240, 0.08)',
                              '&:hover': {
                                bgcolor: location.pathname === subItem.to ? '#fbbf24' : 'rgba(255, 255, 255, 0.12)',
                              },
                              '&.Mui-selected': {
                                bgcolor: '#facc15',
                                color: '#0f172a',
                                '&:hover': {
                                  bgcolor: '#fbbf24',
                                },
                              },
                            }}
                          >
                            {subItem.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </Box>
                ))}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && <UserMenu user={authUser} />}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                borderRadius: '9px',
                width: 34,
                height: 34,
              }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Box>
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
