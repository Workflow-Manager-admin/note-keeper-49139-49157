/**
 * useAuth - Manages user authentication state and JWT storage.
 * Provides login/logout methods and user/token state.
 * To be implemented: token persistence, auto-fetch profile, etc.
 */
import { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * Hook to manage user authentication and JWT storage.
 * Handles login/logout, persistence, and auto-retrieval of user.
 */
export function useAuth() {
  // Try session persistence via localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  // Utility to parse JWT (for displaying email in user)
  function parseJwt(token) {
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, "+").replace(/_/g, "/");
      const jsonStr = decodeURIComponent(atob(base64).split("").map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Log in user against backend API; on success, persist token & user.
   * @param {string} email
   * @param {string} password
   * @throws Error if API login fails
   */
  async function login(email, password) {
    const response = await fetch('/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }
    // Save token
    setToken(data.access_token);
    localStorage.setItem('token', data.access_token);
    // Parse user info from JWT if possible, else fallback to known email
    let decoded = parseJwt(data.access_token);
    let userObj = decoded?.sub
      ? { email: decoded.sub }
      : { email };
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
    return true;
  }

  // PUBLIC_INTERFACE
  /**
   * Logs out, removing credentials from state and storage.
   */
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // PUBLIC_INTERFACE
  /**
   * On initial mount, restore login session from localStorage.
   */
  useEffect(() => {
    if (!token) {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  return {
    user,
    token,
    login,
    logout,
    // To be implemented: register, restore session...
  }
}
