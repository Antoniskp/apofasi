import { createTheme } from "@mui/material/styles";

// Create theme once at module scope (not in component)
// Using system fonts for zero network overhead and instant rendering
export const theme = createTheme({
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  palette: {
    primary: {
      main: "#22375a",
      dark: "#122038",
      light: "#e7edf5",
    },
    secondary: {
      main: "#facc15",
      dark: "#f59e0b",
      light: "#fef3c7",
    },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    // MuiButton variants to avoid inline sx objects
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          letterSpacing: "0.01em",
          padding: "10px 14px",
          boxShadow: "0 10px 25px rgba(34, 55, 90, 0.18)",
          transition: "transform 120ms ease, box-shadow 120ms ease, background 120ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 16px 34px rgba(34, 55, 90, 0.2)",
          },
        },
      },
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            boxShadow: "none",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },
  },
});
