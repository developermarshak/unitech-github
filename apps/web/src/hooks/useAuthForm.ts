import { useState, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { apiClient } from "@repo/api-client";

interface FormData {
  email: string;
  password: string;
}

interface UseAuthFormOptions {
  /**
   * Optional callback that will be invoked with the newly received access token
   * after a successful sign-in.
   */
  onSuccess?: (accessToken: string) => void;
}

interface UseAuthFormReturn {
  isSignUp: boolean;
  formData: FormData;
  errors: Record<string, string>;
  isLoading: boolean;
  handleInputChange: (
    field: keyof FormData,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: FormEvent) => Promise<void>;
  toggleMode: () => void;
}

/**
 * Encapsulates all business logic required by the AuthPage component so that the
 * component itself can focus purely on presentation.
 */
export const useAuthForm = (
  options: UseAuthFormOptions = {},
): UseAuthFormReturn => {
  const { onSuccess } = options;

  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox" ? event.target.checked : event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field] || errors.form) {
        setErrors((prev) => ({ ...prev, [field]: "", form: "" }));
      }
    },
    [errors],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isSignUp]);

  const toggleMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setFormData({ email: "", password: "" });
    setErrors({});
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);
      try {
        if (isSignUp) {
          await apiClient.signup({
            email: formData.email,
            password: formData.password,
          });
          // Switch to sign-in mode after successful sign-up so the user can login immediately.
          toggleMode();
        } else {
          const { accessToken } = await apiClient.signin({
            email: formData.email,
            password: formData.password,
          });
          localStorage.setItem("accessToken", accessToken);
          onSuccess?.(accessToken);
        }
      } catch (error: any) {
        setErrors((prev) => ({
          ...prev,
          form: error.message || "An unexpected error occurred",
        }));
        // eslint-disable-next-line no-console
        console.error("Auth error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [validateForm, isSignUp, formData, onSuccess, toggleMode],
  );

  return {
    isSignUp,
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
    toggleMode,
  };
};
