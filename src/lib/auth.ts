import { supabase } from './supabase';
import type { AuthError, AuthResponse } from '@supabase/supabase-js';

export const handleAuthError = (error: AuthError) => {
  // Map Supabase error messages to user-friendly messages
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please verify your email address',
    'User already registered': 'An account with this email already exists',
    'Password is too short': 'Password must be at least 6 characters',
    'Rate limit exceeded': 'Too many attempts. Please try again later'
  };

  return errorMap[error.message] || error.message;
};

export const signUp = async (email: string, password: string) => {
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (response.error) {
    throw new Error(handleAuthError(response.error));
  }

  return response.data;
};

export const signIn = async (email: string, password: string) => {
  const response = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (response.error) {
    throw new Error(handleAuthError(response.error));
  }

  return response.data;
};

export const signInWithGoogle = async () => {
  const response = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (response.error) {
    throw new Error(handleAuthError(response.error));
  }

  return response.data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(handleAuthError(error));
  }
};