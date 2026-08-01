import { useState, useEffect, useRef, useCallback } from 'react';
import { getProfile } from '../services/profileService';

/**
 * @typedef {import('../services/profileService').Profile} Profile
 */

/**
 * @typedef {object} UseProfileResult
 * @property {Profile|null} profile
 * @property {boolean} loading
 * @property {Error|null} error
 * @property {() => void} retry
 */

/**
 * React hook that fetches the GitHub user profile and manages loading / error
 * state.
 *
 * Mirrors the `useProjects` and `useSkills` hook patterns for consistency.
 *
 * @returns {UseProfileResult}
 */
export function useProfile() {
  const [profile, setProfile] = useState(/** @type {Profile|null} */ (null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(/** @type {Error|null} */ (null));

  // Track mounted state to avoid setting state after unmount.
  const mountedRef = useRef(true);

  // Track the latest request so stale responses are ignored.
  const requestIdRef = useRef(0);

  // ------------------------------------------------------------------
  // Fetch function (stable reference via useCallback)
  // ------------------------------------------------------------------
  const fetchProfile = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const data = await getProfile();

      // Ignore stale responses from a previous request.
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setProfile(data);
    } catch (err) {
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // ------------------------------------------------------------------
  // Initial fetch on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    mountedRef.current = true;
    fetchProfile();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchProfile]);

  // ------------------------------------------------------------------
  // Stable retry callback (same reference across renders)
  // ------------------------------------------------------------------
  const retry = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, retry };
}
