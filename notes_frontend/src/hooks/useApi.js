/**
 * useApi - Provides API utility methods with authentication token handling.
 * Utilizes fetch, automatically injecting JWT if present.
 */
import { useCallback } from 'react';

// PUBLIC_INTERFACE
export function useApi(token) {
  // PUBLIC_INTERFACE
  /**
   * Generic request function (supports params, headers, body).
   */
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
      // 204 No Content: return nothing.
      if (response.status === 204) return undefined;
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'API error');
      }
      return data;
    },
    [token]
  );

  // PUBLIC_INTERFACE
  /**
   * Fetch helpers
   */
  const get = useCallback((url, params) =>
    request(url, { method: 'GET', params }), [request]);
  const post = useCallback((url, body) =>
    request(url, { method: 'POST', body }), [request]);
  const put = useCallback((url, body) =>
    request(url, { method: 'PUT', body }), [request]);
  const del = useCallback((url) =>
    request(url, { method: 'DELETE' }), [request]);

  return { request, get, post, put, del };
}
