import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, getUsers, saveCurrentUser, saveUsers } from '../utils/storage';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // In a real app, this would be an API call with proper authentication
    // For this demo, we just check if the user exists
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    setCurrentUser(user);
    saveCurrentUser(user);
    return user;
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    // In a real app, this would be an API call with proper validation
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      throw new Error('Email already in use');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      isAdmin: false,
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    saveCurrentUser(newUser);
    
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isLoading }}>
      {children}
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