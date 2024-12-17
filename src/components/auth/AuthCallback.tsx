import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          throw error;
        }

        // Redirect back to the app
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Auth callback failed:', error);
        navigate('/auth/error', { 
          replace: true,
          state: { error: 'Authentication failed. Please try again.' }
        });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 dark:border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};