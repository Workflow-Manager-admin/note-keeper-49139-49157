/**
 * useApi - Provides API utility methods with authentication token handling.
 * Utilizes fetch, automatically injecting JWT if present.
 */
import { useCallback } from 'react';

// PUBLIC_INTERFACE
export function useApi(token) {

  // PUBLIC_INTERFACE
  const request = useCallback(
    async (endpoint, { method = 'GET', body, headers = {}, params } = {}) => {
      let url = endpoint;
      if (params) {
        const q = new URLSearchParams(params).toString();
        url += (url.includes('?') ? '&' : '?') + q;
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
          ...headers
        },
        ...(body ? { body: JSON.stringify(body) } : {})
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || 'API error');
      }
      return data;
    },
    [token]
  );

  // TODO: Add CRUD helpers (get/post/put/delete)
  return { request };
}
