import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchRepoLanguages } from '../services/githubService';
import { languageBytesToStats, topLanguageStats } from '../utils/githubMapper';

/**
 * @typedef {import('../utils/githubMapper').LanguageStat} LanguageStat
 */

/**
 * @typedef {object} UseProjectLanguagesResult
 * @property {LanguageStat[]} languages – Top 5 languages with normalized percentages
 * @property {boolean} loading
 * @property {Error|null} error
 * @property {boolean} loaded – true once the first fetch completed (success or failure)
 * @property {() => void} load – trigger a fetch (idempotent when already loaded)
 * @property {() => void} retry – force a refetch
 */

/**
 * Lazy-loads a repository's language breakdown (top 5, normalized).
 *
 * MUST NOT fetch on mount (unlike useProjects.js): it exposes a `load()`
 * trigger that the detail modal calls when it opens. This lazy behavior is
 * required by research D2 to respect the GitHub unauthenticated rate limit
 * (60 req/hr) — the breakdown costs one extra request per repo.
 *
 * @param {string|null} repoName
 * @returns {UseProjectLanguagesResult}
 */
export function useProjectLanguages(repoName) {
  const [languages, setLanguages] = useState(/** @type {LanguageStat[]} */ ([]));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(/** @type {Error|null} */ (null));
  const [loaded, setLoaded] = useState(false);

  // Track mounted state to avoid setting state after unmount.
  const mountedRef = useRef(true);

  // Track the latest request so stale responses are ignored.
  const requestIdRef = useRef(0);

  // Guard so `load` keeps a stable identity across renders (prevents the
  // consumer effect from re-firing when `loaded` flips).
  const loadedRef = useRef(false);

  // ------------------------------------------------------------------
  // Fetch function (stable reference via useCallback)
  // ------------------------------------------------------------------
  const fetchLanguages = useCallback(async () => {
    if (!repoName) {
      setLoaded(true);
      return;
    }

    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const bytes = await fetchRepoLanguages(repoName);

      // Ignore stale responses from a previous request.
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      const stats = languageBytesToStats(bytes);
      setLanguages(topLanguageStats(stats, 5));
    } catch (err) {
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
        setLoaded(true);
      }
    }
  }, [repoName]);

  // ------------------------------------------------------------------
  // Mount lifecycle
  // ------------------------------------------------------------------
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ------------------------------------------------------------------
  // Stable load trigger (no-op when already loaded so re-opening the
  // modal does not refetch)
  // ------------------------------------------------------------------
  const load = useCallback(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    fetchLanguages();
  }, [fetchLanguages]);

  // ------------------------------------------------------------------
  // Stable retry callback (same reference across renders)
  // ------------------------------------------------------------------
  const retry = useCallback(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return { languages, loading, error, loaded, load, retry };
}
