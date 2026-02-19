import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4b5563", // Dark Grey
    },
    secondary: {
      main: "#9ca3af", // Medium Grey
    },
    background: {
      default: "#f5f5f5", // Light Grey Background
      paper: "#ffffff",   // White Cards
    },
    text: {
      primary: "#1f2937", // Dark Grey Text
      secondary: "#6b7280", // Muted Grey
    },
    error: {
      main: "#6b7280", // Soft grey instead of harsh red (minimalist)
    },
  },

  typography: {
    fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
    h4: {
      fontWeight: 600,
      color: "#1f2937",
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 12, // Smooth modern corners
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 500,
        },
        contained: {
          backgroundColor: "#374151",
          "&:hover": {
            backgroundColor: "#1f2937",
          },
        },
        outlined: {
          borderColor: "#d1d5db",
          color: "#374151",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1f2937",
          boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
          borderBottom: "1px solid #e5e7eb",
        },
      },
    },
  },
});

export default theme;
