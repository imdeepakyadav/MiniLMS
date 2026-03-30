import { useState } from 'react';
import * as authService from './authService';
import { useAuthStore } from '@store/authStore';
import { LoginRequest, RegisterRequest } from '@types/auth.types';

export const useAuth = () => {
  const { dispatch } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    clearError();
    try {
      const response = await authService.login(data);
      dispatch({ type: 'LOGIN', payload: response.data.user });
      return true;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    clearError();
    try {
      await authService.register(data);
      const loginData: LoginRequest = { email: data.email, password: data.password };
      await login(loginData);
      return true;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      dispatch({ type: 'LOGOUT' });
      setIsLoading(false);
    }
  };

  return { login, register, logout, isLoading, error, clearError };
};
