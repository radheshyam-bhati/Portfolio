import { useState, useEffect, useRef, useCallback } from 'react';
import { search } from '../services/searchService';

/**
 * @typedef {import('../services/searchService').SearchResult} SearchResult
 * @typedef {import('../services/knowledgeService').SearchDocument} SearchDocument
 */

/**
 * @typedef {object} UsePortfolioSearchResult
 * @property {string} query
 * @property {SearchDocument[]} results
 * @property {number} total
 * @property {boolean} loading
 * @property {Error|null} error
 * @property {(q: string) => void} search
 * @property {() => void} clear
 */

/**
 * React hook that provides live portfolio search.
 *
 * Calls the underlying `searchService.search()` on every `query` change.
 * Debouncing is left to the caller (e.g. via a debounced input), but the
 * hook itself is designed to handle high-frequency updates gracefully via
 * the standard mountedRef + requestIdRef pattern — stale responses are
 * ignored.
 *
 * Designed so that `searchService.search()` can later be swapped for an
 * AI-backed engine (OpenAI / Gemini / Claude / local LLM) without
 * changing this hook's API.
 *
 * @returns {UsePortfolioSearchResult}
 */
export function usePortfolioSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(/** @type {SearchDocument[]} */ ([]));
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(/** @type {Error|null} */ (null));

  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);

  // ------------------------------------------------------------------
  // Fetch function — stable reference via useCallback
  // ------------------------------------------------------------------
  const performSearch = useCallback(async (q) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const result = await search(q);

      if (!mountedRef.current || requestId !== requestIdRef.current) return;

      setResults(result.items);
      setTotal(result.total);
    } catch (err) {
      if (!mountedRef.current || requestId !== requestIdRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
      setResults([]);
      setTotal(0);
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // ------------------------------------------------------------------
  // Effect: re-search on every query change
  // ------------------------------------------------------------------
  useEffect(() => {
    // Don't build the knowledge base until the user actually searches.
    // This avoids unnecessary network calls on mount when the assistant
    // has never been opened.
    if (query.length < 2) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    performSearch(query);
  }, [query, performSearch]);

  // ------------------------------------------------------------------
  // Public API
  // ------------------------------------------------------------------
  const search_ = useCallback((q) => {
    setQuery(q);
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setTotal(0);
    setError(null);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { query, results, total, loading, error, search: search_, clear };
}
