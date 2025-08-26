import { useState, useEffect } from 'react';
// import googleAuth from '../services/googleAuth'; // Disabled - using direct OAuth
import googleAuthDirect from '../services/googleAuthDirect';

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

interface UseGoogleAuthReturn {
  isSignedIn: boolean;
  isLoading: boolean;
  user: GoogleUser | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Don't show loading initially
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false); // Start without demo mode

  // Demo user data
  const demoUser: GoogleUser = {
    id: 'demo-user-001',
    name: 'Demo',
    email: 'demo@example.com',
    imageUrl: 'https://via.placeholder.com/40/007bff/ffffff?text=D'
  };

  useEffect(() => {
    const initAuth = async () => {
      // Check if returning from OAuth redirect
      if (!isDemoMode && googleAuthDirect.isSignedIn()) {
        try {
          const userData = await googleAuthDirect.getCurrentUser();
          if (userData) {
            setIsSignedIn(true);
            setUser(userData.profile);
          }
        } catch (err) {
          console.error('Error getting user data:', err);
        }
        setIsLoading(false);
        return;
      }
      
      // Handle demo mode
      if (isDemoMode) {
        setIsSignedIn(true);
        setUser(demoUser);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]);

  const signIn = async () => {
    setIsLoading(true);
    setError(null);
    
    if (isDemoMode) {
      // Demo mode - instant sign in
      setIsSignedIn(true);
      setUser(demoUser);
      setIsLoading(false);
      return;
    }
    
    // Use direct OAuth implementation
    try {
      // Check if we're returning from OAuth redirect
      if (googleAuthDirect.isSignedIn()) {
        const userData = await googleAuthDirect.getCurrentUser();
        if (userData) {
          setIsSignedIn(true);
          setUser(userData.profile);
        }
        setIsLoading(false);
      } else {
        // Redirect to Google OAuth
        googleAuthDirect.signIn();
        // Page will redirect, so loading continues
      }
    } catch (err) {
      console.error('Sign in failed:', err);
      setError('Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isDemoMode) {
        // Demo mode - clear the state and local storage
        setIsSignedIn(false);
        setUser(null);
        // Clear demo mode flag to prevent auto-login with demo on next Google sign-in
        localStorage.removeItem('timeSync_isDemoMode');
        setIsDemoMode(false);
      } else {
        googleAuthDirect.signOut();
        setIsSignedIn(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Sign out failed:', err);
      setError('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDemoMode = () => {
    const newDemoMode = !isDemoMode;
    setIsDemoMode(newDemoMode);
    setError(null);
    
    if (newDemoMode) {
      // Entering demo mode - sign in with demo user
      setIsSignedIn(true);
      setUser(demoUser);
    } else {
      // Exiting demo mode - sign out
      setIsSignedIn(false);
      setUser(null);
    }
  };

  return {
    isSignedIn,
    isLoading,
    user,
    signIn,
    signOut,
    error,
    isDemoMode,
    toggleDemoMode
  };
};