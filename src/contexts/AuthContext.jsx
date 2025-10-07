import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        await loginToBackend(session.access_token, session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        await loginToBackend(session.access_token, session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginToBackend = async (token, supabaseUser) => {
    try {
      console.log('Attempting to login to backend...');
      const response = await fetch('https://eventbackend-kb4u.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
          picture: supabaseUser.user_metadata?.avatar_url || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Backend response:', data);
        if (data.user) {
          // User exists, set user and continue to dashboard
          setUser(data.user);
          setNeedsRegistration(false);
          setPendingUserData(null);
          localStorage.setItem('authToken', token);
          console.log('Backend login successful');
        } else {
          // User doesn't exist, need registration
          console.log('User needs registration, setting pendingUserData');
          const pendingData = {
            email: supabaseUser.email,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
            picture: supabaseUser.user_metadata?.avatar_url || '',
            token: token
          };
          console.log('Setting pendingUserData:', pendingData);
          setNeedsRegistration(true);
          setPendingUserData(pendingData);
          console.log('User needs registration');
        }
      } else {
        console.error('Backend login failed:', response.status);
        
        // For 500 errors, treat as if user doesn't exist (trigger registration)
        // This handles the case where backend has issues but we still want to allow registration
        if (response.status === 500) {
          console.log('Backend error 500 - treating as new user needing registration');
          const pendingData = {
            email: supabaseUser.email,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
            picture: supabaseUser.user_metadata?.avatar_url || '',
            token: token
          };
          console.log('Setting pendingUserData for 500 error:', pendingData);
          setNeedsRegistration(true);
          setPendingUserData(pendingData);
        } else {
          // For other errors (404, 401, etc.), sign out and show login
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setNeedsRegistration(false);
          setPendingUserData(null);
        }
      }
    } catch (error) {
      console.error('Backend login failed:', error);
      
      // For network errors, treat as if user doesn't exist (allow registration attempt)
      // This is more user-friendly than immediately signing out
      console.log('Network error - treating as new user needing registration');
      const pendingData = {
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
        picture: supabaseUser.user_metadata?.avatar_url || '',
        token: token
      };
      console.log('Setting pendingUserData for network error:', pendingData);
      setNeedsRegistration(true);
      setPendingUserData(pendingData);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) console.error('Error signing in with Google:', error);
  };

  const registerUser = async (userData) => {
    try {
      console.log('Starting registration process...');
      console.log('pendingUserData:', pendingUserData);
      console.log('userData:', userData);
      
      if (!pendingUserData) {
        console.error('No pending user data available');
        return { success: false, error: 'Registration data missing. Please try signing in again.' };
      }

      const registrationData = {
        ...pendingUserData,
        ...userData
      };
      
      console.log('Final registration data:', registrationData);

      const response = await fetch('https://eventbackend-kb4u.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      console.log('Registration response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        setUser(data.user);
        setNeedsRegistration(false);
        setPendingUserData(null);
        localStorage.setItem('authToken', pendingUserData.token);
        return { success: true };
      } else {
        const errorData = await response.json();
        console.error('Registration failed with error:', errorData);
        return { success: false, error: errorData.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Registration failed: ' + error.message };
    }
  };

  const signOut = async () => {
    console.log('Starting signOut...');
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    console.log('Supabase signOut result:', { error });
    
    // Clear all state
    setUser(null);
    setSession(null);
    setNeedsRegistration(false);
    setPendingUserData(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    setLoading(false);
    console.log('SignOut complete, should show login now');
  };

  // Alias for logout - same functionality
  const logout = signOut;

  const isAdmin = user?.role === 'ADMIN';

  const value = {
    user,
    session,
    loading,
    needsRegistration,
    pendingUserData,
    signInWithGoogle,
    registerUser,
    signOut,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
