// // theme.js
// import { createTheme } from "@mui/material/styles";

// export const getTheme = (mode) =>
//     createTheme({
//         palette: {
//             mode,
//             ...( mode === "light" ? {
//                     primary: { main: "#2563eb" },
//                     background: { default: "#f8fafc", paper: "#ffffff" },
//                     text: { primary: "#1e293b", secondary: "#475569" }
//                 }
//                 : {
//                     primary: { main: "#3b82f6" },
//                     background: { default: "#0f172a", paper: "#1e293b" },
//                     text: { primary: "#f1f5f9", secondary: "#94a3b8" }
//                 }
//             )
//         },

//         shape: { borderRadius: 12 },

//         typography: { fontFamily: "Inter, sans-serif" },

//         components: {
//             MuiButton: {
//                 styleOverrides: {
//                     root: { textTransform: "none", borderRadius: 10 }
//                 }
//             },

//             MuiPaper: {
//                 styleOverrides: {
//                     root: { borderRadius: 16 }
//                 }
//             }
//         }
//     });


// theme.js
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#2563EB" // corporate blue
      },
      background: {
        default: mode === "light" ? "#F4F6F8" : "#0F172A",
        paper: mode === "light" ? "#FFFFFF" : "#1E293B"
      },
      text: {
        primary: mode === "light" ? "#1E293B" : "#F1F5F9",
        secondary: mode === "light" ? "#64748B" : "#94A3B8"
      },
      divider: mode === "light" ? "#E2E8F0" : "#334155"
    },

    shape: {
      borderRadius: 12
    },

    typography: {
      fontFamily: "Inter, sans-serif",
      h6: {
        fontWeight: 600
      }
    },

    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)"
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)"
          }
        }
      }
    }
  });