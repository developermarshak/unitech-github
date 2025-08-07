import { apiClient } from '@repo/api-client';
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Avatar,
  Checkbox,
  FormControlLabel,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

interface AuthPageProps {
  onSuccess?: (accessToken: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field] || errors.form) {
      setErrors(prev => ({ ...prev, [field]: '', form: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }



    if (isSignUp && !formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await apiClient.signup({
          email: formData.email,
          password: formData.password,
        });
        // Optionally, switch to sign-in mode after successful sign-up
        toggleMode();
      } else {
        const { accessToken } = await apiClient.signin({
          email: formData.email,
          password: formData.password,
        });
        console.log('Signed in successfully, token:', accessToken);
        localStorage.setItem('accessToken', accessToken);
      }
      
      if (onSuccess && !isSignUp) {
        onSuccess(localStorage.getItem('accessToken') as string);
      }
    } catch (error: any) {
      setErrors(prev => ({ ...prev, form: error.message || 'An unexpected error occurred' }));
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      agreeToTerms: false,
    });
    setErrors({});
    if (errors.form) {
      setErrors(prev => ({...prev, form: ''}));
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                }}
              >
                <LockOutlined />
              </Avatar>
              <Typography component="h1" variant="h4" fontWeight="bold">
                {isSignUp ? 'Sign up' : 'Welcome Back'}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
                {isSignUp 
                  ? 'Join us today and start your journey'
                  : 'Sign in to your account to continue'
                }
              </Typography>
            </Box>



            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
                sx={{ mb: 2 }}
              />

              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
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

              {isSignUp && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange('agreeToTerms')}
                      disabled={isLoading}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link href="#" underline="hover">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" underline="hover">
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />
              )}

              {errors.agreeToTerms && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.agreeToTerms}
                </Alert>
              )}

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
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                {isLoading 
                  ? (isSignUp ? 'Signing up...' : 'Signing In...') 
                  : (isSignUp ? 'Sign up' : 'Sign In')
                }
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={toggleMode}
                    underline="hover"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
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
          © 2024 Your Company. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};