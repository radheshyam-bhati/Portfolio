import { useState, useEffect, useRef, useCallback } from 'react';
import { buildDashboard } from '../services/dashboardService';

/**
 * @typedef {import('../services/dashboardService').DashboardModel} DashboardModel
 */

/**
 * @typedef {object} UseDashboardResult
 * @property {DashboardModel|null} dashboard
 * @property {boolean} loading
 * @property {Error|null} error
 * @property {() => void} retry
 * @property {() => void} refresh
 */

/**
 * React hook that builds the Engineering Dashboard and manages loading /
 * error state.
 *
 * Mirrors the `useProjects`, `useSkills`, and `useProfile` hook patterns
 * for consistency across the application.
 *
 * @param {object} [options]
 * @param {boolean} [options.lazy=false] – When true, skips fetching until
 *   `retry` or `refresh` is called.
 * @returns {UseDashboardResult}
 */
export function useDashboard({ lazy = false } = {}) {
  const [dashboard, setDashboard] = useState(/** @type {DashboardModel|null} */ (null));
  const [loading, setLoading] = useState(!lazy);
  const [error, setError] = useState(/** @type {Error|null} */ (null));

  // Track mounted state to avoid setting state after unmount.
  const mountedRef = useRef(true);

  // Track the latest request so stale responses are ignored.
  const requestIdRef = useRef(0);

  // ------------------------------------------------------------------
  // Fetch function (stable reference via useCallback)
  // ------------------------------------------------------------------
  const fetchDashboard = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const data = await buildDashboard();

      // Ignore stale responses from a previous request.
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setDashboard(data);
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
  // Initial fetch on mount (when not lazy)
  // ------------------------------------------------------------------
  useEffect(() => {
    mountedRef.current = true;

    if (!lazy) {
      fetchDashboard();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [lazy, fetchDashboard]);

  // ------------------------------------------------------------------
  // Stable retry callback (same reference across renders)
  // ------------------------------------------------------------------
  const retry = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Alias for clarity — retry and refresh do the same thing
  const refresh = retry;

  return { dashboard, loading, error, retry, refresh };
}
