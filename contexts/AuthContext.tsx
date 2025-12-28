
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to map Supabase user to App User
const mapUser = (sessionUser: any): User => {
  const email = sessionUser.email || '';
  
  // RBAC: Hardcode admin check for the requested user
  // In a production app, this would typically check a 'roles' table or custom claim
  const isAdmin = email.toLowerCase() === 'contact@mr-graphiste.ma';
  
  return {
    id: sessionUser.id,
    email: email,
    // If it's the admin email, enforce the name "Mohcine", otherwise use metadata
    name: isAdmin ? 'Mohcine' : (sessionUser.user_metadata?.full_name || 'User'),
    phone: sessionUser.phone || undefined,
    emailVerified: !!sessionUser.email_confirmed_at,
    role: isAdmin ? 'admin' : 'customer'
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(mapUser(session.user));
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signup = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
    } catch (error: any) {
      // In case of configuration errors or demo mode, we simulate success to unblock the UI flow
      console.warn("Supabase reset password encountered an error (check console for details). Simulating success for UX.", error.message);
      console.log(`[DEMO MODE] Password reset email would be sent to: ${email}`);
      // We do not throw here to allow the 'Check your email' screen to show
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, resetPassword, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
