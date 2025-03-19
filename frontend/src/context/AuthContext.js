import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // On initial load, check if admin is logged in from localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsAdminLoggedIn(loggedIn);
  }, []);

  const login = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('isAdminLoggedIn', true); // Persist login state
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('isAdminLoggedIn'); // Clear login state
  };

  return (
    <AuthContext.Provider value={{ isAdminLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
