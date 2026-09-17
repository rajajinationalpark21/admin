import { createTheme } from "@mui/material/styles";

const THEME_PALETTES = {
  light: {
    mode: "light",
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#09090B",
      light: "#27272A",
      dark: "#000000",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#2563EB",
      light: "#3B82F6",
      dark: "#1D4ED8",
    },
    warning: {
      main: "#D97706",
      light: "#F59E0B",
      dark: "#B45309",
    },
    error: {
      main: "#DC2626",
      light: "#EF4444",
      dark: "#B91C1C",
    },
    success: {
      main: "#059669",
      light: "#10B981",
      dark: "#047857",
    },
    divider: "#E4E4E7",
    text: {
      primary: "#000000",
      secondary: "#52525B",
      disabled: "#A1A1AA",
    },
    tableHeadBg: "#F4F4F5",
    tableRowHover: "#FAFAFA",
    inputBg: "#FFFFFF",
    inputBorder: "#E4E4E7",
  },
  dark: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "#0A0A0A",
    },
    primary: {
      main: "#FFFFFF",
      light: "#F4F4F5",
      dark: "#E4E4E7",
      contrastText: "#000000",
    },
    secondary: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    divider: "#262626",
    text: {
      primary: "#FFFFFF",
      secondary: "#A1A1AA",
      disabled: "#52525B",
    },
    tableHeadBg: "#141414",
    tableRowHover: "rgba(255, 255, 255, 0.05)",
    inputBg: "#0A0A0A",
    inputBorder: "#262626",
  },
  jungle: {
    mode: "dark",
    background: {
      default: "#070E1E",
      paper: "#0E1F40",
    },
    primary: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#38BDF8",
      light: "#7DD3FC",
      dark: "#0284C7",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    divider: "#172E5C",
    text: {
      primary: "#FFFFFF",
      secondary: "#6EE7B7",
      disabled: "#334E7B",
    },
    tableHeadBg: "#0A1630",
    tableRowHover: "rgba(16, 185, 129, 0.08)",
    inputBg: "#09152D",
    inputBorder: "#1A3366",
  },
};

export const getMuiTheme = (themeName = "light") => {
  const paletteConfig = THEME_PALETTES[themeName] || THEME_PALETTES.light;

  return createTheme({
    palette: {
      mode: paletteConfig.mode,
      background: paletteConfig.background,
      primary: paletteConfig.primary,
      secondary: paletteConfig.secondary,
      warning: paletteConfig.warning,
      error: paletteConfig.error,
      success: paletteConfig.success,
      divider: paletteConfig.divider,
      text: paletteConfig.text,
    },
    typography: {
      fontFamily: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h1: { fontWeight: 700, letterSpacing: "-0.025em" },
      h2: { fontWeight: 700, letterSpacing: "-0.025em" },
      h3: { fontWeight: 600, letterSpacing: "-0.02em" },
      h4: { fontWeight: 600, letterSpacing: "-0.015em" },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600, fontSize: "1rem" },
      subtitle1: { fontSize: "0.875rem" },
      subtitle2: { fontSize: "0.75rem" },
      body1: { fontSize: "0.875rem" },
      body2: { fontSize: "0.8125rem" },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: paletteConfig.background.default,
            color: paletteConfig.text.primary,
            transition: "background-color 0.2s ease, color 0.2s ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: paletteConfig.background.paper,
            border: `1px solid ${paletteConfig.divider}`,
            boxShadow: paletteConfig.mode === "light"
              ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: paletteConfig.background.paper,
            border: `1px solid ${paletteConfig.divider}`,
            borderRadius: 12,
            boxShadow: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: paletteConfig.mode === "light" ? "#CBD5E1" : "#374151",
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: paletteConfig.background.paper,
            border: `1px solid ${paletteConfig.divider}`,
            borderRadius: 12,
            overflow: "hidden",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: paletteConfig.tableHeadBg,
            borderBottom: `1px solid ${paletteConfig.divider}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${paletteConfig.divider}`,
            fontSize: "0.8125rem",
            padding: "12px 16px",
          },
          head: {
            color: paletteConfig.text.secondary,
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.6875rem",
            letterSpacing: "0.05em",
            backgroundColor: paletteConfig.tableHeadBg,
          },
          body: {
            color: paletteConfig.text.primary,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: "background-color 0.15s ease",
            "&:hover": {
              backgroundColor: paletteConfig.tableRowHover,
            },
            "&:last-child td": {
              borderBottom: 0,
            },
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            color: paletteConfig.text.secondary,
            borderTop: `1px solid ${paletteConfig.divider}`,
          },
          selectIcon: {
            color: paletteConfig.text.secondary,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 600,
            fontSize: "0.75rem",
            height: 24,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            textTransform: "none",
            padding: "6px 14px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: paletteConfig.inputBg,
            borderRadius: 8,
            fontSize: "0.875rem",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: paletteConfig.inputBorder,
              transition: "border-color 0.15s ease",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: paletteConfig.mode === "light" ? "#94A3B8" : "#4B5563",
            },
            "&.Mui-focused": {
              boxShadow: paletteConfig.mode === "light"
                ? "0 0 0 3px rgba(16, 185, 129, 0.12)"
                : "0 0 0 3px rgba(16, 185, 129, 0.2)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: paletteConfig.primary.main,
              borderWidth: 1.5,
            },
          },
          input: {
            padding: "8.5px 14px",
            color: paletteConfig.text.primary,
            "&::placeholder": {
              color: paletteConfig.mode === "light" 
                ? "#94A3B8" 
                : (paletteConfig.mode === "dark" ? "#9CA3AF" : "#6EE7B7"),
              opacity: 0.85,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            paddingTop: "8.5px",
            paddingBottom: "8.5px",
            display: "flex",
            alignItems: "center",
          },
          icon: {
            color: paletteConfig.text.secondary,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: paletteConfig.background.paper,
            border: `1px solid ${paletteConfig.divider}`,
            borderRadius: 10,
            boxShadow: paletteConfig.mode === "light"
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: "0.8125rem",
            padding: "8px 14px",
            borderRadius: 6,
            margin: "2px 6px",
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: paletteConfig.tableRowHover,
            },
            "&.Mui-selected": {
              backgroundColor: paletteConfig.mode === "light"
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(16, 185, 129, 0.18)",
              color: paletteConfig.primary.main,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: paletteConfig.mode === "light"
                  ? "rgba(16, 185, 129, 0.15)"
                  : "rgba(16, 185, 129, 0.25)",
              },
            },
          },
        },
      },
    },
  });
};

export const muiTheme = getMuiTheme("light");
