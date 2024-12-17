import { useCallback } from 'react';

export const useNavigate = () => {
  const navigateToLanding = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    navigateToLanding
  };
};