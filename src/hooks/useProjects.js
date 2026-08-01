import { useState, useEffect, useRef, useCallback } from 'react';
import { getProjects } from '../services/projectService';

/**
 * @typedef {import('../services/projectService').Project} Project
 */

/**
 * @typedef {object} UseProjectsResult
 * @property {Project[]} projects
 * @property {boolean} loading
 * @property {Error|null} error
 * @property {() => void} retry           – Visible refresh (shows skeleton + errors)
 * @property {() => void} refreshSilently – Background refresh (keeps current UI)
 */

/**
 * React hook that fetches GitHub-hosted projects and manages loading / error
 * state.
 *
 * The hook returns a stable `retry` callback that consumers can wire to a
 * "Retry" button in the error UI.
 *
 * @returns {UseProjectsResult}
 */
export function useProjects() {
  const [projects, setProjects] = useState(/** @type {Project[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(/** @type {Error|null} */ (null));

  // Track mounted state to avoid setting state after unmount.
  const mountedRef = useRef(true);

  // Track the latest request so stale responses are ignored.
  const requestIdRef = useRef(0);

  // ------------------------------------------------------------------
  // Fetch function (stable reference via useCallback)
  // ------------------------------------------------------------------
  const fetchProjects = useCallback(async ({ silent = false } = {}) => {
    const requestId = ++requestIdRef.current;

    // A visible fetch shows the skeleton and surfaces errors; a silent
    // (background) fetch keeps the current UI on screen — it only swaps in
    // new data when it arrives, and never replaces a good state with an error.
    if (!silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await getProjects();

      // Ignore stale responses from a previous request.
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setProjects(data);

      // A silent refresh that succeeds clears any stale error state.
      setError(null);
    } catch (err) {
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      // Silent refreshes never clobber the current view with an error;
      // the last good data stays on screen until the next fetch.
      if (!silent) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      // Always clear loading for the LATEST request, silent or not. Without
      // this, a silent refresh that supersedes an in-flight visible fetch
      // (e.g. tab-return during a manual refresh) would leave `loading` stuck
      // `true` and the skeleton visible forever.
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
    fetchProjects();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchProjects]);

  // ------------------------------------------------------------------
  // Stable retry callbacks (same references across renders)
  // ------------------------------------------------------------------
  const retry = useCallback(() => {
    fetchProjects({ silent: false });
  }, [fetchProjects]);

  const refreshSilently = useCallback(() => {
    fetchProjects({ silent: true });
  }, [fetchProjects]);

  return { projects, loading, error, retry, refreshSilently };
}
