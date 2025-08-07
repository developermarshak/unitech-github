import { configureApiClient } from "@repo/api-client";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthPage, RepositoryPage } from "./components";

configureApiClient({
  baseUrl: import.meta.env.VITE_API_URL || "/api",
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#0a0a0a",
      paper: "#1a1a1a",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem("accessToken"));

  const handleAuthSuccess = (token: string) => {
    setAccessToken(token);
    console.log("User authenticated successfully!");
  };

  if (!accessToken) {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  return <RepositoryPage accessToken={accessToken} />;
};

createRoot(document.getElementById("app")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
