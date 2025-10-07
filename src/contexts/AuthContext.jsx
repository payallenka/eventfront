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
        if (data.user) {
          // User exists, set user and continue to dashboard
          setUser(data.user);
          setNeedsRegistration(false);
          setPendingUserData(null);
          localStorage.setItem('authToken', token);
          console.log('Backend login successful');
        } else {
          // User doesn't exist, need registration
          setNeedsRegistration(true);
          setPendingUserData({
            email: supabaseUser.email,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
            picture: supabaseUser.user_metadata?.avatar_url || '',
            token: token
          });
          console.log('User needs registration');
        }
      } else {
        console.error('Backend login failed:', response.status);
        // If backend is down/CORS issue, sign out from Supabase and show login
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setNeedsRegistration(false);
        setPendingUserData(null);
      }
    } catch (error) {
      console.error('Backend login failed:', error);
      // If backend is down/CORS issue, sign out from Supabase and show login
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setNeedsRegistration(false);
      setPendingUserData(null);
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
      const response = await fetch('https://eventbackend-kb4u.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pendingUserData,
          ...userData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setNeedsRegistration(false);
        setPendingUserData(null);
        localStorage.setItem('authToken', pendingUserData.token);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Registration failed' };
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
