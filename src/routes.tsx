import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthCallback } from './components/auth/AuthCallback';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />
  }
]);
