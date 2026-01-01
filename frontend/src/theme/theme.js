import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Light Mode
            primary: {
              main: "#1976d2",
              dark: "#115293",
              light: "#42a5f5",
            },
            secondary: {
              main: "#7b1fa2",
              dark: "#6a1b9a",
              light: "#9c27b0",
            },
            success: {
              main: "#4caf50",
              light: "#66bb6a",
              dark: "#2e7d32",
            },
            warning: {
              main: "#ff9800",
              light: "#ffb74d",
              dark: "#f57c00",
            },
            error: {
              main: "#f44336",
              light: "#ef5350",
              dark: "#d32f2f",
            },
            info: {
              main: "#2196f3",
              light: "#42a5f5",
              dark: "#1976d2",
            },
            background: {
              default: "#f5f5f5",
              paper: "#ffffff",
            },
            text: {
              primary: "#1a1a1a",
              secondary: "#1a1a1a",
              disabled: "#9e9e9e",
            },
          }
        : {
            // Dark Mode - Professional Colors
            primary: {
              main: "#42a5f5",
              dark: "#1976d2",
              light: "#64b5f6",
            },
            secondary: {
              main: "#ba68c8",
              dark: "#9c27b0",
              light: "#ce93d8",
            },
            success: {
              main: "#66bb6a",
              light: "#81c784",
              dark: "#4caf50",
            },
            warning: {
              main: "#ffa726",
              light: "#ffb74d",
              dark: "#ff9800",
            },
            error: {
              main: "#ef5350",
              light: "#e57373",
              dark: "#f44336",
            },
            info: {
              main: "#42a5f5",
              light: "#64b5f6",
              dark: "#2196f3",
            },
            background: {
              default: "#0a0a0a", // Main background - Pure dark
              paper: "#1a1a1a", // Card background - Slightly lighter
            },
            text: {
              primary: "#ffffff", // Main text - Pure white
              secondary: "#b0b0b0", // Secondary text - Light gray
              disabled: "#666666", // Disabled text
            },
            divider: "#333333", // Dividers
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      allVariants: {
        color: mode === "dark" ? "#ffffff" : "#1a1a1a",
      },
      h1: {
        fontWeight: 800,
        letterSpacing: -0.5,
        color: mode === "dark" ? "#ffffff" : "#1a1a1a",
      },
      h2: {
        fontWeight: 800,
        letterSpacing: -0.5,
        color: mode === "dark" ? "#ffffff" : "#1a1a1a",
      },
      h3: {
        fontWeight: 700,
        color: mode === "dark" ? "#ffffff" : "#1a1a1a",
      },
      h4: {
        fontWeight: 700,
        color: mode === "dark" ? "#ffffff" : "#1a1a1a",
      },
      h5: {
        fontWeight: 700,
        color: mode === "dark" ? "#ffffff" : "#1a1a1a",
      },
      h6: {
        fontWeight: 700,
        color: mode === "dark" ? "#ffffff" : "#ffffff",
      },
      subtitle1: {
        color: mode === "dark" ? "#ffffff" : "#1a1a1a",
      },
      subtitle2: {
        color: mode === "dark" ? "#ffffff" : "#1a1a1a",
      },
      body1: {
        color: mode === "dark" ? "#e0e0e0" : "#1a1a1a",
      },
      body2: {
        color: mode === "dark" ? "#ffffff" : "#ffffff",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
      caption: {
        color: mode === "dark" ? "#ffffff" : "#ffffff",
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === "dark" ? "#0a0a0a" : "#f5f5f5",
            transition: "background-color 0.3s ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "10px 24px",
            fontSize: "0.95rem",
            fontWeight: 600,
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 4px 12px rgba(66,165,245,0.3)"
                  : "0 4px 12px rgba(0,0,0,0.15)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: mode === "dark" ? "#1a1a1a" : "#ffffff",
            transition: "all 0.3s ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: mode === "dark" ? "#1a1a1a" : "#ffffff",
            transition: "all 0.3s ease",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1a1a1a" : "#1976d2",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              backgroundColor: mode === "dark" ? "#1a1a1a" : "#ffffff",
              "& fieldset": {
                borderColor: mode === "dark" ? "#333333" : "#e0e0e0",
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#555555" : "#bdbdbd",
              },
            },
            "& .MuiInputLabel-root": {
              color: mode === "dark" ? "#b0b0b0" : "#757575",
            },
            "& .MuiOutlinedInput-input": {
              color: mode === "dark" ? "#ffffff" : "#1a1a1a",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: mode === "dark" ? "#333333" : "#e0e0e0",
            color: mode === "dark" ? "#ffffff" : "#1a1a1a",
          },
          head: {
            backgroundColor: mode === "dark" ? "#242424" : "#fafafa",
            color: mode === "dark" ? "#ffffff" : "#1a1a1a",
            fontWeight: 700,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: mode === "dark" ? "#333333" : "#e0e0e0",
          },
        },
      },
    },
  });
