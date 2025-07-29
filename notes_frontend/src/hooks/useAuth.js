/**
 * useAuth - Manages user authentication state and JWT storage.
 * Provides login/logout methods and user/token state.
 * To be implemented: token persistence, auto-fetch profile, etc.
 */
import { useState } from 'react';

// PUBLIC_INTERFACE
export function useAuth() {
  // username/email and token state
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // PUBLIC_INTERFACE
  async function login(email, password) {
    // TODO - implement with API
    // Simulate 'login'
    setToken('dummy-token');
    setUser({email});
    // Should call API and get user/token, handle errors.
    return true;
  }

  // PUBLIC_INTERFACE
  function logout() {
    setToken(null);
    setUser(null);
  }

  return {
    user,
    token,
    login,
    logout,
    // To be implemented: register, restore session...
  }
}
