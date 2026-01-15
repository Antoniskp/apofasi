import { createTheme } from '@mui/material/styles';

// Create a custom Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#22375a',
      light: '#3b5af6',
      dark: '#122038',
      contrastText: '#fff',
    },
    secondary: {
      main: '#facc15',
      light: '#fbbf24',
      dark: '#eab308',
      contrastText: '#0f172a',
    },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    h1: {
      fontSize: '2.8rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 700,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 14px',
          boxShadow: '0 10px 25px rgba(34, 55, 90, 0.18)',
          transition: 'transform 120ms ease, box-shadow 120ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 16px 34px rgba(34, 55, 90, 0.2)',
          },
        },
        outlined: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 6px 16px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 26px rgba(15, 23, 42, 0.14)',
        },
      },
    },
  },
});

export default theme;
