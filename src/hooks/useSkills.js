import { useState, useEffect, useRef, useCallback } from 'react';
import { getSkills } from '../services/skillService';

/**
 * @typedef {import('../services/skillService').SkillGroup} SkillGroup
 */

/**
 * @typedef {object} UseSkillsResult
 * @property {SkillGroup[]} skills
 * @property {boolean} loading
 * @property {Error|null} error
 * @property {() => void} retry
 */

/**
 * React hook that fetches GitHub-derived skills and manages loading / error
 * state.
 *
 * Mirrors the `useProjects` hook pattern so consumers have a consistent
 * interface.
 *
 * @returns {UseSkillsResult}
 */
export function useSkills() {
  const [skills, setSkills] = useState(/** @type {SkillGroup[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(/** @type {Error|null} */ (null));

  // Track mounted state to avoid setting state after unmount.
  const mountedRef = useRef(true);

  // Track the latest request so stale responses are ignored.
  const requestIdRef = useRef(0);

  // ------------------------------------------------------------------
  // Fetch function (stable reference via useCallback)
  // ------------------------------------------------------------------
  const fetchSkills = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const data = await getSkills();

      // Ignore stale responses from a previous request.
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setSkills(data);
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
    fetchSkills();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchSkills]);

  // ------------------------------------------------------------------
  // Stable retry callback (same reference across renders)
  // ------------------------------------------------------------------
  const retry = useCallback(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skills, loading, error, retry };
}
