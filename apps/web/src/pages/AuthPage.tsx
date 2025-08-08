import { useAuthForm } from "../hooks/useAuthForm.js";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface AuthPageProps {
  onSuccess?: (accessToken: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    isSignUp,
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
    toggleMode,
  } = useAuthForm({ onSuccess });

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Card
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography component="h1" variant="h4" fontWeight="bold">
                {isSignUp ? "Sign up" : "Welcome Back"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mt={1}
              >
                {isSignUp
                  ? "Join us today and start your journey"
                  : "Sign in to your account to continue"}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
                sx={{ mb: 2 }}
              />

              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {errors.form && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.form}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                {isLoading
                  ? isSignUp
                    ? "Signing up..."
                    : "Signing In..."
                  : isSignUp
                    ? "Sign up"
                    : "Sign In"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={toggleMode}
                    underline="hover"
                    sx={{ fontWeight: "bold" }}
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 3 }}
        >
          © 2025 The Coolest Company. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};
