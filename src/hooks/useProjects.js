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
 * @property {() => void} retry
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
  const fetchProjects = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const data = await getProjects();

      // Ignore stale responses from a previous request.
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setProjects(data);
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
    fetchProjects();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchProjects]);

  // ------------------------------------------------------------------
  // Stable retry callback (same reference across renders)
  // ------------------------------------------------------------------
  const retry = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, retry };
}
