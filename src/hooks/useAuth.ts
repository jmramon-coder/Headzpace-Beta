import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as authService from '../services/auth.service';
import * as profileService from '../services/profile.service';
import type { User } from '../types';
import type { AuthError } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        initializeUser(session.user.id, session.user.email!);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await initializeUser(session.user.id, session.user.email!);
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const initializeUser = async (id: string, email: string) => {
    try {
      // Get or create profile
      let profile;
      try {
        profile = await profileService.getProfile(id);
      } catch {
        profile = await profileService.createProfile({ id, email });
      }

      setState({
        user: {
          id: profile.id,
          email: profile.email,
          widgets: []
        },
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize user'
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.signUp(email, password);
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign up failed',
        isLoading: false
      }));
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.signIn(email, password);
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign in failed',
        isLoading: false
      }));
      return false;
    }
  };

  const signInWithGoogle = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.signInWithGoogle();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Google sign in failed',
        isLoading: false
      }));
      return false;
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.signOut();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign out failed',
        isLoading: false
      }));
      return false;
    }
  };

  return {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  };
};