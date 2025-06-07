import React from "react";
import { Navigate } from "react-router-dom";

// Utility function to check if a token exists and is valid
const isAuthenticated = () => {
  const token = localStorage.getItem('token'); // Replace 'authToken' with your token key
  // Add your logic to validate the token if needed
  return !!token;
};

const AuthProtected = ({ children }) => {
  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export { AuthProtected };
