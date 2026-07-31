import { useState, useEffect, useRef, useCallback } from 'react';
import { getCaseStudy } from '../services/caseStudyService';
import { fetchSingleMetadata } from '../services/repositoryMetadataService';

/**
 * @typedef {import('../services/caseStudyService').CaseStudy} CaseStudy
 */

/**
 * @typedef {object} UseCaseStudyResult
 * @property {CaseStudy|null} caseStudy
 * @property {boolean} loading
 * @property {Error|null} error
 * @property {() => void} retry
 */

/**
 * Lazy-loads a complete case study for a project.
 *
 * Only starts fetching when `shouldFetch` becomes `true` (e.g. when the
 * modal opens).  Fetches portfolio.json metadata, README, architecture
 * diagram, demo GIF, and screenshots in a single orchestrated call.
 *
 * Results are cached in the underlying services so subsequent calls
 * for the same repository are instant.
 *
 * @param {import('../services/projectService').Project} project
 * @param {boolean} shouldFetch
 * @returns {UseCaseStudyResult}
 */
export function useCaseStudy(project, shouldFetch = false) {
  const [caseStudy, setCaseStudy] = useState(/** @type {CaseStudy|null} */ (null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(/** @type {Error|null} */ (null));

  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      // Fetch portfolio.json metadata for this single repo
      const metadata = await fetchSingleMetadata(
        project.repoName,
        project.defaultBranch,
      );

      if (!mountedRef.current || requestId !== requestIdRef.current) return;

      // Build the full case study from all sources
      const result = await getCaseStudy(
        project.repoName,
        project.defaultBranch,
        metadata,
      );

      if (!mountedRef.current || requestId !== requestIdRef.current) return;

      setCaseStudy(result);
    } catch (err) {
      if (!mountedRef.current || requestId !== requestIdRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [project.repoName, project.defaultBranch]);

  useEffect(() => {
    if (!shouldFetch) return;

    mountedRef.current = true;
    load();

    return () => {
      mountedRef.current = false;
    };
  }, [shouldFetch, load]);

  const retry = useCallback(() => {
    load();
  }, [load]);

  return { caseStudy, loading, error, retry };
}
