import { useMemo } from 'react';
import { getSystemArchitecture } from '../services/architectureService';

/**
 * @typedef {import('../services/architectureService').SystemArchitecture} SystemArchitecture
 */

/**
 * @typedef {object} UseArchitectureResult
 * @property {SystemArchitecture|null} graph  – The validated, positioned graph, or null
 * @property {boolean} loading
 * @property {Error|null} error
 * @property {() => void} retry
 */

/**
 * Hook that extracts and validates systemArchitecture from the case study's
 * portfolio.json metadata.
 *
 * The architecture data is already fetched as part of the case study, so this
 * hook is synchronous — it just validates and positions the graph.
 *
 * @param {import('../services/repositoryMetadataService').PortfolioMetadata|null} metadata
 * @returns {UseArchitectureResult}
 */
export function useArchitecture(metadata) {
  const graph = useMemo(() => {
    if (!metadata) return null;
    try {
      return getSystemArchitecture(metadata);
    } catch {
      return null;
    }
  }, [metadata]);

  return {
    graph,
    loading: false,
    error: null,
    retry: () => {},
  };
}
